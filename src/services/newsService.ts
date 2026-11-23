import { ILLUSTRATIVE_NEWS } from '../data/sampleNews';
import {
  ExternalNewsApiRecord,
  FinancialNewsItem,
  NewsCategory,
  TickerSymbol,
} from '../types/financial';

/**
 * News & Events Service Abstraction & External API Adapter
 * --------------------------------------------------------
 * Currently backed by clearly labeled illustrative sample articles (`src/data/sampleNews.ts`)
 * where `originalArticleUrl` is `null` and no fake publisher names or dates are generated.
 *
 * Future Legitimate Financial News API Integration:
 * 1. Add a server-side proxy route (e.g., `/api/news`) in `server.ts` connected to:
 *    - Official SEC EDGAR filing feeds (8-K, 10-Q, 10-K)
 *    - Official Company Investor Relations RSS/JSON feeds (AMD, NVIDIA, Walmart, Microsoft)
 *    - Licensed financial news APIs (e.g., Polygon, Finnhub, Alpha Vantage, Benzinga)
 * 2. Map external responses through `normalizeExternalNewsArticle()`, which validates
 *    `originalArticleUrl` via `isValidOriginalArticleUrl()` and sets `isIllustrative: false`.
 * 3. Configure `NEWS_API_ENDPOINT` (or pass a custom `NewsDataProvider`) without modifying UI components.
 */

export interface NewsFilterOptions {
  ticker?: TickerSymbol | 'ALL';
  category?: NewsCategory | 'ALL';
  search?: string;
}

export interface NewsDataProvider {
  id: string;
  isLiveApi: boolean;
  listNews: (filters?: NewsFilterOptions) => Promise<FinancialNewsItem[]>;
  getArticleById: (id: string) => Promise<FinancialNewsItem | undefined>;
}

export const NEWS_CATEGORIES: NewsCategory[] = [
  'Company Announcements',
  'Earnings Reports',
  'Financial Developments',
  'Industry Events',
];

/**
 * Validates that an external article URL uses safe http/https protocols.
 * Returns false for null, empty strings, relative paths, or unsafe schemes (e.g., javascript:).
 */
