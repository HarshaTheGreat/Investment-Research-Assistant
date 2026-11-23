import React, { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, GitCompare, Newspaper, Search } from 'lucide-react';
import {
  formatBillions,
  getAllCompanies,
  getBeginnerGlossary,
  getNewsItems,
  searchCompanies,
} from '../services/financialDataService';
import { TickerSymbol } from '../types/financial';
import { AppRoute } from './Navbar';

interface HomeViewProps {
  onSelectCompany: (ticker: TickerSymbol) => void;
  onNavigate: (route: AppRoute) => void;
  onOpenArticle: (articleId: string) => void;
  onAskTutor: (prompt?: string, ticker?: TickerSymbol) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectCompany,
  onNavigate,
  onOpenArticle,
  onAskTutor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [noMatchMessage, setNoMatchMessage] = useState<string | null>(null);

  const allCompanies = getAllCompanies();
  const glossary = getBeginnerGlossary();
  const recentNews = getNewsItems().slice(0, 3);

  const filteredMatches = useMemo(() => searchCompanies(searchQuery), [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (filteredMatches.length > 0) {
      setNoMatchMessage(null);
      onSelectCompany(filteredMatches[0].ticker);
    } else {
      setNoMatchMessage(
        `No sample dashboard found for "${searchQuery.trim()}". Currently available illustrative dashboards: AMD, NVIDIA (NVDA), Walmart (WMT), and Microsoft (MSFT).`
      );
    }
  };

  return (
    <main>
      {/* Hero Section: Deep Navy */}
      <section className="bg-[#0A1628] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="max-w-3xl space-y-6">
            <p className="text-xs sm:text-sm font-medium text-[#4ADE80] tracking-wide">
              Educational Financial Research · Illustrative Sample Data · Not Investment Advice
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.12] text-balance">
              Understand public companies in plain English before reading a single chart.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Explore revenue, profit margins, cash flow, historical stock trends, and 5-year Bear, Base, and Bull
              scenarios for leading businesses—built specifically for beginners learning how markets work.
            </p>

            {/* Company Search Bar */}
            <div className="pt-2 relative max-w-2xl">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search
                  className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 160)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setNoMatchMessage(null);
                  }}
                  placeholder="Search a company or ticker (e.g., AMD, NVIDIA, Walmart)..."
                  aria-label="Search companies"
                  className="w-full pl-12 pr-28 py-3.5 bg-white text-[#0A1628] placeholder:text-slate-400 rounded-xl text-sm sm:text-base font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Research
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {searchFocused && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-20">
                  {filteredMatches.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {filteredMatches.map((company) => (
                        <button
                          key={company.ticker}
                          type="button"
                          onMouseDown={() => onSelectCompany(company.ticker)}
                          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-xs font-bold text-[#0A1628] bg-slate-100 px-2 py-0.5 rounded">
                                {company.ticker}
                              </span>
                              <span className="text-sm font-semibold text-[#0A1628]">{company.name}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {company.sector} · {company.industry}
                            </p>
                          </div>
                          <span className="text-xs font-mono font-medium text-[#15803D] tabular-nums">
                            ${company.illustrativeMarket.price.toFixed(2)} (Sample)
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-600">
                      No match in sample dataset. Try AMD, NVDA, WMT, or MSFT.
                    </div>
                  )}
                </div>
              )}

              {noMatchMessage && (
                <p className="text-xs text-amber-300 mt-2">{noMatchMessage}</p>
              )}

              {/* Quick-jump Company Links */}
              <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-slate-300">
                <span className="text-slate-400">Available Dashboards:</span>
                {allCompanies.map((c) => (
                  <button
                    key={c.ticker}
                    type="button"
                    onClick={() => onSelectCompany(c.ticker)}
                    className="px-3 py-1.5 rounded-lg bg-[#102038] hover:bg-[#192D4A] border border-white/15 text-white font-medium transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span className="font-mono font-semibold text-[#4ADE80] mr-1.5">{c.ticker}</span>
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
            </div>
          </div>
        </div>
      </section>

      {/* Featured Company Dashboards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#0A1628] tracking-tight">
              Featured Company Dashboards
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Click any company to inspect financials, stock history, and 5-year scenario models. All figures are illustrative sample data.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('projections')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0A1628] bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>5-Year Projections</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('compare')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0A1628] bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <GitCompare className="w-4 h-4 text-[#15803D]" aria-hidden="true" />
              <span>Compare Side-by-Side</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {allCompanies.map((company) => {
            const latest = company.annualFinancials[company.annualFinancials.length - 1];
            const grossMargin = ((latest.grossProfitB / latest.revenueB) * 100).toFixed(1);
            return (
              <article
                key={company.ticker}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-[#0A1628]/40 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-500 font-medium">
                        {company.exchange} · {company.industry}
                      </div>
                      <h3 className="text-lg font-bold text-[#0A1628] mt-1">
                        {company.name}
                      </h3>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#0A1628] bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md shrink-0">
                      {company.ticker}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {company.plainEnglishSummary}
                  </p>

                  {/* Key Illustrative Numbers */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <div className="text-xs text-slate-500">Illustrative Price</div>
                      <div className="text-base font-bold font-mono tabular-nums text-[#0A1628] mt-0.5">
                        ${company.illustrativeMarket.price.toFixed(2)}
                        <span className="text-xs font-medium text-[#15803D] ml-1.5">
                          +{company.illustrativeMarket.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Market Cap (Sample)</div>
                      <div className="text-base font-bold font-mono tabular-nums text-[#0A1628] mt-0.5">
                        {formatBillions(company.illustrativeMarket.marketCapB)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">{latest.period} Revenue</div>
                      <div className="text-sm font-semibold font-mono tabular-nums text-slate-800 mt-0.5">
                        {formatBillions(latest.revenueB)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Gross Margin</div>
                      <div className="text-sm font-semibold font-mono tabular-nums text-slate-800 mt-0.5">
                        {grossMargin}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onSelectCompany(company.ticker)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A1628] hover:text-[#15803D] transition-colors cursor-pointer"
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onAskTutor(`Explain ${company.name} (${company.ticker}) in simple terms.`, company.ticker)
                    }
                    className="text-xs font-medium text-slate-500 hover:text-[#0A1628] transition-colors cursor-pointer"
                  >
                    Explain business
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Beginner Financial Concepts Guide */}
      <section className="bg-white border-y border-slate-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-[#0A1628] tracking-tight">
                Beginner Financial Metrics Guide
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Six essential numbers every company dashboard shows—explained without Wall Street jargon.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onAskTutor('I am brand new to investing research. What 3 financial numbers should I look at first?')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0A1628] hover:bg-[#102038] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 text-[#4ADE80]" aria-hidden="true" />
              <span>Ask AI Tutor a Question</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {glossary.map((item) => (
              <div
                key={item.key}
                className="p-5 bg-[#F8FAFC] border border-slate-200 rounded-xl flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-[#0A1628]">{item.term}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{item.shortDefinition}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <strong className="text-slate-700">Example:</strong> {item.plainExample}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Educational concept</span>
                  <button
                    type="button"
                    onClick={() => onAskTutor(`Explain ${item.term} in simple language with a real example.`)}
                    className="text-xs font-semibold text-[#15803D] hover:underline cursor-pointer"
                  >
                    Ask Tutor more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Illustrative News Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#0A1628] tracking-tight">
              Financial News & Events Explained
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Illustrative company developments paired with plain-English takeaways for beginners.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('news')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#15803D] hover:underline cursor-pointer whitespace-nowrap"
          >
            <Newspaper className="w-4 h-4" aria-hidden="true" />
            <span>View All News & Events</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentNews.map((news) => (
            <button
              key={news.id}
              type="button"
              onClick={() => onOpenArticle(news.id)}
              className="group text-left bg-white border border-slate-200 hover:border-[#0A1628] rounded-xl p-5 flex flex-col justify-between gap-4 transition-colors cursor-pointer"
            >
              <div className="space-y-2.5">
                <div className="text-xs text-slate-500 font-medium">
                  <span className="font-mono font-semibold text-[#0A1628]">{news.ticker}</span> · {news.category} ·{' '}
                  {news.publicationDate}
                </div>
                <h3 className="text-base font-bold text-[#0A1628] group-hover:text-[#15803D] transition-colors leading-snug">
                  {news.headline}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{news.articleSummary}</p>
                <div className="text-[11px] text-slate-500">
                  {news.originalArticleUrl ? `Publisher: ${news.publisher}` : `${news.publisher} · Original source unavailable`}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 w-full flex items-center justify-between">
                <span className="text-xs font-semibold text-[#15803D]">Read summary &amp; analysis</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#15803D]" aria-hidden="true" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};
