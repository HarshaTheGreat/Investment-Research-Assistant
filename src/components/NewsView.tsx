import React, { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import {
  getFinancialNews,
  isValidOriginalArticleUrl,
  NEWS_CATEGORIES,
} from '../services/newsService';
import { NewsCategory, TickerSymbol } from '../types/financial';

interface NewsViewProps {
  onOpenArticle: (articleId: string) => void;
}

const CATEGORIES: (NewsCategory | 'ALL')[] = ['ALL', ...NEWS_CATEGORIES];

const TICKERS: (TickerSymbol | 'ALL')[] = ['ALL', 'AMD', 'NVDA', 'WMT', 'MSFT'];

export const NewsView: React.FC<NewsViewProps> = ({ onOpenArticle }) => {
  const [tickerFilter, setTickerFilter] = useState<TickerSymbol | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<NewsCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const items = useMemo(
    () =>
      getFinancialNews({
        ticker: tickerFilter,
        category: categoryFilter,
        search: searchQuery,
      }),
    [tickerFilter, categoryFilter, searchQuery]
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Illustrative Sample Feed (API-Ready Structure) · Click Any Card to Read Summary &amp; Financial Analysis
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1628] tracking-tight mt-1">
            Financial News &amp; Corporate Events
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Explore illustrative company announcements, earnings updates, financial developments, and industry events for
            AMD, NVIDIA, Walmart, and Microsoft. Sample entries display &ldquo;Original source unavailable&rdquo; until a
            live financial news API is connected.
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1">Company:</span>
            {TICKERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTickerFilter(t)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                  tickerFilter === t
                    ? 'bg-[#0A1628] text-white border-[#0A1628]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t === 'ALL' ? 'All Companies' : t}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter headlines, terms, or companies..."
              aria-label="Filter news"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-[#0A1628] placeholder:text-slate-400 focus:outline-none focus:border-[#15803D] focus:bg-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-1">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-[#15803D] text-white'
                  : 'text-slate-600 hover:text-[#0A1628] hover:bg-slate-100'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Fully Clickable News Cards Grid */}
      {items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <h2 className="text-base font-bold text-[#0A1628]">No matching news events</h2>
          <p className="text-sm text-slate-500">
            Try clearing your company or category filters to view all sample news items.
          </p>
          <button
            type="button"
            onClick={() => {
              setTickerFilter('ALL');
              setCategoryFilter('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold bg-[#0A1628] text-white rounded-lg cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => {
            const hasOriginalUrl = isValidOriginalArticleUrl(item.originalArticleUrl);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenArticle(item.id)}
                className="group text-left bg-white border border-slate-200 hover:border-[#0A1628] rounded-xl p-6 flex flex-col justify-between gap-4 transition-colors cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-medium">
                    <div>
                      <span className="font-mono font-semibold text-[#0A1628]">{item.ticker}</span> · {item.category}
                      {item.isIllustrative ? ' · Illustrative Sample' : ''}
                    </div>
                    <span>{item.publicationDate}</span>
                  </div>

                  <h2 className="text-lg font-bold text-[#0A1628] group-hover:text-[#15803D] transition-colors leading-snug">
                    {item.headline}
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed">{item.articleSummary}</p>

                  <div className="p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-lg text-xs text-slate-700">
                    <strong className="text-[#0A1628]">Key Term: {item.keyTermExplained.term}</strong> —{' '}
                    {item.keyTermExplained.definition}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="text-slate-500">
                    <span>
                      Publisher: <strong className="text-slate-700 font-medium">{item.publisher}</strong>
                    </span>
                    <span className="mx-1.5 text-slate-300" aria-hidden="true">
                      ·
                    </span>
                    <span className={hasOriginalUrl ? 'text-[#15803D] font-medium' : 'text-slate-500'}>
                      {hasOriginalUrl ? 'Original link available' : 'Original source unavailable'}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#15803D]">
                    <span>Read Summary &amp; Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
};
