import React, { useMemo, useState } from 'react';
import { CompanyProfile, TickerSymbol } from '../../types/financial';

interface ComparisonChartProps {
  companies: CompanyProfile[];
}

const SERIES_COLORS: Record<TickerSymbol, string> = {
  AMD: '#0A1628',
  NVDA: '#15803D',
  WMT: '#2563EB',
  MSFT: '#D97706',
};

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ companies }) => {
  const [monthsCount, setMonthsCount] = useState<13 | 37 | 60>(37);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const normalizedSeries = useMemo(() => {
    return companies.map((c) => {
      const slice = c.stockHistory5Y.slice(Math.max(0, c.stockHistory5Y.length - monthsCount));
      const base = slice[0]?.price || 1;
      const points = slice.map((pt) => ({
        label: pt.label,
        date: pt.date,
        indexed: (pt.price / base) * 100,
        price: pt.price,
      }));
      return {
        ticker: c.ticker,
        name: c.name,
        color: SERIES_COLORS[c.ticker],
        points,
      };
    });
  }, [companies, monthsCount]);

  const allIndexed = normalizedSeries.flatMap((s) => s.points.map((p) => p.indexed));
  const minVal = Math.min(...allIndexed, 80) * 0.92;
  const maxVal = Math.max(...allIndexed, 120) * 1.06;
  const range = maxVal - minVal || 1;

  const width = 740;
  const height = 290;
  const padLeft = 56;
  const padRight = 24;
  const padTop = 22;
  const padBottom = 34;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const sampleLength = normalizedSeries[0]?.points.length ?? 0;
  const activeIdx = hoverIdx !== null && hoverIdx < sampleLength ? hoverIdx : sampleLength - 1;

  const baseline100Y = padTop + ((maxVal - 100) / range) * chartH;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-[#0A1628]">
            Normalized Stock Growth Comparison (Base 100 · Illustrative)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Starts every company at 100 so beginners can compare percentage growth fairly regardless of share price.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
          {(
            [
              { label: '1Y', val: 13 },
              { label: '3Y', val: 37 },
              { label: '5Y', val: 60 },
            ] as const
          ).map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setMonthsCount(item.val);
                setHoverIdx(null);
              }}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                monthsCount === item.val
                  ? 'bg-[#0A1628] text-white'
                  : 'text-slate-600 hover:text-[#0A1628]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[480px] select-none"
          onMouseLeave={() => setHoverIdx(null)}
          role="img"
          aria-label="Normalized stock comparison chart"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
            const val = maxVal - t * range;
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
                  {val.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* 100 starting reference line */}
          {baseline100Y >= padTop && baseline100Y <= padTop + chartH && (
            <line
              x1={padLeft}
              y1={baseline100Y}
              x2={width - padRight}
              y2={baseline100Y}
              stroke="#94A3B8"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
          )}

          {normalizedSeries.map((series) => {
            const coords = series.points.map((pt, idx) => {
              const x = padLeft + (idx / Math.max(1, series.points.length - 1)) * chartW;
              const y = padTop + ((maxVal - pt.indexed) / range) * chartH;
              return { x, y, ...pt };
            });
            const path = coords
              .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
              .join(' ');
            const activePt = coords[activeIdx];
            return (
              <g key={series.ticker}>
                <path d={path} fill="none" stroke={series.color} strokeWidth={2.4} strokeLinejoin="round" />
                {activePt && (
                  <circle
                    cx={activePt.x}
                    cy={activePt.y}
                    r={4.5}
                    fill={series.color}
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                  />
                )}
              </g>
            );
          })}

          {/* Hover vertical line & targets */}
          {sampleLength > 0 && (
            <>
              <line
                x1={padLeft + (activeIdx / Math.max(1, sampleLength - 1)) * chartW}
                y1={padTop}
                x2={padLeft + (activeIdx / Math.max(1, sampleLength - 1)) * chartW}
                y2={padTop + chartH}
                stroke="#CBD5E1"
                strokeDasharray="3 3"
              />
              {normalizedSeries[0].points.map((pt, idx) => {
                const x = padLeft + (idx / Math.max(1, sampleLength - 1)) * chartW;
                const sliceW = chartW / Math.max(1, sampleLength);
                return (
                  <rect
                    key={pt.date}
                    x={x - sliceW / 2}
                    y={padTop}
                    width={Math.max(sliceW, 6)}
                    height={chartH}
                    fill="transparent"
                    className="cursor-crosshair"
                    onMouseEnter={() => setHoverIdx(idx)}
                  />
                );
              })}
            </>
          )}

          {/* X-axis start / mid / end labels */}
          {sampleLength > 1 &&
            [0, Math.floor((sampleLength - 1) / 2), sampleLength - 1].map((idx) => {
              const x = padLeft + (idx / Math.max(1, sampleLength - 1)) * chartW;
              return (
                <text
                  key={idx}
                  x={x}
                  y={height - 10}
                  textAnchor={idx === 0 ? 'start' : idx === sampleLength - 1 ? 'end' : 'middle'}
                  className="fill-slate-500 text-[11px] font-mono"
                >
                  {normalizedSeries[0].points[idx].label}
                </text>
              );
            })}
        </svg>
      </div>

      {/* Legend + Current Inspection Values */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 text-xs">
        <span className="font-mono text-slate-500">
          Period Point: <strong className="text-[#0A1628]">{normalizedSeries[0]?.points[activeIdx]?.label}</strong>
        </span>
        <div className="flex flex-wrap items-center gap-5 font-mono tabular-nums">
          {normalizedSeries.map((s) => {
            const pt = s.points[activeIdx];
            const returnPct = pt ? pt.indexed - 100 : 0;
            return (
              <div key={s.ticker} className="flex items-center gap-2">
                <span className="inline-block w-3 h-0.5" style={{ backgroundColor: s.color }} />
                <span className="font-semibold text-[#0A1628]">{s.ticker}</span>
                <span className={returnPct >= 0 ? 'text-[#15803D]' : 'text-[#DC2626]'}>
                  {returnPct >= 0 ? '+' : ''}
                  {returnPct.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
