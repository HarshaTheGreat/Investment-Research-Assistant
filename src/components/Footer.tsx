import React from 'react';
import { TickerSymbol } from '../types/financial';
import { AppRoute } from './Navbar';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
  onSelectCompany: (ticker: TickerSymbol) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCompany }) => {
  return (
    <footer className="bg-[#0A1628] text-slate-300 border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          <div className="md:col-span-6 space-y-3">
            <div className="text-lg font-bold text-white tracking-tight">ClearLedger</div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              An educational financial research platform built to help beginners learn how companies generate revenue,
              manage cash flow, and navigate market cycles in plain English.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg pt-1">
              <strong className="text-slate-200">Educational Notice:</strong> All stock prices, financial statements,
              5-year projections, and news items displayed in this version are illustrative sample data—not real-time
              market feeds. Nothing on this site is personalized financial advice or a recommendation to buy or sell any
              security.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <div className="text-xs font-semibold text-white">Company Dashboards</div>
            <ul className="space-y-2 text-sm">
              {(['AMD', 'NVDA', 'WMT', 'MSFT'] as TickerSymbol[]).map((ticker) => (
                <li key={ticker}>
                  <button
                    type="button"
                    onClick={() => onSelectCompany(ticker)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {ticker === 'AMD'
                      ? 'AMD — Semiconductors'
                      : ticker === 'NVDA'
                        ? 'NVIDIA — AI Computing'
                        : ticker === 'MSFT'
                          ? 'Microsoft — Cloud & Software'
                          : 'Walmart — Omnichannel Retail'}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <div className="text-xs font-semibold text-white">Research Tools</div>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Homepage Search
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('compare')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Compare Companies
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('projections')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  5-Year Projections
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('news')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  News & Events
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <span>ClearLedger Educational Research · Sample Data Mode</span>
          <span>Illustrative Figures Only · Not Financial Advice</span>
        </div>
      </div>
    </footer>
  );
};
