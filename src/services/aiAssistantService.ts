import { AssistantResponseSection, CompanyProfile, TickerSymbol } from '../types/financial';
import { formatBillions, getAllCompanies, getCompanyByTicker } from './financialDataService';

/**
 * AI Financial Research Assistant Service
 * ---------------------------------------
 * Currently backed by a structured, domain-grounded educational tutor engine
 * using ClearLedger's illustrative sample datasets.
 *
 * Future Upgrade Path:
 * Swap `askResearchAssistant` to call a server-side Gemini endpoint (`/api/assistant`)
 * with the active company context while preserving the exact return structure.
 */

export interface AssistantReply {
  title: string;
  text: string;
  sections: AssistantResponseSection[];
  dataNotice: string;
  relatedTicker?: TickerSymbol;
}

const SAMPLE_NOTICE =
  'Data Distinction: Any numbers shown above come from ClearLedger’s illustrative sample dataset for learning—not real-time or verified market data. Always check official SEC filings (10-K / 10-Q) for verified figures.';

const CONCEPT_ONLY_NOTICE =
  'Educational Concept: ClearLedger uses illustrative sample figures on company dashboards. Verify real-world company metrics through official SEC filings (10-K / 10-Q).';

function detectMentionedCompanies(q: string): CompanyProfile[] {
  const found: CompanyProfile[] = [];
  const checks: { ticker: TickerSymbol; keywords: string[] }[] = [
    { ticker: 'AMD', keywords: ['amd', 'advanced micro'] },
    { ticker: 'NVDA', keywords: ['nvidia', 'nvda'] },
    { ticker: 'WMT', keywords: ['walmart', 'wmt'] },
    { ticker: 'MSFT', keywords: ['microsoft', 'msft'] },
  ];

  for (const item of checks) {
    if (item.keywords.some((kw) => q.includes(kw))) {
      const c = getCompanyByTicker(item.ticker);
      if (c) found.push(c);
    }
  }
  return found;
}

function detectUnsupportedCompany(q: string): string | null {
  const unsupported = [
    'apple', 'aapl', 'amazon', 'amzn', 'google', 'alphabet', 'googl',
    'tesla', 'tsla', 'meta', 'facebook', 'netflix', 'nflx', 'intel', 'intc',
    'costco', 'cost', 'target', 'tgt',
  ];
  const match = unsupported.find((name) => new RegExp(`\\b${name}\\b`, 'i').test(q));
  return match ? match.toUpperCase() : null;
}

function formatCompanyPerformance(c: CompanyProfile): AssistantReply {
  const first = c.annualFinancials[0];
  const latest = c.annualFinancials[c.annualFinancials.length - 1];
  const gm = ((latest.grossProfitB / latest.revenueB) * 100).toFixed(1);
  const nm = ((latest.netIncomeB / latest.revenueB) * 100).toFixed(1);
  const revGrowthTotal = (((latest.revenueB - first.revenueB) / first.revenueB) * 100).toFixed(0);
  const topSeg = c.segments[0];

  const sections: AssistantResponseSection[] = [
    {
      heading: 'Business Overview',
      body: `${c.plainEnglishSummary} ${c.businessModelNote}`,
    },
    {
      heading: `Illustrative Financial Performance (${first.period} → ${latest.period})`,
      bullets: [
        `Revenue grew from ${formatBillions(first.revenueB)} (${first.period}) to ${formatBillions(latest.revenueB)} (${latest.period}), an illustrative change of +${revGrowthTotal}% over the 5-year sample window.`,
        `Gross Profit reached ${formatBillions(latest.grossProfitB)} (${gm}% gross margin) and Net Income reached ${formatBillions(latest.netIncomeB)} (${nm}% net margin).`,
        `Earnings Per Share (EPS) stood at $${latest.eps.toFixed(2)}, with ${formatBillions(latest.operatingCashFlowB)} in Operating Cash Flow and ${formatBillions(latest.freeCashFlowB)} in Free Cash Flow.`,
        `Largest segment: ${topSeg.name} (${topSeg.sharePercent}% of illustrative revenue).`,
      ],
    },
    {
      heading: 'Key Risks & Challenges to Watch',
      bullets: c.risks,
    },
  ];

  return {
    title: `${c.name} (${c.ticker}) — Educational Summary`,
    text: `${c.plainEnglishSummary}`,
    sections,
    dataNotice: SAMPLE_NOTICE,
    relatedTicker: c.ticker,
  };
}

