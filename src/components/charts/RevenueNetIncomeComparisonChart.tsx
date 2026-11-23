import React, { useState } from 'react';
import { formatBillions } from '../../services/financialDataService';
import { CompanyProfile } from '../../types/financial';

interface RevenueNetIncomeComparisonChartProps {
  companyA: CompanyProfile;
  companyB: CompanyProfile;
}

export const RevenueNetIncomeComparisonChart: React.FC<RevenueNetIncomeComparisonChartProps> = ({
  companyA,
  companyB,
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'latest' | 'fiveYear'>('latest');

  const latestA = companyA.annualFinancials[companyA.annualFinancials.length - 1];
  const latestB = companyB.annualFinancials[companyB.annualFinancials.length - 1];

  const width = 680;
  const height = 275;
  const padLeft = 58;
  const padRight = 24;
  const padTop = 26;
  const padBottom = 38;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  if (viewMode === 'fiveYear') {
    // Compare 5-year Revenue & Net Income side-by-side by year index (Year 1 to Year 5)
    const maxVal =
      Math.max(
        ...companyA.annualFinancials.map((f) => f.revenueB),
        ...companyB.annualFinancials.map((f) => f.revenueB),
        1
      ) * 1.15;

    const slots = companyA.annualFinancials.length;
    const slotW = chartW / slots;
    const barW = Math.min(20, slotW * 0.18);

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#0A1628]">
              Revenue & Net Income Comparison (Illustrative Sample Data)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              5-year illustrative annual progression comparing {companyA.ticker} and {companyB.ticker}.
            </p>
          </div>
          <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('latest')}
              className="px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:text-[#0A1628] cursor-pointer whitespace-nowrap"
            >
              Latest Year
            </button>
            <button
              type="button"
              onClick={() => setViewMode('fiveYear')}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-[#0A1628] text-white cursor-pointer whitespace-nowrap"
            >
              5-Year Trend
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-w-[460px] select-none"
            role="img"
            aria-label={`5-year Revenue and Net Income comparison between ${companyA.ticker} and ${companyB.ticker}`}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
              const val = maxVal * (1 - t);
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
                    {formatBillions(val)}
                  </text>
                </g>
              );
            })}

            {companyA.annualFinancials.map((rowA, idx) => {
              const rowB = companyB.annualFinancials[idx];
              const groupCenterX = padLeft + idx * slotW + slotW / 2;
              const bars = [
                {
                  key: `${idx}-a-rev`,
                  label: `${companyA.ticker} Rev`,
                  val: rowA.revenueB,
                  color: '#0A1628',
                  x: groupCenterX - barW * 2 - 4,
                },
                {
                  key: `${idx}-a-ni`,
                  label: `${companyA.ticker} Net Inc`,
                  val: rowA.netIncomeB,
                  color: '#475569',
                  x: groupCenterX - barW - 1,
                },
                {
                  key: `${idx}-b-rev`,
                  label: `${companyB.ticker} Rev`,
                  val: rowB.revenueB,
                  color: '#15803D',
                  x: groupCenterX + 1,
                },
                {
                  key: `${idx}-b-ni`,
                  label: `${companyB.ticker} Net Inc`,
                  val: rowB.netIncomeB,
                  color: '#4ADE80',
                  x: groupCenterX + barW + 4,
                },
              ];

              return (
                <g key={idx}>
                  {bars.map((b) => {
                    const barH = Math.max(3, (b.val / maxVal) * chartH);
                    const y = padTop + chartH - barH;
                    const isHover = hoveredKey === b.key;
                    return (
                      <g
                        key={b.key}
                        onMouseEnter={() => setHoveredKey(b.key)}
                        onMouseLeave={() => setHoveredKey(null)}
                        className="cursor-pointer"
                      >
                        <rect
                          x={b.x}
                          y={y}
                          width={barW}
                          height={barH}
                          rx={3}
                          fill={b.color}
                          opacity={hoveredKey && !isHover ? 0.55 : 1}
                        />
                        {isHover && (
                          <g transform={`translate(${Math.min(Math.max(b.x + barW / 2, 70), width - 70)}, ${Math.max(y - 14, 16)})`}>
                            <rect x={-58} y={-13} width={116} height={20} rx={4} fill="#0A1628" />
                            <text
                              x={0}
                              y={1}
                              textAnchor="middle"
                              className="fill-white text-[10px] font-mono tabular-nums"
                            >
                              {b.label}: {formatBillions(b.val)}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                  <text
                    x={groupCenterX}
                    y={height - 12}
                    textAnchor="middle"
                    className="fill-slate-500 text-[11px] font-mono"
                  >
                    Yr {idx + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-5 pt-2 border-t border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#0A1628]" />
            <span>{companyA.ticker} Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#475569]" />
            <span>{companyA.ticker} Net Income</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#15803D]" />
            <span>{companyB.ticker} Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#4ADE80]" />
            <span>{companyB.ticker} Net Income</span>
          </div>
        </div>
      </div>
    );
  }

  // Default Latest Fiscal Year Grouped Comparison
  const groups = [
    {
      label: 'Annual Revenue',
      valA: latestA.revenueB,
      valB: latestB.revenueB,
      subA: latestA.period,
      subB: latestB.period,
    },
    {
      label: 'Annual Net Income',
      valA: latestA.netIncomeB,
      valB: latestB.netIncomeB,
      subA: `${((latestA.netIncomeB / latestA.revenueB) * 100).toFixed(1)}% margin`,
      subB: `${((latestB.netIncomeB / latestB.revenueB) * 100).toFixed(1)}% margin`,
    },
  ];

  const maxVal = Math.max(latestA.revenueB, latestB.revenueB, latestA.netIncomeB, latestB.netIncomeB, 1) * 1.18;
  const slotW = chartW / groups.length;
  const barW = 68;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#0A1628]">
            Revenue & Net Income Comparison (Illustrative Sample Data)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Side-by-side scale of total sales (Revenue) vs. bottom-line profit (Net Income) for{' '}
            <strong className="text-[#0A1628]">{companyA.ticker}</strong> ({latestA.period}) and{' '}
            <strong className="text-[#15803D]">{companyB.ticker}</strong> ({latestB.period}).
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setViewMode('latest')}
            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-[#0A1628] text-white cursor-pointer whitespace-nowrap"
          >
            Latest Year
          </button>
          <button
            type="button"
            onClick={() => setViewMode('fiveYear')}
            className="px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:text-[#0A1628] cursor-pointer whitespace-nowrap"
          >
            5-Year Trend
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[460px] select-none"
          role="img"
          aria-label={`Latest year Revenue and Net Income comparison between ${companyA.ticker} and ${companyB.ticker}`}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
            const val = maxVal * (1 - t);
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
                  {formatBillions(val)}
                </text>
              </g>
            );
          })}

          {groups.map((grp, idx) => {
            const centerX = padLeft + idx * slotW + slotW / 2;
            const xA = centerX - barW - 10;
            const xB = centerX + 10;
            const hA = Math.max(4, (grp.valA / maxVal) * chartH);
            const hB = Math.max(4, (grp.valB / maxVal) * chartH);
            const yA = padTop + chartH - hA;
            const yB = padTop + chartH - hB;

            return (
              <g key={grp.label}>
                {/* Company A Bar */}
                <g
                  onMouseEnter={() => setHoveredKey(`${grp.label}-A`)}
                  onMouseLeave={() => setHoveredKey(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x={xA}
                    y={yA}
                    width={barW}
                    height={hA}
                    rx={4}
                    fill="#0A1628"
                    opacity={hoveredKey && hoveredKey !== `${grp.label}-A` ? 0.6 : 1}
                  />
                  <text
                    x={xA + barW / 2}
                    y={yA - 8}
                    textAnchor="middle"
                    className="fill-[#0A1628] text-xs font-mono font-bold tabular-nums"
                  >
                    {formatBillions(grp.valA)}
                  </text>
                  <text
                    x={xA + barW / 2}
                    y={padTop + chartH + 16}
                    textAnchor="middle"
                    className="fill-slate-600 text-[11px] font-mono font-semibold"
                  >
                    {companyA.ticker}
                  </text>
                </g>

                {/* Company B Bar */}
                <g
                  onMouseEnter={() => setHoveredKey(`${grp.label}-B`)}
                  onMouseLeave={() => setHoveredKey(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x={xB}
                    y={yB}
                    width={barW}
                    height={hB}
                    rx={4}
                    fill="#15803D"
                    opacity={hoveredKey && hoveredKey !== `${grp.label}-B` ? 0.6 : 1}
                  />
                  <text
                    x={xB + barW / 2}
                    y={yB - 8}
                    textAnchor="middle"
                    className="fill-[#15803D] text-xs font-mono font-bold tabular-nums"
                  >
                    {formatBillions(grp.valB)}
                  </text>
                  <text
                    x={xB + barW / 2}
                    y={padTop + chartH + 16}
                    textAnchor="middle"
                    className="fill-slate-600 text-[11px] font-mono font-semibold"
                  >
                    {companyB.ticker}
                  </text>
                </g>

                {/* Group Title */}
                <text
                  x={centerX}
                  y={height - 4}
                  textAnchor="middle"
                  className="fill-[#0A1628] text-xs font-semibold"
                >
                  {grp.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#0A1628]" />
            <span>
              <strong className="text-[#0A1628]">{companyA.ticker}</strong> — {companyA.name} ({latestA.period})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#15803D]" />
            <span>
              <strong className="text-[#15803D]">{companyB.ticker}</strong> — {companyB.name} ({latestB.period})
            </span>
          </div>
        </div>
        <span className="text-slate-500">Illustrative Sample Data</span>
      </div>
    </div>
  );
};
