import React, { useState } from 'react';
import { ArrowLeft, MessageSquareText } from 'lucide-react';
import {
  formatBillions,
  getAllCompanies,
  getCompanyByTicker,
  getNewsItems,
} from '../services/financialDataService';
import { ProjectionScenarioType, TickerSymbol } from '../types/financial';
import { FinancialBarChart, FinancialMetricKey } from './charts/FinancialBarChart';
import { ProjectionChart, ProjectionMetricKey } from './charts/ProjectionChart';
import { StockLineChart } from './charts/StockLineChart';

type DashboardTab = 'overview' | 'financials' | 'stock' | 'projections' | 'news';

interface CompanyDashboardProps {
  ticker: TickerSymbol;
  onSelectCompany: (ticker: TickerSymbol) => void;
  onBackHome: () => void;
  onOpenArticle: (articleId: string) => void;
  onAskTutor: (prompt?: string, ticker?: TickerSymbol) => void;
}

const METRIC_OPTIONS: { key: FinancialMetricKey; label: string; explainPrompt: string }[] = [
  { key: 'revenueB', label: 'Revenue', explainPrompt: 'What is Revenue and what does it tell beginners?' },
  { key: 'grossProfitB', label: 'Gross Profit', explainPrompt: 'What is Gross Profit and Gross Margin?' },
  { key: 'netIncomeB', label: 'Net Income', explainPrompt: 'What is Net Income and why does it differ from Revenue?' },
  { key: 'freeCashFlowB', label: 'Free Cash Flow', explainPrompt: 'What is Free Cash Flow and why do analysts watch it?' },
  { key: 'eps', label: 'EPS ($)', explainPrompt: 'What is Earnings Per Share (EPS)?' },
];

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  ticker,
  onSelectCompany,
  onBackHome,
  onOpenArticle,
  onAskTutor,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [periodView, setPeriodView] = useState<'annual' | 'quarterly'>('annual');
  const [selectedMetric, setSelectedMetric] = useState<FinancialMetricKey>('revenueB');
  const [activeScenario, setActiveScenario] = useState<ProjectionScenarioType | 'all'>('all');
  const [projectionMetric, setProjectionMetric] = useState<ProjectionMetricKey>('revenueB');

  const company = getCompanyByTicker(ticker) ?? getAllCompanies()[0];
  const allCompanies = getAllCompanies();
  const companyNews = getNewsItems({ ticker: company.ticker });

  const latestAnnual = company.annualFinancials[company.annualFinancials.length - 1];
  const prevAnnual = company.annualFinancials[company.annualFinancials.length - 2];
  const revenueYoy = prevAnnual
    ? (((latestAnnual.revenueB - prevAnnual.revenueB) / prevAnnual.revenueB) * 100).toFixed(1)
    : '0.0';
  const grossMarginPct = ((latestAnnual.grossProfitB / latestAnnual.revenueB) * 100).toFixed(1);
  const netMarginPct = ((latestAnnual.netIncomeB / latestAnnual.revenueB) * 100).toFixed(1);

  const financialSeries =
    periodView === 'annual' ? company.annualFinancials : company.quarterlyFinancials;

  const currentMetricMeta = METRIC_OPTIONS.find((m) => m.key === selectedMetric) ?? METRIC_OPTIONS[0];

  const week52PositionPct = Math.min(
    100,
    Math.max(
      0,
      ((company.illustrativeMarket.price - company.illustrativeMarket.week52Low) /
        (company.illustrativeMarket.week52High - company.illustrativeMarket.week52Low)) *
        100
    )
  );

  const tabs: { id: DashboardTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'financials', label: 'Financial Analytics' },
    { id: 'stock', label: 'Stock History' },
    { id: 'projections', label: '5-Year Projections' },
    { id: 'news', label: 'News & Events' },
  ];

  return (
    <main className="pb-12">
      {/* Top Switcher & Illustrative Disclaimer Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#0A1628] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>All Companies</span>
            </button>
            <span className="text-slate-300" aria-hidden="true">/</span>
            <div className="flex items-center gap-1.5">
              {allCompanies.map((c) => (
                <button
                  key={c.ticker}
                  type="button"
                  onClick={() => onSelectCompany(c.ticker)}
                  className={`px-3 py-1 text-xs font-mono font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    c.ticker === company.ticker
                      ? 'bg-[#0A1628] text-white'
                      : 'text-slate-600 hover:text-[#0A1628] hover:bg-slate-100'
                  }`}
                >
                  {c.ticker}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Illustrative Sample Data · Not Real-Time · Educational Research Only
          </div>
        </div>
      </div>

      {/* Company Hero Summary Strip (Deep Navy) */}
      <section className="bg-[#0A1628] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs text-slate-300 font-medium">
                <span className="font-mono font-semibold text-[#4ADE80]">{company.exchange}: {company.ticker}</span> ·{' '}
                {company.sector} · {company.industry}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {company.name}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                {company.plainEnglishSummary}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <div className="text-xs text-slate-400">Illustrative Share Price</div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold font-mono tabular-nums text-white">
                  ${company.illustrativeMarket.price.toFixed(2)}
                </span>
                <span className="text-sm font-mono font-semibold tabular-nums text-[#4ADE80]">
                  +{company.illustrativeMarket.changePercent.toFixed(2)}%
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  onAskTutor(`Give me a beginner-friendly overview of ${company.name} (${company.ticker}).`, company.ticker)
                }
                className="mt-1 inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <MessageSquareText className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ask AI Tutor about {company.ticker}</span>
              </button>
            </div>
          </div>

          {/* 4-Column Quick Market Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
            <div>
              <div className="text-xs text-slate-400">Market Cap (Illustrative)</div>
              <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
                {formatBillions(company.illustrativeMarket.marketCapB)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">{latestAnnual.period} Revenue</div>
              <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
                {formatBillions(latestAnnual.revenueB)}{' '}
                <span className="text-xs font-normal text-[#4ADE80]">+{revenueYoy}%</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">P/E Ratio (Illustrative)</div>
              <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
                {company.illustrativeMarket.peRatio.toFixed(1)}x
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Dividend Yield</div>
              <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
                {company.illustrativeMarket.dividendYieldPercent > 0
                  ? `${company.illustrativeMarket.dividendYieldPercent.toFixed(2)}%`
                  : '0.00% (Reinvested)'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Sub-Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-6 overflow-x-auto" aria-label="Company dashboard sections">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-3.5 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive ? 'text-[#0A1628]' : 'text-slate-500 hover:text-[#0A1628]'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span aria-hidden="true" className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#15803D]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Business Model & Facts */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-[#0A1628]">How {company.ticker} Makes Money</h2>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">{company.businessModelNote}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-sm">
                  <div>
                    <div className="text-xs text-slate-500">Chief Executive</div>
                    <div className="font-semibold text-[#0A1628] mt-0.5">{company.ceo}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Headquarters</div>
                    <div className="font-semibold text-[#0A1628] mt-0.5">{company.headquarters}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Founded</div>
                    <div className="font-semibold font-mono tabular-nums text-[#0A1628] mt-0.5">
                      {company.founded}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Employees</div>
                    <div className="font-semibold font-mono tabular-nums text-[#0A1628] mt-0.5">
                      {company.employees}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Gross Margin</div>
                    <div className="font-semibold font-mono tabular-nums text-[#15803D] mt-0.5">
                      {grossMarginPct}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Net Margin</div>
                    <div className="font-semibold font-mono tabular-nums text-[#0A1628] mt-0.5">
                      {netMarginPct}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Segments Breakdown */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#0A1628]">Revenue Mix ({latestAnnual.period})</h2>
                  <span className="text-xs text-slate-500 font-mono">Illustrative</span>
                </div>
                <div className="space-y-4">
                  {company.segments.map((seg) => (
                    <div key={seg.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-[#0A1628]">{seg.name}</span>
                        <span className="font-mono tabular-nums text-xs text-slate-600">
                          {formatBillions(seg.revenueBillions)} ({seg.sharePercent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0A1628] rounded-full"
                          style={{ width: `${seg.sharePercent}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{seg.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths & Risks Balanced View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                <h3 className="text-base font-bold text-[#0A1628]">Key Competitive Strengths</h3>
                <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                  {company.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs font-semibold text-[#15803D] mt-0.5">0{i + 1}.</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                <h3 className="text-base font-bold text-[#0A1628]">Key Business Risks to Understand</h3>
                <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                  {company.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs font-semibold text-slate-500 mt-0.5">0{i + 1}.</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Navigation Cards to Deep Dives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <button
                type="button"
                onClick={() => setActiveTab('financials')}
                className="p-5 bg-white border border-slate-200 hover:border-[#0A1628] rounded-xl text-left transition-colors cursor-pointer"
              >
                <div className="text-xs font-medium text-[#15803D]">Financial Analytics</div>
                <div className="text-base font-bold text-[#0A1628] mt-1">
                  Inspect Revenue, Profit, EPS & Cash Flow
                </div>
                <div className="text-xs text-slate-500 mt-1">Annual & quarterly breakdown</div>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stock')}
                className="p-5 bg-white border border-slate-200 hover:border-[#0A1628] rounded-xl text-left transition-colors cursor-pointer"
              >
                <div className="text-xs font-medium text-[#15803D]">Stock History</div>
                <div className="text-base font-bold text-[#0A1628] mt-1">
                  Explore 6M to 5Y Price Trends
                </div>
                <div className="text-xs text-slate-500 mt-1">Interactive illustrative stock chart</div>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('projections')}
                className="p-5 bg-white border border-slate-200 hover:border-[#0A1628] rounded-xl text-left transition-colors cursor-pointer"
              >
                <div className="text-xs font-medium text-[#15803D]">5-Year Projections</div>
                <div className="text-base font-bold text-[#0A1628] mt-1">
                  Compare Bear, Base & Bull Scenarios
                </div>
                <div className="text-xs text-slate-500 mt-1">Model assumptions & drivers</div>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: FINANCIAL ANALYTICS */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            {/* KPI Summary Row */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  label: 'Revenue',
                  value: formatBillions(latestAnnual.revenueB),
                  sub: `${latestAnnual.period}`,
                  prompt: `Explain ${company.ticker}'s ${latestAnnual.period} revenue of ${formatBillions(latestAnnual.revenueB)} simply.`,
                },
                {
                  label: 'Gross Profit',
                  value: formatBillions(latestAnnual.grossProfitB),
                  sub: `${grossMarginPct}% margin`,
                  prompt: `What is Gross Profit and why is ${company.ticker}'s gross margin ${grossMarginPct}%?`,
                },
                {
                  label: 'Net Income',
                  value: formatBillions(latestAnnual.netIncomeB),
                  sub: `${netMarginPct}% margin`,
                  prompt: `Explain ${company.ticker}'s net income vs revenue.`,
                },
                {
                  label: 'EPS',
                  value: `$${latestAnnual.eps.toFixed(2)}`,
                  sub: 'Per share',
                  prompt: `What does ${company.ticker}'s EPS of $${latestAnnual.eps.toFixed(2)} mean?`,
                },
                {
                  label: 'Free Cash Flow',
                  value: formatBillions(latestAnnual.freeCashFlowB),
                  sub: `OCF ${formatBillions(latestAnnual.operatingCashFlowB)}`,
                  prompt: `What is Free Cash Flow for ${company.ticker}?`,
                },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-slate-500">{kpi.label}</div>
                    <div className="text-xl font-bold font-mono tabular-nums text-[#0A1628] mt-1">
                      {kpi.value}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 font-mono">{kpi.sub}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAskTutor(kpi.prompt, company.ticker)}
                    className="mt-3 text-left text-[11px] font-semibold text-[#15803D] hover:underline cursor-pointer"
                  >
                    Explain metric
                  </button>
                </div>
              ))}
            </div>

            {/* Historical Financial Performance Chart */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#0A1628]">
                    Historical Financial Performance ({periodView === 'annual' ? 'Annual' : 'Quarterly'})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hover any bar to see period-over-period growth · Illustrative sample figures
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Annual vs Quarterly Toggle */}
                  <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
                    {(['annual', 'quarterly'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPeriodView(mode)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize cursor-pointer whitespace-nowrap ${
                          periodView === mode
                            ? 'bg-[#0A1628] text-white'
                            : 'text-slate-600 hover:text-[#0A1628]'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metric Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-1.5">
                  {METRIC_OPTIONS.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setSelectedMetric(m.key)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                        selectedMetric === m.key
                          ? 'bg-[#15803D] text-white border-[#15803D]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => onAskTutor(currentMetricMeta.explainPrompt, company.ticker)}
                  className="text-xs font-semibold text-[#15803D] hover:underline cursor-pointer"
                >
                  What is {currentMetricMeta.label}?
                </button>
              </div>

              <FinancialBarChart
                data={financialSeries}
                metric={selectedMetric}
                metricLabel={currentMetricMeta.label}
              />
            </section>

            {/* Full Tabular Statement */}
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#0A1628]">
                  {periodView === 'annual' ? '5-Year Annual' : 'Recent Quarterly'} Financial Summary (Illustrative)
                </h3>
                <span className="text-xs text-slate-500">Values in USD Billions except EPS</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-6">Period</th>
                      <th className="py-3 px-4 text-right">Revenue</th>
                      <th className="py-3 px-4 text-right">Gross Profit</th>
                      <th className="py-3 px-4 text-right">Gross Margin</th>
                      <th className="py-3 px-4 text-right">Net Income</th>
                      <th className="py-3 px-4 text-right">EPS</th>
                      <th className="py-3 px-4 text-right">Operating CF</th>
                      <th className="py-3 px-6 text-right">Free Cash Flow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                    {financialSeries.map((row) => {
                      const gm = ((row.grossProfitB / row.revenueB) * 100).toFixed(1);
                      return (
                        <tr key={row.period} className="hover:bg-slate-50/70">
                          <td className="py-3 px-6 font-sans font-semibold text-[#0A1628]">{row.period}</td>
                          <td className="py-3 px-4 text-right text-slate-800">{formatBillions(row.revenueB)}</td>
                          <td className="py-3 px-4 text-right text-slate-800">{formatBillions(row.grossProfitB)}</td>
                          <td className="py-3 px-4 text-right text-slate-600">{gm}%</td>
                          <td className="py-3 px-4 text-right text-slate-800 font-medium">
                            {formatBillions(row.netIncomeB)}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-800">${row.eps.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-slate-600">
                            {formatBillions(row.operatingCashFlowB)}
                          </td>
                          <td className="py-3 px-6 text-right text-[#15803D] font-semibold">
                            {formatBillions(row.freeCashFlowB)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* TAB 3: STOCK HISTORY */}
        {activeTab === 'stock' && (
          <div className="space-y-6">
            <section className="bg-white border border-slate-200 rounded-xl p-6">
              <StockLineChart history={company.stockHistory5Y} ticker={company.ticker} />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h3 className="text-base font-bold text-[#0A1628]">52-Week Illustrative Price Range</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-600">
                    <span>Low: ${company.illustrativeMarket.week52Low.toFixed(2)}</span>
                    <span className="font-semibold text-[#0A1628]">
                      Current: ${company.illustrativeMarket.price.toFixed(2)}
                    </span>
                    <span>High: ${company.illustrativeMarket.week52High.toFixed(2)}</span>
                  </div>
                  <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-[#15803D]/25 rounded-full"
                      style={{ width: `${week52PositionPct}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-2 bg-[#0A1628] rounded-full"
                      style={{ left: `calc(${week52PositionPct}% - 4px)` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The 52-week range shows the lowest and highest illustrative prices over the past year, helping beginners
                  see how wide the stock normally swings.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                <h3 className="text-base font-bold text-[#0A1628]">Reading Stock Charts as a Beginner</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Short-term stock movements (6M–1Y) often react to interest rates, quarterly headlines, and investor mood.
                  Multi-year trends (3Y–5Y) tend to follow growth in revenue, earnings per share, and free cash flow.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onAskTutor(
                      `Why does ${company.ticker} have a Beta of ${company.illustrativeMarket.beta.toFixed(2)} and what does that mean for stock price swings?`,
                      company.ticker
                    )
                  }
                  className="text-xs font-semibold text-[#15803D] hover:underline cursor-pointer"
                >
                  Ask AI Tutor about stock volatility (Beta {company.illustrativeMarket.beta.toFixed(2)})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 5-YEAR PROJECTIONS */}
        {activeTab === 'projections' && (
          <div className="space-y-6">
            {/* Controls Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 mr-1">Scenario:</span>
                {(
                  [
                    { id: 'all', label: 'Compare All 3' },
                    { id: 'bear', label: 'Bear Case' },
                    { id: 'base', label: 'Base Case' },
                    { id: 'bull', label: 'Bull Case' },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveScenario(s.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                      activeScenario === s.id
                        ? 'bg-[#0A1628] text-white border-[#0A1628]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 mr-1">Metric:</span>
                {(
                  [
                    { id: 'revenueB', label: 'Revenue' },
                    { id: 'netIncomeB', label: 'Net Income' },
                    { id: 'operatingCashFlowB', label: 'Operating CF' },
                    { id: 'eps', label: 'EPS' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setProjectionMetric(m.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                      projectionMetric === m.id
                        ? 'bg-[#15803D] text-white border-[#15803D]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-[#0A1628]">
                    5-Year Illustrative Financial Projections (Bear / Base / Bull)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Educational scenario models—not forecasts or investment advice. Hover years to inspect the range.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onAskTutor(`Explain ${company.ticker}'s Bear, Base, and Bull 5-year scenarios.`, company.ticker)
                  }
                  className="text-xs font-semibold text-[#15803D] hover:underline cursor-pointer"
                >
                  Explain scenarios
                </button>
              </div>
              <ProjectionChart
                projections={company.projections}
                activeScenario={activeScenario}
                metric={projectionMetric}
              />
            </section>

            {/* 3 Scenario Assumption Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {(['bear', 'base', 'bull'] as ProjectionScenarioType[]).map((key) => {
                const sc = company.projections[key];
                const isSelected = activeScenario === key;
                const finalYear = sc.yearly[sc.yearly.length - 1];
                return (
                  <div
                    key={key}
                    onClick={() => setActiveScenario(key)}
                    className={`bg-white border rounded-xl p-6 space-y-4 cursor-pointer transition-colors ${
                      isSelected ? 'border-[#15803D] ring-1 ring-[#15803D]/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#0A1628]">{sc.label}</h3>
                      <span
                        className={`font-mono text-xs font-semibold tabular-nums ${
                          key === 'bull' ? 'text-[#15803D]' : key === 'base' ? 'text-[#0A1628]' : 'text-slate-600'
                        }`}
                      >
                        +{sc.revenueCagrPercent.toFixed(1)}% CAGR
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">{sc.summary}</p>

                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <div className="text-slate-500">{finalYear.year} Revenue</div>
                        <div className="font-mono font-bold text-sm text-[#0A1628] tabular-nums mt-0.5">
                          {formatBillions(finalYear.revenueB)}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">{finalYear.year} Net Income</div>
                        <div className="font-mono font-bold text-sm text-[#0A1628] tabular-nums mt-0.5">
                          {formatBillions(finalYear.netIncomeB)}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">{finalYear.year} OCF</div>
                        <div className="font-mono font-bold text-sm text-[#15803D] tabular-nums mt-0.5">
                          {formatBillions(finalYear.operatingCashFlowB)}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-1.5">
                      <div className="text-xs font-semibold text-slate-700">Key Assumptions</div>
                      <ul className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                        {sc.keyDrivers.map((d, i) => (
                          <li key={i}>• {d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: COMPANY NEWS & EVENTS */}
        {activeTab === 'news' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#0A1628]">
                  Illustrative News & Events for {company.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Each item includes a beginner takeaway explaining why the event matters financially.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companyNews.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenArticle(item.id)}
                  className="group text-left bg-white border border-slate-200 hover:border-[#0A1628] rounded-xl p-6 flex flex-col justify-between gap-4 transition-colors cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="text-xs text-slate-500 font-medium">
                      <span className="font-mono font-semibold text-[#0A1628]">{item.ticker}</span> · {item.category} ·{' '}
                      {item.publicationDate}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[#0A1628] group-hover:text-[#15803D] transition-colors leading-snug">
                        {item.headline}
                      </h3>
                      <div className="text-xs text-slate-500">
                        Publisher: <span className="font-medium text-slate-700">{item.publisher}</span>
                        {!item.originalArticleUrl && ' · Original source unavailable'}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.articleSummary}</p>
                    <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-lg space-y-1.5">
                      <div className="text-xs font-bold text-[#15803D]">Why This Matters Financially</div>
                      <p className="text-xs text-slate-700 leading-relaxed">{item.beginnerTakeaway}</p>
                    </div>
                  </div>
                  <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Key Term: <strong className="text-[#0A1628]">{item.keyTermExplained.term}</strong>
                    </span>
                    <span className="font-semibold text-[#15803D]">Read Summary &amp; Source →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