function formatPairComparison(a: CompanyProfile, b: CompanyProfile): AssistantReply {
  const finA = a.annualFinancials[a.annualFinancials.length - 1];
  const finB = b.annualFinancials[b.annualFinancials.length - 1];
  const gmA = ((finA.grossProfitB / finA.revenueB) * 100).toFixed(1);
  const gmB = ((finB.grossProfitB / finB.revenueB) * 100).toFixed(1);
  const nmA = ((finA.netIncomeB / finA.revenueB) * 100).toFixed(1);
  const nmB = ((finB.netIncomeB / finB.revenueB) * 100).toFixed(1);

  return {
    title: `${a.ticker} vs. ${b.ticker} — Side-by-Side Explanation`,
    text: `Comparing ${a.name} and ${b.name} using illustrative sample figures.`,
    sections: [
      {
        heading: 'Business Model Differences',
        bullets: [
          `${a.name} (${a.ticker}): ${a.industry}. ${a.plainEnglishSummary}`,
          `${b.name} (${b.ticker}): ${b.industry}. ${b.plainEnglishSummary}`,
        ],
      },
      {
        heading: 'Illustrative Dashboard Metrics',
        bullets: [
          `Revenue: ${a.ticker} ${formatBillions(finA.revenueB)} (${finA.period}) vs. ${b.ticker} ${formatBillions(finB.revenueB)} (${finB.period}).`,
          `Profit Margins: ${a.ticker} keeps ${gmA}% Gross / ${nmA}% Net Margin, while ${b.ticker} keeps ${gmB}% Gross / ${nmB}% Net Margin.`,
          `Operating Cash Flow & EPS: ${a.ticker} generated ${formatBillions(finA.operatingCashFlowB)} ($${finA.eps.toFixed(2)} EPS) vs. ${b.ticker} at ${formatBillions(finB.operatingCashFlowB)} ($${finB.eps.toFixed(2)} EPS).`,
          `Stock Sensitivity (Beta): ${a.ticker} ${a.illustrativeMarket.beta.toFixed(2)} vs. ${b.ticker} ${b.illustrativeMarket.beta.toFixed(2)} (higher Beta means wider price swings).`,
        ],
      },
      {
        heading: 'Beginner Takeaway',
        body:
          'Neither business model is automatically "better." Higher margins often reflect software or specialized chip design, while massive revenue with lower margins often reflects high-volume everyday retail. Always evaluate risks alongside growth.',
      },
    ],
    dataNotice: SAMPLE_NOTICE,
  };
}

