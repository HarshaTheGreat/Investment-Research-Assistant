import { ILLUSTRATIVE_COMPANIES, BEGINNER_GLOSSARY } from '../data/sampleCompanies';
import { BeginnerTerm, CompanyProfile, FinancialNewsItem, NewsCategory, TickerSymbol } from '../types/financial';
import { getFinancialNews } from './newsService';

/**
 * Data Service Abstraction Layer
 * ------------------------------
 * Currently backed by illustrative sample datasets in `src/data/`.
 * When connecting real market data APIs later (e.g., SEC EDGAR, Polygon, Alpha Vantage,
 * or your own Express `/api/companies/:ticker` backend), swap the implementations
 * inside these functions without modifying UI components.
 */

export function getAllCompanies(): CompanyProfile[] {
  return ILLUSTRATIVE_COMPANIES;
}

export function getCompanyByTicker(ticker: string): CompanyProfile | undefined {
  const normalized = ticker.trim().toUpperCase();
  return ILLUSTRATIVE_COMPANIES.find((c) => c.ticker === normalized);
}

export function searchCompanies(query: string): CompanyProfile[] {
  const q = query.trim().toLowerCase();
  if (!q) return ILLUSTRATIVE_COMPANIES;
  return ILLUSTRATIVE_COMPANIES.filter(
    (c) =>
      c.ticker.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q)
  );
}

export function getNewsItems(filters?: {
  ticker?: TickerSymbol | 'ALL';
  category?: NewsCategory | 'ALL';
  search?: string;
}): FinancialNewsItem[] {
  return getFinancialNews(filters);
}

export function getBeginnerGlossary(): BeginnerTerm[] {
  return BEGINNER_GLOSSARY;
}

export function formatBillions(valueB: number): string {
  if (Math.abs(valueB) >= 1000) {
    return `$${(valueB / 1000).toFixed(2)}T`;
  }
  return `$${valueB.toFixed(1)}B`;
}
