export type TickerSymbol = 'AMD' | 'NVDA' | 'WMT' | 'MSFT';

export type ProjectionScenarioType = 'bear' | 'base' | 'bull';

export interface RevenueSegment {
  name: string;
  sharePercent: number;
  revenueBillions: number;
  description: string;
}

export interface FinancialPeriod {
  period: string; // e.g. 'FY 2021', 'Q4 2025'
  revenueB: number;
  grossProfitB: number;
  netIncomeB: number;
  eps: number;
  operatingCashFlowB: number;
  freeCashFlowB: number;
}

export interface StockPricePoint {
  date: string; // YYYY-MM-DD
  label: string; // e.g. 'Jan 2022'
  price: number;
}

export interface ProjectionYear {
  year: string; // e.g. '2026E'
  revenueB: number;
  netIncomeB: number;
  operatingCashFlowB: number;
  eps: number;
}

export interface ProjectionScenario {
  type: ProjectionScenarioType;
  label: string;
  revenueCagrPercent: number;
  targetNetMarginPercent: number;
  summary: string;
  keyDrivers: string[];
  yearly: ProjectionYear[];
}

export interface CompanyProfile {
  ticker: TickerSymbol;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  headquarters: string;
  ceo: string;
  founded: number;
  employees: string;
  website: string;
  plainEnglishSummary: string;
  businessModelNote: string;
  isIllustrativeData: true;
  illustrativeMarket: {
    price: number;
    changePercent: number;
    marketCapB: number;
    peRatio: number;
    dividendYieldPercent: number;
    week52Low: number;
    week52High: number;
    beta: number;
  };
  segments: RevenueSegment[];
  strengths: string[];
  risks: string[];
  annualFinancials: FinancialPeriod[];
  quarterlyFinancials: FinancialPeriod[];
  stockHistory5Y: StockPricePoint[];
  projections: Record<ProjectionScenarioType, ProjectionScenario>;
}

export type NewsCategory =
  | 'Company Announcements'
  | 'Earnings Reports'
  | 'Financial Developments'
  | 'Industry Events';

export interface ArticleStructuredBreakdown {
  whatHappened: string;
  whyItHappened: string;
  companyInvolved: string;
  financialImpact: string;
  risksAndOpportunities: string;
}

export interface FinancialNewsItem {
  id: string;
  ticker: TickerSymbol | 'MARKET';
  companyName: string;
  companyInvolved: string;
  category: NewsCategory;
  headline: string;
  publisher: string;
  publicationDate: string;
  originalArticleUrl: string | null;
  articleSummary: string;
  financialImpactAnalysis: string;
  author?: string;
  structuredBreakdown: ArticleStructuredBreakdown;
  beginnerTakeaway: string;
  keyTermExplained: {
    term: string;
    definition: string;
  };
  isIllustrative: boolean;
  providerId?: string;
}

/**
 * Raw payload contract expected from a future backend financial news API (e.g., `/api/news`).
 * Normalized into `FinancialNewsItem` by `src/services/newsService.ts`.
 */
export interface ExternalNewsApiRecord {
  id: string;
  ticker?: TickerSymbol | 'MARKET';
  companyName?: string;
  companyInvolved: string;
  category?: NewsCategory;
  headline: string;
  publisher: string;
  publicationDate: string;
  originalArticleUrl?: string | null;
  articleSummary: string;
  financialImpactAnalysis: string;
  author?: string;
  beginnerTakeaway?: string;
  keyTermExplained?: {
    term: string;
    definition: string;
  };
  structuredBreakdown?: Partial<ArticleStructuredBreakdown>;
  providerId?: string;
}

export interface BeginnerTerm {
  key: string;
  term: string;
  shortDefinition: string;
  plainExample: string;
  whyItMatters: string;
}

export interface AssistantResponseSection {
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  title?: string;
  sections?: AssistantResponseSection[];
  dataNotice?: string;
  relatedTicker?: TickerSymbol;
  timestamp: string;
}