export async function askResearchAssistant(
  question: string,
  activeTicker?: TickerSymbol
): Promise<AssistantReply> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const q = question.toLowerCase().trim();
  const allCompanies = getAllCompanies();
  const mentioned = detectMentionedCompanies(q);
  const targetCompany: CompanyProfile | undefined =
    mentioned[0] ?? (activeTicker ? getCompanyByTicker(activeTicker) : undefined);

  // 1. Guardrail: Refuse personalized investment advice
  if (
    q.includes('should i buy') ||
    q.includes('should i sell') ||
    q.includes('what to buy') ||
    q.includes('which is better to buy') ||
    q.includes('better investment') ||
    q.includes('good investment') ||
    q.includes('invest in') ||
    q.includes('buy or sell') ||
    q.includes('price target') ||
    q.includes('recommend') ||
    q.includes('which stock should')
  ) {
    return {
      title: 'Educational Guidance Only (No Investment Advice)',
      text: 'ClearLedger cannot recommend what to buy or sell.',
      relatedTicker: targetCompany?.ticker,
      sections: [
        {
          heading: 'Why I Cannot Give Buy or Sell Advice',
          body:
            'ClearLedger is strictly an educational research platform. Deciding what to buy or sell depends on your personal goals, timeline, and risk tolerance—and requires verified, real-time financial filings rather than illustrative sample data.',
        },
        {
          heading: 'How Analysts Research Any Company Objectively',
          bullets: [
            'Understand the Business: Identify what the company sells and what competitive advantages protect it.',
            'Check Profitability & Cash Flow: Compare Gross Margin, Net Income, and Operating/Free Cash Flow over multiple years.',
            'Study the Risks: Read the Bear Case and core business risks before looking at optimistic Bull projections.',
          ],
        },
      ],
      dataNotice: CONCEPT_ONLY_NOTICE,
    };
  }

  // 2. Unsupported company check (never invent data)
  const unsupported = detectUnsupportedCompany(q);
  if (unsupported && mentioned.length === 0) {
    return {
      title: `${unsupported} Is Not in the Sample Dataset`,
      text: `ClearLedger currently includes illustrative data for AMD, NVIDIA, Walmart, and Microsoft.`,
      sections: [
        {
          heading: 'Available Companies',
          body: `I do not have sample or live data for ${unsupported}, and I will never invent financial numbers. Right now, you can ask me about AMD, NVIDIA (NVDA), Walmart (WMT), or Microsoft (MSFT), or ask about any financial concept like revenue, EPS, net income, cash flow, or debt.`,
        },
      ],
      dataNotice: CONCEPT_ONLY_NOTICE,
    };
  }

  // 3. Pairwise or Multi-Company Comparison
  if (
    mentioned.length >= 2 ||
    ((q.includes('compare') || q.includes('difference') || q.includes('versus') || q.includes(' vs ')) &&
      (mentioned.length > 0 || q.includes('companies') || q.includes('all') || q.includes('margin')))
  ) {
    if (mentioned.length >= 2) {
      return formatPairComparison(mentioned[0], mentioned[1]);
    }

    const bullets = allCompanies.map((c) => {
      const latest = c.annualFinancials[c.annualFinancials.length - 1];
      const gm = ((latest.grossProfitB / latest.revenueB) * 100).toFixed(1);
      const nm = ((latest.netIncomeB / latest.revenueB) * 100).toFixed(1);
      return `${c.name} (${c.ticker}) — ${c.industry}: ${formatBillions(latest.revenueB)} revenue, ${gm}% gross margin, ${nm}% net margin, ${formatBillions(latest.operatingCashFlowB)} operating cash flow.`;
    });

    return {
      title: 'Comparing All Four Companies (Illustrative Data)',
      text: 'Comparison across AMD, NVIDIA, Walmart, and Microsoft.',
      sections: [
        {
          heading: 'Latest Illustrative Fiscal Snapshot',
          bullets,
        },
        {
          heading: 'Why Their Numbers Look So Different',
          body:
            'Walmart generates massive retail sales volume with thin profit margins (~3%), Microsoft blends large scale with recurring software subscriptions, NVIDIA earns high margins on full-stack AI chips and CUDA software, and AMD balances fast-growing data center processors with consumer PCs and gaming.',
        },
      ],
      dataNotice: SAMPLE_NOTICE,
    };
  }

  // 4. Financial Terms (Debt, Revenue, Gross Profit, Net Income, EPS, Cash Flow, P/E, Projections)
  if (q.includes('debt') || q.includes('leverage') || q.includes('balance sheet') || q.includes('liabilities')) {
    return {
      title: 'Understanding Corporate Debt in Simple Language',
      text: 'Debt explained for beginners.',
      relatedTicker: targetCompany?.ticker,
      sections: [
        {
          heading: 'What Is Corporate Debt?',
          body:
            'Corporate debt is money a company borrows—usually by issuing bonds or taking bank loans—to build factories, buy equipment, fund expansion, or acquire another business. Just like a household mortgage, the company must pay regular interest and eventually repay the principal.',
        },
        {
          heading: 'Why Beginners Watch Debt',
          bullets: [
            'Interest Expense: Heavy debt means more profit goes toward interest payments instead of reinvestment or dividends.',
            'Cash Cushion vs. Debt: Analysts compare total debt against cash on hand and Operating Cash Flow to see if bills are easily covered during a recession.',
            'Key Ratios: Common checks include Debt-to-Equity and Net Debt ÷ Free Cash Flow.',
          ],
        },
        {
          heading: 'Dashboard Availability Note',
          body:
            'ClearLedger’s current illustrative dashboards focus on the Income Statement and Cash Flow Statement (Revenue, Gross Profit, Net Income, EPS, Operating & Free Cash Flow). Detailed Balance Sheet debt tables are not yet included in this sample dataset, so always check a company’s official 10-K Balance Sheet for verified debt figures.',
        },
      ],
      dataNotice: CONCEPT_ONLY_NOTICE,
    };
  }

  if (q.includes('cash flow') || q.includes('fcf') || q.includes('ocf')) {
    const bullets: string[] = [
      'Operating Cash Flow (OCF): Actual cash brought in by day-to-day business operations after paying suppliers, staff, and taxes.',
      'Capital Expenditures (CapEx): Cash spent to buy or upgrade long-term assets like AI servers, chip equipment, or retail stores.',
      'Free Cash Flow (FCF) = Operating Cash Flow minus CapEx. It represents spare cash available for dividends, debt payoff, or savings.',
    ];
    if (targetCompany) {
      const latest = targetCompany.annualFinancials[targetCompany.annualFinancials.length - 1];
      bullets.push(
        `Illustrative ${targetCompany.ticker} (${latest.period}): Operating Cash Flow was ${formatBillions(latest.operatingCashFlowB)} and Free Cash Flow was ${formatBillions(latest.freeCashFlowB)}.`
      );
    }
    return {
      title: 'Operating Cash Flow & Free Cash Flow Explained',
      text: 'Cash flow explained in plain English.',
      relatedTicker: targetCompany?.ticker,
      sections: [
        {
          heading: 'Why Cash Flow Matters More Than Paper Profit Alone',
          body:
            'Accounting profit (Net Income) includes non-cash estimates like depreciation. Cash flow tracks real dollars entering and leaving the company’s bank accounts.',
        },
        {
          heading: 'The Two Numbers to Know',
          bullets,
        },
      ],
      dataNotice: targetCompany ? SAMPLE_NOTICE : CONCEPT_ONLY_NOTICE,
    };
  }

  if (q.includes('eps') || q.includes('earnings per share')) {
    const sections: AssistantResponseSection[] = [
      {
        heading: 'What Is EPS?',
        body:
          'Earnings Per Share (EPS) tells you how much annual Net Income belongs to a single share of stock. Formula: Net Income ÷ Total Shares Outstanding.',
      },
      {
        heading: 'Beginner Example & Usage',
        bullets: [
          'If a company earns $100M in Net Income and has 50M shares, its EPS is $2.00 per share.',
          'Tracking EPS over 5 years helps you see whether profit per share is growing—not just total company size.',
          'EPS is also the denominator in the P/E Ratio (Stock Price ÷ EPS).',
        ],
      },
    ];
    if (targetCompany) {
      const latest = targetCompany.annualFinancials[targetCompany.annualFinancials.length - 1];
      sections.push({
        heading: `Illustrative ${targetCompany.ticker} Example`,
        body: `On the ${targetCompany.ticker} dashboard, ${latest.period} illustrative EPS is $${latest.eps.toFixed(2)} per share (from ${formatBillions(latest.netIncomeB)} in illustrative Net Income).`,
      });
    }
    return {
      title: 'Earnings Per Share (EPS) Explained',
      text: 'EPS explained for beginners.',
      relatedTicker: targetCompany?.ticker,
      sections,
      dataNotice: targetCompany ? SAMPLE_NOTICE : CONCEPT_ONLY_NOTICE,
    };
  }

  if (q.includes('net income') || q.includes('bottom line') || q.includes('net margin')) {
    const sections: AssistantResponseSection[] = [
      {
        heading: 'What Is Net Income?',
        body:
          'Net Income (often called the "Bottom Line") is the profit remaining after a company pays EVERY expense—cost of goods, salaries, research & development, interest on debt, and taxes.',
      },
      {
        heading: 'Net Income vs. Net Margin',
        bullets: [
          'Net Income is measured in dollars (e.g., billions).',
          'Net Margin (%) = Net Income ÷ Revenue. It tells you how many cents of pure profit a company keeps from every $1 of sales.',
        ],
      },
    ];
    if (targetCompany) {
      const latest = targetCompany.annualFinancials[targetCompany.annualFinancials.length - 1];
      const nm = ((latest.netIncomeB / latest.revenueB) * 100).toFixed(1);
      sections.push({
        heading: `Illustrative ${targetCompany.ticker} Snapshot`,
        body: `${targetCompany.ticker} shows ${formatBillions(latest.netIncomeB)} in ${latest.period} illustrative Net Income on ${formatBillions(latest.revenueB)} of revenue (${nm}% net margin).`,
      });
    }
    return {
      title: 'Net Income (The Bottom Line) Explained',
      text: 'Net Income explained simply.',
      relatedTicker: targetCompany?.ticker,
      sections,
      dataNotice: targetCompany ? SAMPLE_NOTICE : CONCEPT_ONLY_NOTICE,
    };
  }

  if (q.includes('gross profit') || q.includes('gross margin')) {
    const sections: AssistantResponseSection[] = [
      {
        heading: 'What Is Gross Profit?',
        body:
          'Gross Profit equals Revenue minus the direct cost of making or buying the product sold (Cost of Goods Sold). It does not yet subtract office salaries, marketing, or R&D.',
      },
      {
        heading: 'Why Industry Context Matters',
        bullets: [
          'Software and chip designers typically have high gross margins (50%–75%) because each extra unit costs relatively little to reproduce.',
          'Retailers like grocery chains often have lower gross margins (~25%) because buying physical merchandise to resell is expensive.',
        ],
      },
    ];
    if (targetCompany) {
      const latest = targetCompany.annualFinancials[targetCompany.annualFinancials.length - 1];
      const gm = ((latest.grossProfitB / latest.revenueB) * 100).toFixed(1);
      sections.push({
        heading: `Illustrative ${targetCompany.ticker} Snapshot`,
        body: `${targetCompany.ticker} shows ${formatBillions(latest.grossProfitB)} in ${latest.period} illustrative Gross Profit (${gm}% gross margin).`,
      });
    }
    return {
      title: 'Gross Profit & Gross Margin Explained',
      text: 'Gross Profit explained simply.',
      relatedTicker: targetCompany?.ticker,
      sections,
      dataNotice: targetCompany ? SAMPLE_NOTICE : CONCEPT_ONLY_NOTICE,
    };
  }

  if (q.includes('what is revenue') || q.includes('explain revenue') || (q.includes('revenue') && !targetCompany)) {
    return {
      title: 'Revenue (The Top Line) Explained',
      text: 'Revenue explained in simple language.',
      sections: [
        {
          heading: 'What Is Revenue?',
          body:
            'Revenue is the total amount of money a company collects from selling its products or services before subtracting any expenses. It sits at the very top of an income statement, which is why people call it the "Top Line."',
        },
        {
          heading: 'What Beginners Should Remember',
          bullets: [
            'Growing revenue shows rising customer demand for a company’s products or services.',
            'Revenue alone does NOT mean a company is profitable—if expenses exceed revenue, Net Income is negative.',
          ],
        },
      ],
      dataNotice: CONCEPT_ONLY_NOTICE,
    };
  }

  if (q.includes('p/e') || q.includes('pe ratio') || q.includes('valuation')) {
    const bullets = [
      'Formula: Stock Price ÷ Annual Earnings Per Share (EPS).',
      'Example: A $100 stock earning $5.00 per share has a P/E ratio of 20x.',
      'Higher P/E ratios generally indicate investors expect faster future profit growth; lower P/E ratios can indicate slower growth or higher perceived risk.',
    ];
    if (targetCompany) {
      bullets.push(
        `Illustrative ${targetCompany.ticker} P/E: ${targetCompany.illustrativeMarket.peRatio.toFixed(1)}x at an illustrative share price of $${targetCompany.illustrativeMarket.price.toFixed(2)}.`
      );
    }
    return {
      title: 'P/E Ratio (Price-to-Earnings) Explained',
      text: 'P/E Ratio explained simply.',
      relatedTicker: targetCompany?.ticker,
      sections: [
        {
          heading: 'How to Read a P/E Ratio',
          body:
            'The P/E Ratio measures how many dollars investors are currently paying for $1 of a company’s annual earnings.',
        },
        {
          heading: 'Key Points for Beginners',
          bullets,
        },
      ],
      dataNotice: targetCompany ? SAMPLE_NOTICE : CONCEPT_ONLY_NOTICE,
    };
  }

  if (q.includes('bear') || q.includes('bull') || q.includes('projection') || q.includes('scenario')) {
    if (targetCompany) {
      const bearEnd = targetCompany.projections.bear.yearly[4];
      const baseEnd = targetCompany.projections.base.yearly[4];
      const bullEnd = targetCompany.projections.bull.yearly[4];
      return {
        title: `${targetCompany.ticker} — 5-Year Scenario Models Explained`,
        text: `Bear, Base, and Bull scenarios for ${targetCompany.name}.`,
        relatedTicker: targetCompany.ticker,
        sections: [
          {
            heading: 'Why Analysts Model Three Scenarios',
            body:
              'Future business results are uncertain. Instead of guessing one exact number, ClearLedger illustrates three educational paths for the next 5 years:',
          },
          {
            heading: `Illustrative ${targetCompany.ticker} 5-Year Endpoints (${baseEnd.year})`,
            bullets: [
              `Bear Case (Cautious, +${targetCompany.projections.bear.revenueCagrPercent}%/yr): Revenue ${formatBillions(bearEnd.revenueB)}, Net Income ${formatBillions(bearEnd.netIncomeB)}. ${targetCompany.projections.bear.summary}`,
              `Base Case (Consensus, +${targetCompany.projections.base.revenueCagrPercent}%/yr): Revenue ${formatBillions(baseEnd.revenueB)}, Net Income ${formatBillions(baseEnd.netIncomeB)}. ${targetCompany.projections.base.summary}`,
              `Bull Case (Optimistic, +${targetCompany.projections.bull.revenueCagrPercent}%/yr): Revenue ${formatBillions(bullEnd.revenueB)}, Net Income ${formatBillions(bullEnd.netIncomeB)}. ${targetCompany.projections.bull.summary}`,
            ],
          },
        ],
        dataNotice: SAMPLE_NOTICE,
      };
    }

    return {
      title: 'Bear, Base & Bull 5-Year Projections Explained',
      text: 'How scenario modeling works.',
      sections: [
        {
          heading: 'Thinking in Ranges Instead of Guesses',
          bullets: [
            'Bear Case (Cautious): Models headwinds such as slower customer demand, tougher competition, or tighter profit margins.',
            'Base Case (Middle Ground): Assumes steady execution along current business trends.',
            'Bull Case (Optimistic): Models faster adoption, market share gains, and stronger operating leverage.',
          ],
        },
      ],
      dataNotice: CONCEPT_ONLY_NOTICE,
    };
  }

  // 5. Risks & Challenges for a specific company or general
  if (q.includes('risk') || q.includes('challenge') || q.includes('downside') || q.includes('threat') || q.includes('competition')) {
    if (targetCompany) {
      return {
        title: `${targetCompany.name} (${targetCompany.ticker}) — Key Financial & Business Risks`,
        text: `Key risks for ${targetCompany.name}.`,
        relatedTicker: targetCompany.ticker,
        sections: [
          {
            heading: 'Primary Business Risks',
            bullets: targetCompany.risks,
          },
          {
            heading: 'What Happens in the Bear Scenario',
            body: targetCompany.projections.bear.summary,
            bullets: targetCompany.projections.bear.keyDrivers,
          },
          {
            heading: 'Stock Volatility Context',
            body: `${targetCompany.ticker} has an illustrative Beta of ${targetCompany.illustrativeMarket.beta.toFixed(2)} (a Beta above 1.0 means the stock price tends to swing more sharply than the overall market).`,
          },
        ],
        dataNotice: SAMPLE_NOTICE,
      };
    }

    return {
      title: 'Common Business & Financial Risks Beginners Should Know',
      text: 'Types of business risk.',
      sections: [
        {
          heading: 'Four Common Risk Categories',
          bullets: [
            'Competition Risk: Rivals lowering prices or building better products (e.g., custom AI chips vs. commercial GPUs, or Amazon vs. Walmart).',
            'Cyclicality: Chipmakers experience booms and slowdowns when PC or server buyers pause upgrades.',
            'Margin Pressure: Rising labor, inventory, or server infrastructure costs can shrink Net Income even when sales grow.',
            'Customer Concentration: Relying heavily on a few mega-cap buyers increases sensitivity if those buyers cut spending.',
          ],
        },
      ],
      dataNotice: CONCEPT_ONLY_NOTICE,
    };
  }

  // 6. Specific Company Summary / Financial Performance
  if (targetCompany) {
    return formatCompanyPerformance(targetCompany);
  }

  // 7. Helpful Structured Welcome / Fallback
  return {
    title: 'How I Can Help You Research',
    text: 'Ask about AMD, NVIDIA, Walmart, Microsoft, or financial concepts.',
    sections: [
      {
        heading: 'Topics You Can Explore',
        bullets: [
          'Companies (Illustrative Dashboards): Ask about AMD, NVIDIA (NVDA), Walmart (WMT), or Microsoft (MSFT)—their revenue segments, performance trends, and risks.',
          'Financial Terms: Ask me to explain Revenue, Gross Profit, Net Income, EPS, Operating & Free Cash Flow, Corporate Debt, or P/E Ratio.',
          'Comparisons: Ask how any two companies differ in margins, scale, and business model.',
        ],
      },
    ],
    dataNotice: CONCEPT_ONLY_NOTICE,
  };
}
