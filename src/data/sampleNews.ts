import { FinancialNewsItem } from '../types/financial';

/**
 * Illustrative Sample News Dataset
 * --------------------------------
 * All entries below are clearly labeled illustrative educational examples.
 * - No fake third-party publisher names are invented (`publisher` states sample status).
 * - No fake publication dates are invented (`publicationDate` states sample period).
 * - No fake URLs are invented (`originalArticleUrl` is `null`).
 *
 * When a legitimate financial news API is connected in `src/services/newsService.ts`,
 * live entries normalize with `isIllustrative: false`, verified `publisher`,
 * `publicationDate`, and `originalArticleUrl`.
 */
export const ILLUSTRATIVE_NEWS: FinancialNewsItem[] = [
  {
    id: 'news-nvda-1',
    ticker: 'NVDA',
    companyName: 'NVIDIA',
    companyInvolved: 'NVIDIA Corporation (NVDA)',
    category: 'Industry Events',
    headline: 'Illustrative Example: Cloud Infrastructure Providers Expand AI Data Center Budgets',
    publisher: 'Illustrative Sample (No External Publisher)',
    publicationDate: 'Illustrative Sample Period',
    originalArticleUrl: null,
    author: 'ClearLedger Educational Research Desk (Sample)',
    articleSummary:
      'In this illustrative scenario, major cloud computing platforms outline multi-year data center upgrades focused on liquid-cooled AI server clusters and high-speed networking.',
    financialImpactAnalysis:
      'Higher cloud infrastructure budgets generally translate into sustained revenue orders for NVIDIA’s Data Center & AI segment (88% of illustrative annual sales) and can support strong Gross Profit and Operating Cash Flow—while customer concentration remains a key risk to monitor.',
    structuredBreakdown: {
      whatHappened:
        'In this illustrative industry update, large cloud computing companies signaled plans to increase annual spending on next-generation AI data center hardware, power cooling, and high-speed server interconnects.',
      whyItHappened:
        'Growing demand for training larger artificial intelligence models and running millions of daily user queries requires denser GPU server racks than older general-purpose CPU servers can support.',
      companyInvolved:
        'NVIDIA Corporation (NVDA) is directly involved as a primary designer of data center GPUs, high-speed networking hardware, and the CUDA software stack.',
      financialImpact:
        'Higher cloud infrastructure budgets generally translate into sustained revenue orders for NVIDIA’s Data Center & AI segment (88% of illustrative annual sales) and can support strong Gross Profit and Operating Cash Flow.',
      risksAndOpportunities:
        'Opportunity: Multi-year server upgrade cycles and high-margin networking attach rates. Risk: Because a handful of giant cloud buyers represent a large portion of sales, any pause in their spending could temporarily slow revenue growth.',
    },
    beginnerTakeaway:
      'When cloud companies increase "capital expenditures" (CapEx), they are buying physical servers and chips upfront. Because NVIDIA supplies specialized data center GPUs, cloud CapEx budgets serve as an important demand signal—while also reminding beginners to watch customer concentration.',
    keyTermExplained: {
      term: 'Capital Expenditure (CapEx)',
      definition:
        'Money a company spends to buy or upgrade long-term physical assets such as data center servers, factories, or retail stores.',
    },
    isIllustrative: true,
    providerId: 'illustrative-sample',
  },
  {
    id: 'news-amd-1',
    ticker: 'AMD',
    companyName: 'AMD',
    companyInvolved: 'Advanced Micro Devices, Inc. (AMD)',
    category: 'Earnings Reports',
    headline: 'Illustrative Example: AMD Data Center Revenue Mix Approaches Half of Annual Sales',
    publisher: 'Illustrative Sample (No External Publisher)',
    publicationDate: 'Illustrative Sample Period',
    originalArticleUrl: null,
    author: 'ClearLedger Educational Research Desk (Sample)',
    articleSummary:
      'In this illustrative sample report, stronger server processor adoption alongside data center accelerator shipments lifted AMD’s Data Center segment to 49% of total revenue.',
    financialImpactAnalysis:
      'Server processors and data center accelerators typically carry higher profit margins than gaming console chips. Shifting sales toward Data Center helps expand illustrative Gross Margin above 52% and strengthens Net Income and Free Cash Flow.',
    structuredBreakdown: {
      whatHappened:
        'In this illustrative earnings summary, AMD reported that its Data Center division grew to represent 49% of overall company sales, overtaking traditional PC and gaming chips as the main growth driver.',
      whyItHappened:
        'Cloud providers and enterprise IT teams adopted EPYC server processors to replace aging servers while beginning deployments of Instinct AI accelerators as a second hardware source.',
      companyInvolved:
        'Advanced Micro Devices, Inc. (AMD), a fabless semiconductor designer competing across cloud servers, PCs, embedded networking, and gaming hardware.',
      financialImpact:
        'Server chips generally carry higher profit margins than gaming console chips. Shifting revenue toward Data Center helped lift illustrative Gross Margin above 52% and boosted Net Income and Free Cash Flow.',
      risksAndOpportunities:
        'Opportunity: Continued server CPU share gains and broader AI accelerator adoption. Risk: Intense competition from rival chipmakers and cyclical slowdowns in consumer PC or gaming demand.',
    },
    beginnerTakeaway:
      '"Revenue mix" matters just as much as total sales. Two companies can earn the exact same revenue, but the one selling higher-margin data center chips instead of lower-margin consumer hardware keeps more profit per dollar.',
    keyTermExplained: {
      term: 'Gross Margin Expansion',
      definition:
        'When a company keeps a higher percentage of each revenue dollar after direct manufacturing costs—often from selling higher-value products.',
    },
    isIllustrative: true,
    providerId: 'illustrative-sample',
  },
  {
    id: 'news-wmt-1',
    ticker: 'WMT',
    companyName: 'Walmart',
    companyInvolved: 'Walmart Inc. (WMT)',
    category: 'Financial Developments',
    headline: 'Illustrative Example: Digital Advertising & Memberships Support Retail Profit Growth',
    publisher: 'Illustrative Sample (No External Publisher)',
    publicationDate: 'Illustrative Sample Period',
    originalArticleUrl: null,
    author: 'ClearLedger Educational Research Desk (Sample)',
    articleSummary:
      'This illustrative update highlights how higher-margin digital advertising and annual membership fees complement Walmart’s high-volume grocery and supercenter revenue.',
    financialImpactAnalysis:
      'Traditional grocery sales carry thin ~3% net margins. Digital advertising and membership fees carry much higher incremental profit margins, helping lift overall Net Income and Operating Cash Flow without proportional new store construction.',
    structuredBreakdown: {
      whatHappened:
        'In this illustrative financial development, Walmart’s digital advertising arm and annual membership renewals grew faster than traditional in-store grocery sales, helping operating profits rise faster than total revenue.',
      whyItHappened:
        'Millions of weekly shoppers visit Walmart stores and Walmart.com for groceries, allowing brands to pay Walmart for sponsored product ads while households subscribe to Walmart+ delivery perks.',
      companyInvolved:
        'Walmart Inc. (WMT), the world’s largest omnichannel retailer across U.S. supercenters, Sam’s Club warehouses, and international markets.',
      financialImpact:
        'Traditional grocery sales carry thin ~3% net margins. Digital advertising and membership fees carry much higher profit margins, gradually lifting overall Net Income and Operating Cash Flow without needing proportional store expansion.',
      risksAndOpportunities:
        'Opportunity: Turning massive retail foot traffic into recurring membership and ad revenue. Risk: Fierce competition from e-commerce and discount grocery rivals, plus labor and merchandise cost inflation.',
    },
    beginnerTakeaway:
      'Grocery stores normally make very small profits on each item sold. By adding digital ads and annual memberships on top of existing customer traffic, Walmart creates higher-margin profit streams alongside steady everyday sales.',
    keyTermExplained: {
      term: 'Operating Leverage',
      definition:
        'When profits grow faster than total revenue because existing infrastructure handles extra high-margin sales without matching extra costs.',
    },
    isIllustrative: true,
    providerId: 'illustrative-sample',
  },
  {
    id: 'news-msft-1',
    ticker: 'MSFT',
    companyName: 'Microsoft',
    companyInvolved: 'Microsoft Corporation (MSFT)',
    category: 'Earnings Reports',
    headline: 'Illustrative Example: Intelligent Cloud Segment Drives Recurring Enterprise Revenue',
    publisher: 'Illustrative Sample (No External Publisher)',
    publicationDate: 'Illustrative Sample Period',
    originalArticleUrl: null,
    author: 'ClearLedger Educational Research Desk (Sample)',
    articleSummary:
      'Illustrative quarterly figures show Microsoft’s Intelligent Cloud division remaining its largest revenue contributor, supported by commercial cloud and database subscriptions.',
    financialImpactAnalysis:
      'Subscription-based software and cloud contracts produce predictable recurring revenue, supporting high ~69% gross margins, consistent EPS growth, and strong Operating Cash Flow.',
    structuredBreakdown: {
      whatHappened:
        'In this illustrative earnings report, Microsoft’s Intelligent Cloud segment (led by Azure) accounted for 43% of annual sales alongside steady growth in Microsoft 365 workplace subscriptions.',
      whyItHappened:
        'Businesses continued moving internal databases, security tools, and AI applications onto cloud servers while renewing multi-year enterprise software contracts.',
      companyInvolved:
        'Microsoft Corporation (MSFT), spanning cloud infrastructure (Azure), productivity software (Microsoft 365 & LinkedIn), and personal computing (Windows & Xbox).',
      financialImpact:
        'Subscription-based software and cloud contracts produce predictable recurring revenue, supporting high ~69% gross margins and strong Operating Cash Flow.',
      risksAndOpportunities:
        'Opportunity: Cross-selling AI productivity add-ons across millions of existing Office 365 seats. Risk: Heavy competition from AWS and Google Cloud, or slower corporate IT spending during economic slowdowns.',
    },
    beginnerTakeaway:
      'Unlike one-time product sales that reset to zero every quarter, software and cloud subscriptions create "recurring revenue"—making year-to-year revenue and cash flow steadier and easier to analyze.',
    keyTermExplained: {
      term: 'Recurring Revenue',
      definition:
        'Predictable income earned regularly from ongoing customer subscriptions or multi-year service contracts rather than one-off purchases.',
    },
    isIllustrative: true,
    providerId: 'illustrative-sample',
  },
  {
    id: 'news-amd-2',
    ticker: 'AMD',
    companyName: 'AMD',
    companyInvolved: 'Advanced Micro Devices, Inc. (AMD)',
    category: 'Company Announcements',
    headline: 'Illustrative Example: Open-Source AI Software Tools Broaden GPU Developer Compatibility',
    publisher: 'Illustrative Sample (No External Publisher)',
    publicationDate: 'Illustrative Sample Period',
    originalArticleUrl: null,
    author: 'ClearLedger Educational Research Desk (Sample)',
    articleSummary:
      'In this illustrative announcement, software ecosystem updates aim to simplify running AI models across AMD’s data center graphics hardware.',
    financialImpactAnalysis:
      'Stronger software compatibility lowers customer switching friction, which can help expand future Data Center GPU orders, revenue diversification, and long-term EPS if enterprise adoption scales.',
    structuredBreakdown: {
      whatHappened:
        'In this illustrative product and strategy announcement, AMD highlighted compatibility updates for its open-source ROCm software stack with major AI frameworks.',
      whyItHappened:
        'Even fast hardware struggles to gain enterprise orders if engineers have to rewrite software code. Making AI software portable reduces friction for cloud buyers.',
      companyInvolved:
        'Advanced Micro Devices, Inc. (AMD), working to expand developer adoption of its Instinct data center GPUs.',
      financialImpact:
        'Stronger software support can accelerate future Data Center GPU orders, supporting long-term revenue growth and EPS expansion if adoption scales.',
      risksAndOpportunities:
        'Opportunity: Lowering switching barriers for cloud customers seeking a second AI chip supplier. Risk: Competing software ecosystems remain deeply entrenched with millions of trained developers.',
    },
    beginnerTakeaway:
      'In technology, hardware speed is only half the story—software convenience creates "switching costs." When software becomes easier to use across brands, customers gain flexibility and competition increases.',
    keyTermExplained: {
      term: 'Switching Costs',
      definition:
        'The time, money, and engineering effort required for a customer to move from one technology platform to a competitor.',
    },
    isIllustrative: true,
    providerId: 'illustrative-sample',
  },
  {
    id: 'news-wmt-2',
    ticker: 'WMT',
    companyName: 'Walmart',
    companyInvolved: 'Walmart Inc. (WMT)',
    category: 'Company Announcements',
    headline: 'Illustrative Example: Automated Distribution Centers Lower Online Order Fulfillment Costs',
    publisher: 'Illustrative Sample (No External Publisher)',
    publicationDate: 'Illustrative Sample Period',
    originalArticleUrl: null,
    author: 'ClearLedger Educational Research Desk (Sample)',
    articleSummary:
      'This illustrative company announcement tracks investments in warehouse automation designed to make grocery pickup and home delivery more cost-efficient.',
    financialImpactAnalysis:
      'Lowering per-order fulfillment costs helps e-commerce scale profitably, protecting Net Income while trades higher near-term CapEx for stronger Free Cash Flow once warehouse upgrades mature.',
    structuredBreakdown: {
      whatHappened:
        'In this illustrative operational update, Walmart outlined progress automating regional distribution centers that sort and pack inventory for both physical stores and online orders.',
      whyItHappened:
        'Picking, packing, and delivering online grocery orders requires significant labor and shipping expense. Automation improves speed and accuracy per order.',
      companyInvolved:
        'Walmart Inc. (WMT), leveraging its 4,600+ U.S. stores and regional warehouses as local e-commerce fulfillment hubs.',
      financialImpact:
        'Lowering cost per delivery helps e-commerce scale profitably, protecting Net Income and gradually improving Free Cash Flow once initial warehouse buildouts stabilize.',
      risksAndOpportunities:
        'Opportunity: Faster delivery times and healthier e-commerce profit margins. Risk: Large upfront capital outlays and technical execution risks across complex supply chains.',
    },
    beginnerTakeaway:
      'Online shopping is convenient for customers, but expensive for retailers to deliver. Investing in automated warehouses trades higher upfront spending today for lower per-order delivery costs in future years.',
    keyTermExplained: {
      term: 'Free Cash Flow (FCF)',
      definition:
        'Cash generated by daily operations minus capital spent on buildings, equipment, and automation.',
    },
    isIllustrative: true,
    providerId: 'illustrative-sample',
  },
  {
    id: 'news-nvda-2',
    ticker: 'NVDA',
    companyName: 'NVIDIA',
    companyInvolved: 'NVIDIA Corporation (NVDA)',
    category: 'Industry Events',
    headline: 'Illustrative Example: Cloud Platforms Pair Commercial GPUs With Custom Internal Chips',
    publisher: 'Illustrative Sample (No External Publisher)',
    publicationDate: 'Illustrative Sample Period',
    originalArticleUrl: null,
    author: 'ClearLedger Educational Research Desk (Sample)',
    articleSummary:
      'This illustrative industry overview explains how large cloud firms test custom chips for routine tasks while relying on general-purpose GPU platforms for flexible AI workloads.',
    financialImpactAnalysis:
      'Custom internal cloud chips could gradually moderate gross margins or capture a share of routine inference workloads over the long term—one reason research models evaluate Bear, Base, and Bull scenarios.',
    structuredBreakdown: {
      whatHappened:
        'In this illustrative industry event summary, semiconductor analysts examined how hyperscale cloud companies deploy custom internal AI chips alongside commercial GPU servers.',
      whyItHappened:
        'Cloud giants spend billions on AI hardware and look to optimize costs on predictable internal workloads while still needing flexible commercial GPUs for cutting-edge models.',
      companyInvolved:
        'NVIDIA Corporation (NVDA), whose data center GPUs serve cloud hyperscalers, enterprises, and AI research labs globally.',
      financialImpact:
        'Custom internal chips could gradually moderate gross margins or share of routine inference workloads over the long term, which is why analysts model Bear, Base, and Bull scenarios.',
      risksAndOpportunities:
        'Opportunity: Expanding into enterprise software, sovereign AI, and robotics computing. Risk: Major cloud customers becoming partial competitors by designing their own internal silicon.',
    },
    beginnerTakeaway:
      'Competition in tech is rarely all-or-nothing. Learning the difference between "AI training" (building a model) and "AI inference" (running it daily) helps beginners understand why both custom chips and general GPUs can coexist.',
    keyTermExplained: {
      term: 'AI Training vs. Inference',
      definition:
        'Training teaches an AI model using massive datasets; inference runs that trained model whenever a user asks a question.',
    },
    isIllustrative: true,
    providerId: 'illustrative-sample',
  },
  {
    id: 'news-msft-2',
    ticker: 'MSFT',
    companyName: 'Microsoft',
    companyInvolved: 'Microsoft Corporation (MSFT)',
    category: 'Financial Developments',
    headline: 'Illustrative Example: Data Center Capital Spending Balanced Against Operating Cash Flow',
    publisher: 'Illustrative Sample (No External Publisher)',
    publicationDate: 'Illustrative Sample Period',
    originalArticleUrl: null,
    author: 'ClearLedger Educational Research Desk (Sample)',
    articleSummary:
      'This illustrative financial note examines how large cloud infrastructure investments increase Capital Expenditures (CapEx) while Operating Cash Flow funds ongoing expansion and dividends.',
    financialImpactAnalysis:
      'Near-term increases in data center CapEx lower Free Cash Flow relative to Operating Cash Flow, and rising equipment depreciation can modestly pressure margins until new capacity fills with paying cloud customers.',
    structuredBreakdown: {
      whatHappened:
        'In this illustrative financial briefing, Microsoft highlighted elevated capital investments in AI data centers funded out of its strong internal Operating Cash Flow.',
      whyItHappened:
        'Demand for cloud computing and AI hosting requires building physical server capacity ahead of customer usage.',
      companyInvolved:
        'Microsoft Corporation (MSFT), balancing heavy cloud infrastructure investment with shareholder dividends and software R&D.',
      financialImpact:
        'In the short term, higher CapEx lowers Free Cash Flow relative to Operating Cash Flow, and higher equipment depreciation can modestly affect accounting margins until new capacity fills with paying customers.',
      risksAndOpportunities:
        'Opportunity: Securing long-term cloud leadership if enterprise AI demand continues growing. Risk: Overbuilding server capacity if enterprise AI adoption takes longer than expected.',
    },
    beginnerTakeaway:
      'When a company builds expensive data centers or factories, its Operating Cash Flow (cash from customers) can look very healthy even while Free Cash Flow pauses—because building long-term assets costs cash upfront.',
    keyTermExplained: {
      term: 'Depreciation & CapEx',
      definition:
        'CapEx is the upfront cash spent on servers and buildings; depreciation spreads that asset cost across the income statement over several years.',
    },
    isIllustrative: true,
    providerId: 'illustrative-sample',
  },
];
