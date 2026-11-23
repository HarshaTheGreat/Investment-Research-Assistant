import React, { useState } from 'react';
import { ProjectionScenario, ProjectionScenarioType } from '../../types/financial';

export type ProjectionMetricKey = 'revenueB' | 'netIncomeB' | 'operatingCashFlowB' | 'eps';

interface ProjectionChartProps {
  projections: Record<ProjectionScenarioType, ProjectionScenario>;
  activeScenario: ProjectionScenarioType | 'all';
  metric: ProjectionMetricKey;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const ProjectionChart: React.FC<ProjectionChartProps> = ({
  projections,
  activeScenario,
  metric,
  title,
  subtitle,
  compact = false,
}) => {
  const [hoveredYearIdx, setHoveredYearIdx] = useState<number | null>(null);

  const years = projections.base.yearly.map((y) => y.year);
  const allVals = [
    ...projections.bear.yearly.map((y) => y[metric]),
    ...projections.base.yearly.map((y) => y[metric]),
    ...projections.bull.yearly.map((y) => y[metric]),
  ];

  const minV = Math.min(...allVals) * 0.85;
  const maxV = Math.max(...allVals) * 1.1;
  const range = maxV - minV || 1;

  const width = compact ? 440 : 680;
  const height = compact ? 230 : 275;
  const padLeft = 58;
  const padRight = 24;
  const padTop = 22;
  const padBottom = 34;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const getCoords = (scenario: ProjectionScenario) =>
    scenario.yearly.map((pt, idx) => {
      const x = padLeft + (idx / Math.max(1, scenario.yearly.length - 1)) * chartW;
      const y = padTop + ((maxV - pt[metric]) / range) * chartH;
      return { x, y, val: pt[metric], year: pt.year };
    });

  const bearPts = getCoords(projections.bear);
  const basePts = getCoords(projections.base);
  const bullPts = getCoords(projections.bull);

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  const rangePolygon = `${toPath(bullPts)} ${[...bearPts]
    .reverse()
    .map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')} Z`;

  const formatValue = (v: number) => {
    if (metric === 'eps') return `$${v.toFixed(2)}`;
    if (v >= 1000) return `$${(v / 1000).toFixed(2)}T`;
    return `$${v.toFixed(1)}B`;
  };

  const seriesConfig: {
    key: ProjectionScenarioType;
    pts: typeof basePts;
    color: string;
    label: string;
    dash?: string;
  }[] = [
    { key: 'bull', pts: bullPts, color: '#15803D', label: 'Bull' },
    { key: 'base', pts: basePts, color: '#0A1628', label: 'Base' },
    { key: 'bear', pts: bearPts, color: '#64748B', label: 'Bear', dash: '5 4' },
  ];

  const activeIdx = hoveredYearIdx ?? years.length - 1;

  return (
    <div className="space-y-3">
      {(title || subtitle) && (
        <div>
          {title && <h3 className="text-base font-bold text-[#0A1628]">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={`w-full h-auto ${compact ? 'min-w-[300px]' : 'min-w-[460px]'} select-none`}
          onMouseLeave={() => setHoveredYearIdx(null)}
          role="img"
          aria-label={`${title ?? metric} 5-year Bear Base Bull projection line chart`}
        >
          {/* Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
            const val = maxV - t * range;
            const y = padTop + t * chartH;
            return (
              <g key={i}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray={i === 4 ? undefined : '3 3'}
                  strokeWidth={1}
                />
                <text
                  x={padLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-500 text-[11px] font-mono tabular-nums"
                >
                  {formatValue(val)}
                </text>
              </g>
            );
          })}

          {/* Scenario Spread Envelope */}
          <path d={rangePolygon} fill="#0A1628" fillOpacity={0.04} />

          {/* Vertical inspection line */}
          {basePts[activeIdx] && (
            <line
              x1={basePts[activeIdx].x}
              y1={padTop}
              x2={basePts[activeIdx].x}
              y2={padTop + chartH}
              stroke="#CBD5E1"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          )}

          {/* Lines */}
          {seriesConfig.map((s) => {
            const isDimmed = activeScenario !== 'all' && activeScenario !== s.key;
            return (
              <g key={s.key} opacity={isDimmed ? 0.22 : 1} className="transition-opacity duration-150">
                <path
                  d={toPath(s.pts)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={activeScenario === s.key || activeScenario === 'all' ? 2.5 : 1.8}
                  strokeDasharray={s.dash}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {s.pts.map((pt, idx) => (
                  <circle
                    key={pt.year}
                    cx={pt.x}
                    cy={pt.y}
                    r={idx === activeIdx ? 4.5 : 3}
                    fill={s.color}
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                  />
                ))}
              </g>
            );
          })}

          {/* X-axis Year Labels */}
          {years.map((yr, idx) => (
            <text
              key={yr}
              x={basePts[idx].x}
              y={height - 10}
              textAnchor="middle"
              className={`text-[11px] font-mono ${
                idx === activeIdx ? 'fill-[#0A1628] font-semibold' : 'fill-slate-500'
              }`}
            >
              {yr}
            </text>
          ))}

          {/* Hover bands */}
          {years.map((yr, idx) => {
            const slotW = chartW / years.length;
            return (
              <rect
                key={yr}
                x={basePts[idx].x - slotW / 2}
                y={padTop}
                width={slotW}
                height={chartH}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredYearIdx(idx)}
              />
            );
          })}
        </svg>
      </div>

      {/* Live readout bar beneath chart */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 text-xs">
        <span className="font-mono font-medium text-slate-600">
          Year: <strong className="text-[#0A1628]">{years[activeIdx]}</strong>
        </span>
        <div className="flex flex-wrap items-center gap-4 font-mono tabular-nums">
          <span className="text-slate-600">
            Bear: <strong className="text-slate-800">{formatValue(bearPts[activeIdx].val)}</strong>
          </span>
          <span className="text-slate-600">
            Base: <strong className="text-[#0A1628]">{formatValue(basePts[activeIdx].val)}</strong>
          </span>
          <span className="text-slate-600">
            Bull: <strong className="text-[#15803D]">{formatValue(bullPts[activeIdx].val)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
