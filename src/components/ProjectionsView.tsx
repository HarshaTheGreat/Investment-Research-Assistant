import React, { useState } from 'react';
import { MessageSquareText } from 'lucide-react';
import { formatBillions, getAllCompanies } from '../services/financialDataService';
import {
  getCompanyProjectionModel,
  getScenarioAssumptionsGuide,
} from '../services/projectionModelService';
import { ProjectionScenarioType, TickerSymbol } from '../types/financial';
import { ProjectionChart } from './charts/ProjectionChart';

interface ProjectionsViewProps {
  onSelectCompany: (ticker: TickerSymbol) => void;
  onAskTutor: (prompt?: string, ticker?: TickerSymbol) => void;
}

export const ProjectionsView: React.FC<ProjectionsViewProps> = ({
  onSelectCompany,
  onAskTutor,
}) => {
  const allCompanies = getAllCompanies();
  const [selectedTicker, setSelectedTicker] = useState<TickerSymbol>('AMD');
  const [activeScenario, setActiveScenario] = useState<ProjectionScenarioType | 'all'>('base');

  const model = getCompanyProjectionModel(selectedTicker) ?? getCompanyProjectionModel('AMD')!;
  const { company, scenarios, methodologyNote } = model;

  const focusedScenarioKey: ProjectionScenarioType =
    activeScenario === 'all' ? 'base' : activeScenario;
  const focusedScenario = scenarios[focusedScenarioKey];
  const assumptionGuide = getScenarioAssumptionsGuide(focusedScenario);
  const latestHistorical = company.annualFinancials[company.annualFinancials.length - 1];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1.5 max-w-3xl">
          <p className="text-xs font-medium text-slate-500">
            Illustrative Estimates Only · Not Guaranteed Results or Actual Data · No Stock Price Predictions
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1628] tracking-tight">
            Five-Year Financial Projections
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">{methodologyNote}</p>
        </div>

        <button
          type="button"
          onClick={() =>
            onAskTutor(
              `Explain ${company.name} (${company.ticker})'s 5-year Bear, Base, and Bull projections in simple terms.`,
              company.ticker
            )
          }
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#15803D] hover:bg-[#166534] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          <MessageSquareText className="w-4 h-4" aria-hidden="true" />
          <span>Ask AI Tutor</span>
        </button>
      </div>

      {/* Company + Scenario Controls */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1">Company:</span>
          {allCompanies.map((c) => (
            <button
              key={c.ticker}
              type="button"
              onClick={() => setSelectedTicker(c.ticker)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                selectedTicker === c.ticker
                  ? 'bg-[#0A1628] text-white border-[#0A1628]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="font-mono mr-1.5">{c.ticker}</span>
              {c.ticker === 'AMD'
                ? 'AMD'
                : c.ticker === 'NVDA'
                  ? 'NVIDIA'
                  : c.ticker === 'MSFT'
                    ? 'Microsoft'
                    : 'Walmart'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Scenario:</span>
          {(
            [
              { id: 'bear', label: 'Bear Case' },
              { id: 'base', label: 'Base Case' },
              { id: 'bull', label: 'Bull Case' },
              { id: 'all', label: 'Compare All 3' },
            ] as const
          ).map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setActiveScenario(sc.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                activeScenario === sc.id
                  ? 'bg-[#15803D] text-white border-[#15803D]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </section>

      {/* Three Line Charts: Revenue, Net Income, Operating Cash Flow */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <ProjectionChart
            projections={scenarios}
            activeScenario={activeScenario}
            metric="revenueB"
            title="Projected Revenue (5Y)"
            subtitle={`Starting from ${latestHistorical.period}: ${formatBillions(latestHistorical.revenueB)} (Illustrative)`}
            compact
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <ProjectionChart
            projections={scenarios}
            activeScenario={activeScenario}
            metric="netIncomeB"
            title="Projected Net Income (5Y)"
            subtitle={`Starting from ${latestHistorical.period}: ${formatBillions(latestHistorical.netIncomeB)} (Illustrative)`}
            compact
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <ProjectionChart
            projections={scenarios}
            activeScenario={activeScenario}
            metric="operatingCashFlowB"
            title="Projected Operating Cash Flow (5Y)"
            subtitle={`Starting from ${latestHistorical.period}: ${formatBillions(latestHistorical.operatingCashFlowB)} (Illustrative)`}
            compact
          />
        </div>
      </section>

      {/* Beginner-Friendly Scenario Assumptions Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-[#0A1628]">{assumptionGuide.beginnerTitle}</h2>
            <span className="font-mono text-xs font-semibold text-[#15803D]">
              {focusedScenario.label}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{assumptionGuide.plainExplanation}</p>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-xs font-semibold text-[#0A1628]">
              Sample Assumptions for {company.ticker}
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {assumptionGuide.whatChanges.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#15803D] font-bold mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5-Year Scenario Data Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#0A1628]">
                {company.name} ({company.ticker}) — {focusedScenario.label} Numbers
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Illustrative estimates in USD Billions · Switch scenario buttons above to compare Bear, Base, and Bull
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectCompany(company.ticker)}
              className="text-xs font-semibold text-[#15803D] hover:underline cursor-pointer"
            >
              Open {company.ticker} Dashboard
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-6">Projected Year</th>
                  <th className="py-3 px-4 text-right">Revenue</th>
                  <th className="py-3 px-4 text-right">Net Income</th>
                  <th className="py-3 px-4 text-right">Net Margin</th>
                  <th className="py-3 px-6 text-right">Operating Cash Flow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                {focusedScenario.yearly.map((row) => {
                  const netMargin = ((row.netIncomeB / row.revenueB) * 100).toFixed(1);
                  return (
                    <tr key={row.year} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-6 font-sans font-semibold text-[#0A1628]">
                        {row.year} <span className="text-xs font-normal text-slate-400">(Est.)</span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-800">{formatBillions(row.revenueB)}</td>
                      <td className="py-3.5 px-4 text-right text-slate-800 font-medium">
                        {formatBillions(row.netIncomeB)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600">{netMargin}%</td>
                      <td className="py-3.5 px-6 text-right text-[#15803D] font-semibold">
                        {formatBillions(row.operatingCashFlowB)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* All 3 Scenarios Side-by-Side Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['bear', 'base', 'bull'] as ProjectionScenarioType[]).map((key) => {
          const sc = scenarios[key];
          const end = sc.yearly[sc.yearly.length - 1];
          const isSelected = activeScenario === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveScenario(key)}
              className={`text-left bg-white border rounded-xl p-5 space-y-3 transition-colors cursor-pointer ${
                isSelected
                  ? 'border-[#15803D] ring-1 ring-[#15803D]/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0A1628]">{sc.label}</h3>
                <span className="font-mono text-xs font-semibold text-[#15803D] tabular-nums">
                  +{sc.revenueCagrPercent.toFixed(1)}% / yr
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{sc.summary}</p>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-xs font-mono tabular-nums">
                <div>
                  <div className="text-[11px] font-sans text-slate-500">{end.year} Rev</div>
                  <div className="font-bold text-[#0A1628] mt-0.5">{formatBillions(end.revenueB)}</div>
                </div>
                <div>
                  <div className="text-[11px] font-sans text-slate-500">{end.year} Net Inc</div>
                  <div className="font-bold text-[#0A1628] mt-0.5">{formatBillions(end.netIncomeB)}</div>
                </div>
                <div>
                  <div className="text-[11px] font-sans text-slate-500">{end.year} OCF</div>
                  <div className="font-bold text-[#15803D] mt-0.5">{formatBillions(end.operatingCashFlowB)}</div>
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {/* Explicit Educational & Non-Prediction Disclaimer */}
      <section className="bg-[#0A1628] text-white rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-3xl">
          <h2 className="text-sm font-bold text-white">
            Important Notice About Illustrative Projections
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All 5-year figures shown here are sample educational estimates designed to demonstrate how Bear, Base, and
            Bull assumptions work. They are not guaranteed outcomes, actual financial statements, stock price
            predictions, or personalized investment advice.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onAskTutor(
              'Why do analysts model Bear, Base, and Bull scenarios instead of predicting an exact stock price?',
              company.ticker
            )
          }
          className="px-4 py-2 text-xs font-semibold bg-[#15803D] hover:bg-[#166534] text-white rounded-lg transition-colors cursor-pointer shrink-0"
        >
          Learn Why Scenarios Matter
        </button>
      </section>
    </main>
  );
};
