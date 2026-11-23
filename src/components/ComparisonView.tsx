import React, { useMemo, useState } from 'react';
import { ArrowLeftRight, MessageSquareText } from 'lucide-react';
import { formatBillions, getAllCompanies, getCompanyByTicker } from '../services/financialDataService';
import { CompanyProfile, TickerSymbol } from '../types/financial';
import { ComparisonChart } from './charts/ComparisonChart';
import { RevenueNetIncomeComparisonChart } from './charts/RevenueNetIncomeComparisonChart';

interface ComparisonViewProps {
  onSelectCompany: (ticker: TickerSymbol) => void;
  onAskTutor: (prompt?: string) => void;
}

function buildBeginnerComparisonNotes(a: CompanyProfile, b: CompanyProfile) {
  const finA = a.annualFinancials[a.annualFinancials.length - 1];
  const finB = b.annualFinancials[b.annualFinancials.length - 1];

  const gmA = (finA.grossProfitB / finA.revenueB) * 100;
  const gmB = (finB.grossProfitB / finB.revenueB) * 100;
  const nmA = (finA.netIncomeB / finA.revenueB) * 100;
  const nmB = (finB.netIncomeB / finB.revenueB) * 100;

  const higherRev = finA.revenueB >= finB.revenueB ? { c: a, f: finA } : { c: b, f: finB };
  const lowerRev = finA.revenueB >= finB.revenueB ? { c: b, f: finB } : { c: a, f: finA };
  const revRatio = (higherRev.f.revenueB / Math.max(0.1, lowerRev.f.revenueB)).toFixed(1);

  const higherMargin = nmA >= nmB ? { c: a, nm: nmA, gm: gmA } : { c: b, nm: nmB, gm: gmB };
  const lowerMargin = nmA >= nmB ? { c: b, nm: nmB, gm: gmB } : { c: a, nm: nmA, gm: gmA };

  const higherOcf = finA.operatingCashFlowB >= finB.operatingCashFlowB ? { c: a, f: finA } : { c: b, f: finB };
  const lowerOcf = finA.operatingCashFlowB >= finB.operatingCashFlowB ? { c: b, f: finB } : { c: a, f: finA };

  return [
    {
      title: '01. Total Sales (Revenue Scale)',
      body: `${higherRev.c.name} (${higherRev.c.ticker}) brings in ${formatBillions(higherRev.f.revenueB)} in illustrative annual revenue—about ${revRatio}x the ${formatBillions(lowerRev.f.revenueB)} recorded by ${lowerRev.c.ticker}. Larger revenue shows bigger customer sales volume, though it does not automatically mean more profit.`,
    },
    {
      title: '02. Profit Efficiency (Gross & Net Margin)',
      body: `${higherMargin.c.ticker} keeps ${higherMargin.gm.toFixed(1)}% of sales as Gross Profit and ${higherMargin.nm.toFixed(1)}% as Net Income, compared with ${lowerMargin.gm.toFixed(1)}% Gross Margin and ${lowerMargin.nm.toFixed(1)}% Net Margin for ${lowerMargin.c.ticker}. Different industries naturally have very different margins—software and specialized chip design keep more per dollar than physical retail.`,
    },
    {
      title: '03. Cash Generation & Share Volatility',
      body: `${higherOcf.c.ticker} generates ${formatBillions(higherOcf.f.operatingCashFlowB)} in Operating Cash Flow vs. ${formatBillions(lowerOcf.f.operatingCashFlowB)} for ${lowerOcf.c.ticker}. Notice EPS ($${finA.eps.toFixed(2)} vs. $${finB.eps.toFixed(2)}) depends heavily on how many shares each company has, while Beta (${a.illustrativeMarket.beta.toFixed(2)} vs. ${b.illustrativeMarket.beta.toFixed(2)}) shows how sharply the stock tends to swing.`,
    },
  ];
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  onSelectCompany,
  onAskTutor,
}) => {
  const allCompanies = getAllCompanies();
  const [tickerA, setTickerA] = useState<TickerSymbol>('AMD');
  const [tickerB, setTickerB] = useState<TickerSymbol>('NVDA');

  const companyA = getCompanyByTicker(tickerA) ?? allCompanies[0];
  const companyB = getCompanyByTicker(tickerB) ?? allCompanies[1];

  const handleChangeA = (nextTicker: TickerSymbol) => {
    if (nextTicker === tickerB) {
      setTickerB(tickerA);
    }
    setTickerA(nextTicker);
  };

  const handleChangeB = (nextTicker: TickerSymbol) => {
    if (nextTicker === tickerA) {
      setTickerA(tickerB);
    }
    setTickerB(nextTicker);
  };

  const handleSwap = () => {
    setTickerA(tickerB);
    setTickerB(tickerA);
  };

  const finA = companyA.annualFinancials[companyA.annualFinancials.length - 1];
  const finB = companyB.annualFinancials[companyB.annualFinancials.length - 1];

  const gmA = (finA.grossProfitB / finA.revenueB) * 100;
  const gmB = (finB.grossProfitB / finB.revenueB) * 100;
  const nmA = (finA.netIncomeB / finA.revenueB) * 100;
  const nmB = (finB.netIncomeB / finB.revenueB) * 100;

  const beginnerNotes = useMemo(
    () => buildBeginnerComparisonNotes(companyA, companyB),
    [companyA, companyB]
  );

  const metricRows: {
    label: string;
    helper: string;
    valA: string;
    valB: string;
    barPctA?: number;
    barPctB?: number;
    highlight?: boolean;
  }[] = [
    {
      label: 'Revenue (Top Line)',
      helper: 'Total annual sales before expenses',
      valA: formatBillions(finA.revenueB),
      valB: formatBillions(finB.revenueB),
      barPctA: (finA.revenueB / Math.max(finA.revenueB, finB.revenueB, 1)) * 100,
      barPctB: (finB.revenueB / Math.max(finA.revenueB, finB.revenueB, 1)) * 100,
      highlight: true,
    },
    {
      label: 'Gross Profit',
      helper: 'Revenue minus direct product/delivery costs',
      valA: `${formatBillions(finA.grossProfitB)} (${gmA.toFixed(1)}%)`,
      valB: `${formatBillions(finB.grossProfitB)} (${gmB.toFixed(1)}%)`,
      barPctA: (finA.grossProfitB / Math.max(finA.grossProfitB, finB.grossProfitB, 1)) * 100,
      barPctB: (finB.grossProfitB / Math.max(finA.grossProfitB, finB.grossProfitB, 1)) * 100,
    },
    {
      label: 'Net Income (Bottom Line)',
      helper: 'Total profit left after all expenses and taxes',
      valA: `${formatBillions(finA.netIncomeB)} (${nmA.toFixed(1)}%)`,
      valB: `${formatBillions(finB.netIncomeB)} (${nmB.toFixed(1)}%)`,
      barPctA: (finA.netIncomeB / Math.max(finA.netIncomeB, finB.netIncomeB, 1)) * 100,
      barPctB: (finB.netIncomeB / Math.max(finA.netIncomeB, finB.netIncomeB, 1)) * 100,
      highlight: true,
    },
    {
      label: 'Earnings Per Share (EPS)',
      helper: 'Net income divided by total shares',
      valA: `$${finA.eps.toFixed(2)}`,
      valB: `$${finB.eps.toFixed(2)}`,
    },
    {
      label: 'Operating Cash Flow',
      helper: 'Cash generated by core daily business operations',
      valA: formatBillions(finA.operatingCashFlowB),
      valB: formatBillions(finB.operatingCashFlowB),
      barPctA: (finA.operatingCashFlowB / Math.max(finA.operatingCashFlowB, finB.operatingCashFlowB, 1)) * 100,
      barPctB: (finB.operatingCashFlowB / Math.max(finA.operatingCashFlowB, finB.operatingCashFlowB, 1)) * 100,
      highlight: true,
    },
    {
      label: 'Free Cash Flow (FCF)',
      helper: 'Operating cash flow minus equipment/building spending',
      valA: formatBillions(finA.freeCashFlowB),
      valB: formatBillions(finB.freeCashFlowB),
    },
    {
      label: 'Illustrative Market Cap',
      helper: 'Total estimated company market value',
      valA: formatBillions(companyA.illustrativeMarket.marketCapB),
      valB: formatBillions(companyB.illustrativeMarket.marketCapB),
    },
    {
      label: 'P/E Ratio (Illustrative)',
      helper: 'Stock price divided by annual EPS',
      valA: `${companyA.illustrativeMarket.peRatio.toFixed(1)}x`,
      valB: `${companyB.illustrativeMarket.peRatio.toFixed(1)}x`,
    },
    {
      label: 'Beta (Stock Volatility)',
      helper: 'Above 1.0 swings wider than market average',
      valA: companyA.illustrativeMarket.beta.toFixed(2),
      valB: companyB.illustrativeMarket.beta.toFixed(2),
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Educational Side-by-Side Comparison · Illustrative Sample Data Only · Not Investment Advice
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1628] tracking-tight mt-1">
            Compare Two Companies
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Pick any two companies from AMD, NVIDIA, Walmart, and Microsoft to compare their financial metrics,
            revenue and profit scale, and business trade-offs in simple language.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onAskTutor(
              `Compare ${companyA.name} (${companyA.ticker}) and ${companyB.name} (${companyB.ticker}) in simple terms for a beginner.`
            )
          }
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#15803D] hover:bg-[#166534] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          <MessageSquareText className="w-4 h-4" aria-hidden="true" />
          <span>Ask AI Tutor to Explain</span>
        </button>
      </div>

      {/* Two-Company Selector Bar */}
      <section className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end">
          {/* Company A Selector */}
          <div className="md:col-span-5 space-y-2">
            <label htmlFor="compare-company-a" className="block text-xs font-semibold text-[#0A1628]">
              First Company (Navy)
            </label>
            <select
              id="compare-company-a"
              value={tickerA}
              onChange={(e) => handleChangeA(e.target.value as TickerSymbol)}
              className="w-full px-3.5 py-2.5 text-sm font-semibold text-[#0A1628] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A1628] cursor-pointer"
            >
              {allCompanies.map((c) => (
                <option key={c.ticker} value={c.ticker}>
                  {c.ticker} — {c.name}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-1.5">
              {allCompanies.map((c) => (
                <button
                  key={c.ticker}
                  type="button"
                  onClick={() => handleChangeA(c.ticker)}
                  className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md border transition-colors cursor-pointer ${
                    tickerA === c.ticker
                      ? 'bg-[#0A1628] text-white border-[#0A1628]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {c.ticker}
                </button>
              ))}
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pb-1">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap compared companies"
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#0A1628] transition-colors cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Company B Selector */}
          <div className="md:col-span-5 space-y-2">
            <label htmlFor="compare-company-b" className="block text-xs font-semibold text-[#15803D]">
              Second Company (Green)
            </label>
            <select
              id="compare-company-b"
              value={tickerB}
              onChange={(e) => handleChangeB(e.target.value as TickerSymbol)}
              className="w-full px-3.5 py-2.5 text-sm font-semibold text-[#0A1628] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#15803D] cursor-pointer"
            >
              {allCompanies.map((c) => (
                <option key={c.ticker} value={c.ticker}>
                  {c.ticker} — {c.name}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-1.5">
              {allCompanies.map((c) => (
                <button
                  key={c.ticker}
                  type="button"
                  onClick={() => handleChangeB(c.ticker)}
                  className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md border transition-colors cursor-pointer ${
                    tickerB === c.ticker
                      ? 'bg-[#15803D] text-white border-[#15803D]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {c.ticker}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core 5-Metric Quick Strip Side-by-Side */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Revenue', aVal: formatBillions(finA.revenueB), bVal: formatBillions(finB.revenueB) },
          { label: 'Gross Profit', aVal: formatBillions(finA.grossProfitB), bVal: formatBillions(finB.grossProfitB) },
          { label: 'Net Income', aVal: formatBillions(finA.netIncomeB), bVal: formatBillions(finB.netIncomeB) },
          { label: 'EPS', aVal: `$${finA.eps.toFixed(2)}`, bVal: `$${finB.eps.toFixed(2)}` },
          {
            label: 'Operating Cash Flow',
            aVal: formatBillions(finA.operatingCashFlowB),
            bVal: formatBillions(finB.operatingCashFlowB),
          },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5">
            <div className="text-xs font-semibold text-slate-500">{card.label}</div>
            <div className="space-y-1.5 font-mono tabular-nums">
              <div className="flex items-center justify-between text-sm">
                <span className="text-xs font-semibold text-[#0A1628]">{companyA.ticker}</span>
                <span className="font-bold text-[#0A1628]">{card.aVal}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-xs font-semibold text-[#15803D]">{companyB.ticker}</span>
                <span className="font-bold text-[#15803D]">{card.bVal}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Revenue & Net Income Comparison Chart */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <RevenueNetIncomeComparisonChart companyA={companyA} companyB={companyB} />
      </section>

      {/* Side-by-Side Financial Table */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-[#0A1628]">
            Side-by-Side Financial Metrics ({companyA.ticker} vs. {companyB.ticker})
          </h2>
          <span className="text-xs text-slate-500">
            Illustrative Sample Data · Latest Fiscal Year ({finA.period} / {finB.period})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3.5 px-6">Financial Metric</th>
                <th className="py-3.5 px-6 text-right">
                  <button
                    type="button"
                    onClick={() => onSelectCompany(companyA.ticker)}
                    className="inline-flex items-center gap-1.5 text-[#0A1628] hover:underline font-bold cursor-pointer"
                  >
                    <span className="font-mono">{companyA.ticker}</span>
                    <span className="font-normal text-slate-500">({companyA.name.split(' ')[0]})</span>
                  </button>
                </th>
                <th className="py-3.5 px-6 text-right">
                  <button
                    type="button"
                    onClick={() => onSelectCompany(companyB.ticker)}
                    className="inline-flex items-center gap-1.5 text-[#15803D] hover:underline font-bold cursor-pointer"
                  >
                    <span className="font-mono">{companyB.ticker}</span>
                    <span className="font-normal text-slate-500">({companyB.name.split(' ')[0]})</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metricRows.map((row) => (
                <tr key={row.label} className={row.highlight ? 'bg-slate-50/40' : undefined}>
                  <td className="py-3.5 px-6">
                    <div className="font-semibold text-[#0A1628]">{row.label}</div>
                    <div className="text-xs text-slate-500">{row.helper}</div>
                  </td>
                  <td className="py-3.5 px-6 text-right font-mono tabular-nums font-semibold text-[#0A1628]">
                    <div>{row.valA}</div>
                    {row.barPctA !== undefined && (
                      <div className="w-28 ml-auto h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-[#0A1628]" style={{ width: `${row.barPctA}%` }} />
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-right font-mono tabular-nums font-semibold text-[#15803D]">
                    <div>{row.valB}</div>
                    {row.barPctB !== undefined && (
                      <div className="w-28 ml-auto h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-[#15803D]" style={{ width: `${row.barPctB}%` }} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Plain-English Beginner Explanation for Selected Pair */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#0A1628]">
              Understanding the Differences in Simple Language
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Educational comparison only—neither company is recommended as a better investment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {beginnerNotes.map((note) => (
            <div key={note.title} className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
              <h3 className="text-sm font-bold text-[#0A1628]">{note.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{note.body}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#0A1628] text-white rounded-xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
            <strong className="text-white">Educational Reminder:</strong> Comparing financial numbers helps you understand
            how two businesses operate. ClearLedger does not tell you which stock is better to buy or sell.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onSelectCompany(companyA.ticker)}
              className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              View {companyA.ticker} Dashboard
            </button>
            <button
              type="button"
              onClick={() => onSelectCompany(companyB.ticker)}
              className="px-3 py-1.5 text-xs font-semibold bg-[#15803D] hover:bg-[#166534] rounded-lg transition-colors cursor-pointer"
            >
              View {companyB.ticker} Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Normalized Historical Stock Growth Comparison */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <ComparisonChart companies={[companyA, companyB]} />
      </section>
    </main>
  );
};
