import React, { useMemo, useState } from 'react';
import { StockPricePoint } from '../../types/financial';

export type StockTimeframe = '6M' | '1Y' | '3Y' | '5Y';

interface StockLineChartProps {
  history: StockPricePoint[];
  ticker: string;
}

export const StockLineChart: React.FC<StockLineChartProps> = ({ history, ticker }) => {
  const [timeframe, setTimeframe] = useState<StockTimeframe>('5Y');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const sliced = useMemo(() => {
    const counts: Record<StockTimeframe, number> = {
      '6M': 7,
      '1Y': 13,
      '3Y': 37,
      '5Y': history.length,
    };
    const count = Math.min(counts[timeframe], history.length);
    return history.slice(history.length - count);
  }, [history, timeframe]);

  const startPrice = sliced[0]?.price ?? 0;
  const endPrice = sliced[sliced.length - 1]?.price ?? 0;
  const periodChangePct = startPrice > 0 ? ((endPrice - startPrice) / startPrice) * 100 : 0;
  const isPositive = periodChangePct >= 0;

  const prices = sliced.map((p) => p.price);
  const minP = Math.min(...prices) * 0.92;
  const maxP = Math.max(...prices) * 1.06;
  const rangeP = maxP - minP || 1;

  const width = 720;
  const height = 280;
  const padLeft = 56;
  const padRight = 20;
  const padTop = 22;
  const padBottom = 34;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const points = sliced.map((pt, idx) => {
    const x = padLeft + (idx / Math.max(1, sliced.length - 1)) * chartW;
    const y = padTop + ((maxP - pt.price) / rangeP) * chartH;
    return { x, y, ...pt };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(padTop + chartH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padTop + chartH).toFixed(1)} Z`
      : '';

  const activePoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : points[points.length - 1];
  const strokeColor = isPositive ? '#15803D' : '#DC2626';
  const fillId = `stock-grad-${ticker}-${timeframe}`;

  const xLabelIndices = [0, Math.floor((points.length - 1) / 2), points.length - 1].filter(
    (v, i, arr) => arr.indexOf(v) === i && points[v]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold font-mono tabular-nums text-[#0A1628]">
              ${activePoint ? activePoint.price.toFixed(2) : '0.00'}
            </span>
            <span
              className={`text-sm font-mono font-medium tabular-nums ${
                isPositive ? 'text-[#15803D]' : 'text-[#DC2626]'
              }`}
            >
              {isPositive ? '+' : ''}
              {periodChangePct.toFixed(1)}% ({timeframe} illustrative)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {hoverIndex !== null && activePoint
              ? `${activePoint.label} · Hovering illustrative monthly close`
              : `Latest illustrative close (${activePoint?.label ?? ''})`}
          </p>
        </div>

        {/* Timeframe Segmented Control */}
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
          {(['6M', '1Y', '3Y', '5Y'] as StockTimeframe[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => {
                setTimeframe(tf);
                setHoverIndex(null);
              }}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                timeframe === tf
                  ? 'bg-[#0A1628] text-white'
                  : 'text-slate-600 hover:text-[#0A1628] hover:bg-white/70'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[460px] select-none"
          onMouseLeave={() => setHoverIndex(null)}
          role="img"
          aria-label={`${ticker} ${timeframe} illustrative stock price history`}
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.16" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Y-Axis Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
            const val = maxP - t * rangeP;
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
                  ${val.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Area & Price Line */}
          {areaPath && <path d={areaPath} fill={`url(#${fillId})`} />}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke={strokeColor}
              strokeWidth={2.4}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* Crosshair & Active Dot */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={padTop}
                x2={activePoint.x}
                y2={padTop + chartH}
                stroke="#94A3B8"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
              <circle cx={activePoint.x} cy={activePoint.y} r={5} fill={strokeColor} stroke="#FFFFFF" strokeWidth={2} />
            </g>
          )}

          {/* X-axis dates */}
          {xLabelIndices.map((idx) => {
            const pt = points[idx];
            return (
              <text
                key={pt.date}
                x={pt.x}
                y={height - 10}
                textAnchor={idx === 0 ? 'start' : idx === points.length - 1 ? 'end' : 'middle'}
                className="fill-slate-500 text-[11px] font-mono"
              >
                {pt.label}
              </text>
            );
          })}

          {/* Invisible vertical slice hover targets */}
          {points.map((pt, idx) => {
            const sliceW = chartW / Math.max(1, points.length);
            return (
              <rect
                key={pt.date}
                x={pt.x - sliceW / 2}
                y={padTop}
                width={Math.max(sliceW, 6)}
                height={chartH}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIndex(idx)}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};
