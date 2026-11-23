import React from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, MessageSquareText } from 'lucide-react';
import {
  getNewsArticleById,
  getRelatedNews,
  isValidOriginalArticleUrl,
} from '../services/newsService';
import { TickerSymbol } from '../types/financial';

interface ArticleViewProps {
  articleId: string;
  onBackToNews: () => void;
  onOpenArticle: (articleId: string) => void;
  onSelectCompany: (ticker: TickerSymbol) => void;
  onAskTutor: (prompt?: string, ticker?: TickerSymbol) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  articleId,
  onBackToNews,
  onOpenArticle,
  onSelectCompany,
  onAskTutor,
}) => {
  const article = getNewsArticleById(articleId);

  if (!article) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#0A1628]">Article Not Found</h1>
        <p className="text-sm text-slate-600">
          The requested article could not be loaded from the news archive.
        </p>
        <button
          type="button"
          onClick={onBackToNews}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#0A1628] text-white rounded-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to News &amp; Events</span>
        </button>
      </main>
    );
  }

  const relatedArticles = getRelatedNews(article, 3);
  const { structuredBreakdown } = article;
  const hasOriginalUrl = isValidOriginalArticleUrl(article.originalArticleUrl);

  const breakdownItems = [
    { question: 'What happened?', answer: structuredBreakdown.whatHappened },
    { question: 'Why did it happen?', answer: structuredBreakdown.whyItHappened },
    { question: 'Which company is involved?', answer: structuredBreakdown.companyInvolved },
    {
      question: "How could this affect the company's financial performance?",
      answer: article.financialImpactAnalysis || structuredBreakdown.financialImpact,
    },
    {
      question: 'What are the potential risks or opportunities?',
      answer: structuredBreakdown.risksAndOpportunities,
    },
  ];

  return (
    <main className="pb-16">
      {/* Top Return Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={onBackToNews}
              className="inline-flex items-center gap-1.5 font-semibold text-[#0A1628] hover:text-[#15803D] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to News &amp; Events</span>
            </button>
            <span className="text-slate-300" aria-hidden="true">
              /
            </span>
            <span className="font-mono font-semibold text-slate-600">{article.companyName}</span>
            <span className="text-slate-300" aria-hidden="true">
              /
            </span>
            <span className="text-slate-500">{article.category}</span>
          </div>

          <span className="text-xs text-slate-500">
            {article.isIllustrative
              ? 'Illustrative Sample Article · Original source unavailable'
              : 'Verified External Financial News Summary'}
          </span>
        </div>
      </div>

      {/* Article Header (Deep Navy) */}
      <header className="bg-[#0A1628] text-white border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="font-mono font-semibold text-[#4ADE80]">{article.ticker}</span>
            <span aria-hidden="true">·</span>
            <span>{article.companyInvolved}</span>
            <span aria-hidden="true">·</span>
            <span>{article.category}</span>
            {article.isIllustrative && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-300 font-medium">Illustrative Sample</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-white text-balance">
            {article.headline}
          </h1>

          <p className="text-base text-slate-300 leading-relaxed max-w-3xl">
            {article.articleSummary}
          </p>

          {/* Publisher, Publication Date, Original URL & Read Original Article Action */}
          <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
                <div>
                  <span className="text-slate-400">Publisher: </span>
                  <strong className="text-white font-medium">{article.publisher}</strong>
                </div>
                {article.author && (
                  <div>
                    <span className="text-slate-400">Author: </span>
                    <strong className="text-white font-medium">{article.author}</strong>
                  </div>
                )}
                <div>
                  <span className="text-slate-400">Publication Date: </span>
                  <strong className="text-white font-medium">{article.publicationDate}</strong>
                </div>
              </div>
              <div>
                <span className="text-slate-400">Original Article URL: </span>
                {hasOriginalUrl ? (
                  <a
                    href={article.originalArticleUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4ADE80] hover:underline break-all"
                  >
                    {article.originalArticleUrl}
                  </a>
                ) : (
                  <span className="text-slate-300 font-medium">Original source unavailable</span>
                )}
              </div>
            </div>

            {hasOriginalUrl ? (
              <a
                href={article.originalArticleUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <span>Read Original Article</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            ) : (
              <span className="inline-flex items-center px-4 py-2.5 bg-white/10 border border-white/15 text-slate-300 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0">
                Original source unavailable
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Article Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Summary, Financial Impact Analysis & Research Breakdown */}
          <article className="lg:col-span-8 space-y-6">
            <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="pb-4 border-b border-slate-100 space-y-1">
                <div className="text-xs font-semibold text-[#15803D]">
                  {article.isIllustrative
                    ? 'Illustrative Educational Summary & Financial Analysis'
                    : 'ClearLedger Original Summary & Financial Analysis'}
                </div>
                <h2 className="text-lg font-bold text-[#0A1628]">Key Research Breakdown</h2>
                <p className="text-xs text-slate-500">
                  ClearLedger displays concise summaries and financial impact analysis rather than reproducing
                  copyrighted third-party articles without permission.
                </p>
              </div>

              <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-lg space-y-1.5">
                <div className="text-xs font-bold text-[#0A1628]">Financial Impact Analysis</div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {article.financialImpactAnalysis}
                </p>
              </div>

              <div className="space-y-5">
                {breakdownItems.map((item, index) => (
                  <div key={item.question} className="space-y-1.5">
                    <h3 className="text-sm font-bold text-[#0A1628]">
                      0{index + 1}. {item.question}
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>

              {/* Publisher Attribution & Original Source Status */}
              <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-600 space-y-0.5">
                  <div>
                    Publisher: <strong className="text-[#0A1628]">{article.publisher}</strong> ·{' '}
                    {article.publicationDate}
                  </div>
                  <div className="text-slate-500">
                    {hasOriginalUrl
                      ? 'Open the original publisher article in a new browser tab.'
                      : 'Original source unavailable — this entry is an illustrative educational sample without an external publisher URL.'}
                  </div>
                </div>

                {hasOriginalUrl && (
                  <a
                    href={article.originalArticleUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    <span>Read Original Article</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </section>

            {/* Required Section: Why This Matters Financially */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
              <div className="text-xs font-semibold text-[#15803D]">Beginner Research Perspective</div>
              <h2 className="text-xl font-bold text-[#0A1628]">Why This Matters Financially</h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {article.beginnerTakeaway}
              </p>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                Educational explanation only—ClearLedger does not provide personalized investment advice or tell users
                what to buy or sell.
              </p>
            </section>
          </article>

          {/* Right Sidebar: Key Financial Term + Company & AI Actions */}
          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            <div className="bg-[#0A1628] text-white rounded-xl p-6 space-y-3">
              <div className="text-xs font-semibold text-[#4ADE80]">Key Financial Term Explained</div>
              <h3 className="text-base font-bold text-white">{article.keyTermExplained.term}</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {article.keyTermExplained.definition}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-[#0A1628]">Explore Further</h3>

              {hasOriginalUrl ? (
                <a
                  href={article.originalArticleUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2.5 text-xs font-semibold bg-[#0A1628] hover:bg-[#102038] text-white rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>Read Original Article</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-[#0A1628]">Original source unavailable</strong> — Sample articles illustrate
                  how ClearLedger structures financial news until a live news API is connected.
                </div>
              )}

              {article.ticker !== 'MARKET' && (
                <button
                  type="button"
                  onClick={() => onSelectCompany(article.ticker as TickerSymbol)}
                  className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-[#0A1628] rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Open {article.companyName} Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  onAskTutor(
                    `Explain "${article.keyTermExplained.term}" and how "${article.headline}" connects to ${article.companyName}'s financials.`,
                    article.ticker !== 'MARKET' ? (article.ticker as TickerSymbol) : undefined
                  )
                }
                className="w-full px-4 py-2.5 text-xs font-semibold bg-[#15803D] hover:bg-[#166534] text-white rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquareText className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ask AI Tutor About This</span>
              </button>
            </div>
          </aside>
        </div>

        {/* Related News Section */}
        <section className="pt-8 border-t border-slate-200 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0A1628]">Related News &amp; Events</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Continue reading illustrative summaries and financial analysis across AMD, NVIDIA, Walmart, and
                Microsoft.
              </p>
            </div>
            <button
              type="button"
              onClick={onBackToNews}
              className="text-xs font-semibold text-[#15803D] hover:underline cursor-pointer"
            >
              View all news
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => {
              const relHasUrl = isValidOriginalArticleUrl(rel.originalArticleUrl);
              return (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => onOpenArticle(rel.id)}
                  className="text-left bg-white border border-slate-200 hover:border-[#0A1628] rounded-xl p-5 flex flex-col justify-between gap-4 transition-colors cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="text-xs text-slate-500 font-medium">
                      <span className="font-mono font-semibold text-[#0A1628]">{rel.ticker}</span> · {rel.category} ·{' '}
                      {rel.publicationDate}
                    </div>
                    <h3 className="text-base font-bold text-[#0A1628] leading-snug">{rel.headline}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{rel.articleSummary}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs w-full">
                    <span className="text-slate-500 truncate pr-2">
                      {relHasUrl ? rel.publisher : 'Original source unavailable'}
                    </span>
                    <span className="font-semibold text-[#15803D] whitespace-nowrap inline-flex items-center gap-1">
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};
