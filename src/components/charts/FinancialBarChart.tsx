import React, { useState } from 'react';
import { FinancialPeriod } from '../../types/financial';

export type FinancialMetricKey = 'revenueB' | 'grossProfitB' | 'netIncomeB' | 'freeCashFlowB' | 'eps';

interface FinancialBarChartProps {
  data: FinancialPeriod[];
  metric: FinancialMetricKey;
  metricLabel: string;
}

export const FinancialBarChart: React.FC<FinancialBarChartProps> = ({ data, metric, metricLabel }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const values = data.map((d) => d[metric]);
  const maxVal = Math.max(...values, 0.01) * 1.16;
  const minVal = Math.min(0, ...values);
  const range = maxVal - minVal || 1;

  const width = 680;
  const height = 270;
  const padLeft = 58;
  const padRight = 20;
  const padTop = 24;
  const padBottom = 38;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const zeroY = padTop + ((maxVal - 0) / range) * chartH;
  const gridTicks = 4;

  const formatValue = (val: number) => {
    if (metric === 'eps') return `$${val.toFixed(2)}`;
    if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(2)}T`;
    return `$${val.toFixed(1)}B`;
  };

  return (
    <div className="relative w-full">
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[460px] select-none"
          role="img"
          aria-label={`Historical ${metricLabel} bar chart`}
        >
          {/* Horizontal Gridlines */}
          {Array.from({ length: gridTicks + 1 }).map((_, idx) => {
            const val = minVal + (range / gridTicks) * (gridTicks - idx);
            const y = padTop + (idx / gridTicks) * chartH;
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray={idx === gridTicks ? undefined : '3 3'}
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

          {/* Bars */}
          {data.map((item, idx) => {
            const slotW = chartW / data.length;
            const barW = Math.min(54, slotW * 0.56);
            const x = padLeft + idx * slotW + (slotW - barW) / 2;
            const val = item[metric];
            const barTopY = padTop + ((maxVal - Math.max(0, val)) / range) * chartH;
            const barBottomY = padTop + ((maxVal - Math.min(0, val)) / range) * chartH;
            const barH = Math.max(3, barBottomY - barTopY);

            const isHovered = hoveredIdx === idx;
            const isLatest = idx === data.length - 1;
            const prevVal = idx > 0 ? data[idx - 1][metric] : null;
            const yoy =
              prevVal && prevVal !== 0 ? (((val - prevVal) / Math.abs(prevVal)) * 100).toFixed(1) : null;

            return (
              <g
                key={item.period}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Invisible hit target for easier hovering */}
                <rect x={padLeft + idx * slotW} y={padTop} width={slotW} height={chartH} fill="transparent" />

                <rect
                  x={x}
                  y={barTopY}
                  width={barW}
                  height={barH}
                  rx={4}
                  fill={isHovered ? '#15803D' : isLatest ? '#0A1628' : '#334155'}
                  opacity={hoveredIdx !== null && !isHovered ? 0.55 : 1}
                  className="transition-opacity duration-150"
                />

                {/* Value label above bar */}
                <text
                  x={x + barW / 2}
                  y={barTopY - 7}
                  textAnchor="middle"
                  className={`text-[11px] font-mono tabular-nums ${
                    isHovered ? 'fill-[#15803D] font-semibold' : 'fill-slate-700 font-medium'
                  }`}
                >
                  {formatValue(val)}
                </text>

                {/* Period X-axis label */}
                <text
                  x={x + barW / 2}
                  y={height - 12}
                  textAnchor="middle"
                  className={`text-[11px] font-mono ${isHovered ? 'fill-[#0A1628] font-semibold' : 'fill-slate-500'}`}
                >
                  {item.period}
                </text>

                {/* Hover YoY Callout */}
                {isHovered && yoy !== null && (
                  <g transform={`translate(${Math.min(Math.max(x + barW / 2, 85), width - 85)}, ${Math.max(barTopY - 34, 16)})`}>
                    <rect x={-56} y={-14} width={112} height={22} rx={4} fill="#0A1628" />
                    <text
                      x={0}
                      y={1}
                      textAnchor="middle"
                      className="fill-white text-[10px] font-mono tabular-nums"
                    >
                      {Number(yoy) >= 0 ? `+${yoy}%` : `${yoy}%`} vs prior
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Baseline */}
          <line x1={padLeft} y1={zeroY} x2={width - padRight} y2={zeroY} stroke="#CBD5E1" strokeWidth={1.2} />
        </svg>
      </div>
    </div>
  );
};