export function isValidOriginalArticleUrl(url: string | null | undefined): url is string {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Normalizes a raw payload from a future legitimate financial news API into
 * ClearLedger's `FinancialNewsItem` shape without ever fabricating missing URLs.
 */
export function normalizeExternalNewsArticle(raw: ExternalNewsApiRecord): FinancialNewsItem {
  const validUrl = isValidOriginalArticleUrl(raw.originalArticleUrl)
    ? raw.originalArticleUrl.trim()
    : null;

  const ticker: TickerSymbol | 'MARKET' = raw.ticker ?? 'MARKET';
  const companyName = raw.companyName?.trim() || raw.companyInvolved;

  return {
    id: raw.id,
    ticker,
    companyName,
    companyInvolved: raw.companyInvolved,
    category: raw.category ?? 'Financial Developments',
    headline: raw.headline,
    publisher: raw.publisher,
    publicationDate: raw.publicationDate,
    originalArticleUrl: validUrl,
    articleSummary: raw.articleSummary,
    financialImpactAnalysis: raw.financialImpactAnalysis,
    author: raw.author,
    structuredBreakdown: {
      whatHappened: raw.structuredBreakdown?.whatHappened || raw.articleSummary,
      whyItHappened:
        raw.structuredBreakdown?.whyItHappened ||
        'Context derived from the verified external financial report or corporate announcement.',
      companyInvolved: raw.structuredBreakdown?.companyInvolved || raw.companyInvolved,
      financialImpact: raw.structuredBreakdown?.financialImpact || raw.financialImpactAnalysis,
      risksAndOpportunities:
        raw.structuredBreakdown?.risksAndOpportunities ||
        'Review the original publisher article and official company filings for full risk disclosures.',
    },
    beginnerTakeaway: raw.beginnerTakeaway || raw.financialImpactAnalysis,
    keyTermExplained: raw.keyTermExplained ?? {
      term: 'Financial Disclosure',
      definition:
        'Publicly reported information that helps investors evaluate a company’s revenue, expenses, risks, and cash flow.',
    },
    isIllustrative: false,
    providerId: raw.providerId || 'external-api',
  };
}

function applyNewsFilters(
  items: FinancialNewsItem[],
  filters?: NewsFilterOptions
): FinancialNewsItem[] {
  return items.filter((item) => {
    if (filters?.ticker && filters.ticker !== 'ALL' && item.ticker !== filters.ticker) {
      return false;
    }
    if (filters?.category && filters.category !== 'ALL' && item.category !== filters.category) {
      return false;
    }
    if (filters?.search && filters.search.trim().length > 0) {
      const q = filters.search.toLowerCase();
      return (
        item.headline.toLowerCase().includes(q) ||
        item.articleSummary.toLowerCase().includes(q) ||
        item.companyInvolved.toLowerCase().includes(q) ||
        item.companyName.toLowerCase().includes(q) ||
        item.publisher.toLowerCase().includes(q) ||
        item.keyTermExplained.term.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

/**
 * Default illustrative sample provider (no fake URLs, no fake publishers).
 */
export const illustrativeNewsProvider: NewsDataProvider = {
  id: 'illustrative-sample',
  isLiveApi: false,
  async listNews(filters?: NewsFilterOptions): Promise<FinancialNewsItem[]> {
    return applyNewsFilters(ILLUSTRATIVE_NEWS, filters);
  },
  async getArticleById(id: string): Promise<FinancialNewsItem | undefined> {
    return ILLUSTRATIVE_NEWS.find((item) => item.id === id);
  },
};

/**
 * Factory for connecting a real backend `/api/news` proxy once available.
 * Expects JSON `{ articles: ExternalNewsApiRecord[] }`.
 */
export function createApiNewsProvider(endpoint = '/api/news'): NewsDataProvider {
  return {
    id: 'external-api',
    isLiveApi: true,
    async listNews(filters?: NewsFilterOptions): Promise<FinancialNewsItem[]> {
      const params = new URLSearchParams();
      if (filters?.ticker && filters.ticker !== 'ALL') params.set('ticker', filters.ticker);
      if (filters?.category && filters.category !== 'ALL') params.set('category', filters.category);
      if (filters?.search?.trim()) params.set('q', filters.search.trim());

      const url = params.toString() ? `${endpoint}?${params.toString()}` : endpoint;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`News API request failed (${response.status})`);
      }
      const data = (await response.json()) as { articles?: ExternalNewsApiRecord[] };
      const normalized = (data.articles ?? []).map(normalizeExternalNewsArticle);
      return applyNewsFilters(normalized, filters);
    },
    async getArticleById(id: string): Promise<FinancialNewsItem | undefined> {
      const response = await fetch(`${endpoint}/${encodeURIComponent(id)}`);
      if (response.status === 404) return undefined;
      if (!response.ok) {
        throw new Error(`News article request failed (${response.status})`);
      }
      const data = (await response.json()) as { article?: ExternalNewsApiRecord };
      return data.article ? normalizeExternalNewsArticle(data.article) : undefined;
    },
  };
}

let activeNewsProvider: NewsDataProvider = illustrativeNewsProvider;

export function setNewsDataProvider(provider: NewsDataProvider): void {
  activeNewsProvider = provider;
}

export function getActiveNewsProvider(): NewsDataProvider {
  return activeNewsProvider;
}

/**
 * Async loader prepared for future live financial news API calls.
 */
export async function loadFinancialNews(
  filters?: NewsFilterOptions
): Promise<FinancialNewsItem[]> {
  return activeNewsProvider.listNews(filters);
}

export async function loadNewsArticleById(id: string): Promise<FinancialNewsItem | undefined> {
  return activeNewsProvider.getArticleById(id);
}

/**
 * Synchronous helpers used by the current illustrative frontend state.
 */
export function getFinancialNews(filters?: NewsFilterOptions): FinancialNewsItem[] {
  return applyNewsFilters(ILLUSTRATIVE_NEWS, filters);
}

export function getNewsArticleById(id: string): FinancialNewsItem | undefined {
  return ILLUSTRATIVE_NEWS.find((item) => item.id === id);
}

export function getRelatedNews(article: FinancialNewsItem, limit = 3): FinancialNewsItem[] {
  const others = ILLUSTRATIVE_NEWS.filter((item) => item.id !== article.id);
  const scored = others.sort((a, b) => {
    const scoreA = (a.ticker === article.ticker ? 2 : 0) + (a.category === article.category ? 1 : 0);
    const scoreB = (b.ticker === article.ticker ? 2 : 0) + (b.category === article.category ? 1 : 0);
    return scoreB - scoreA;
  });
  return scored.slice(0, limit);
}
