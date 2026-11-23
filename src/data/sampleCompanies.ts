import { BeginnerTerm, CompanyProfile, StockPricePoint } from '../types/financial';

function generateMonthlySeries(
  startYear: number,
  startMonth: number,
  prices: number[]
): StockPricePoint[] {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return prices.map((price, idx) => {
    const totalMonths = startYear * 12 + (startMonth - 1) + idx;
    const year = Math.floor(totalMonths / 12);
    const month = totalMonths % 12;
    const mm = String(month + 1).padStart(2, '0');
    return {
      date: `${year}-${mm}-01`,
      label: `${monthNames[month]} ${year}`,
      price: Number(price.toFixed(2)),
    };
  });
}

// 60 monthly illustrative price points (Dec 2021 - Nov 2026) for realistic 1M/6M/1Y/3Y/5Y charts
const AMD_PRICES = [
  143.9, 114.2, 123.3, 109.3, 85.5, 101.8, 76.5, 94.5, 84.8, 63.4, 60.1, 77.6,
  64.8, 75.2, 78.6, 98.0, 89.4, 118.2, 113.9, 114.4, 105.7, 102.8, 98.5, 121.2,
  147.4, 167.7, 192.5, 180.5, 158.4, 166.9, 162.2, 144.5, 148.6, 164.1, 144.1, 137.2,
  125.9, 120.8, 114.2, 108.5, 116.4, 128.9, 136.5, 149.2, 154.8, 161.4, 168.0, 174.5,
  169.2, 178.4, 184.1, 176.8, 188.5, 195.2, 191.4, 202.8, 198.6, 208.4, 214.2, 218.5
];

const NVDA_PRICES = [
  29.4, 24.5, 24.4, 27.3, 18.5, 18.7, 15.2, 18.2, 15.1, 12.1, 13.5, 16.9,
  14.6, 19.5, 23.2, 27.8, 27.7, 37.8, 42.3, 46.7, 49.3, 43.5, 40.8, 46.8,
  49.5, 61.5, 79.1, 90.4, 86.4, 109.6, 123.5, 117.0, 119.4, 121.4, 132.8, 138.2,
  134.3, 128.9, 131.5, 124.2, 135.8, 142.4, 148.9, 156.2, 162.4, 159.8, 168.5, 174.2,
  171.5, 179.4, 186.0, 182.3, 192.8, 198.5, 194.2, 205.6, 212.4, 219.8, 224.5, 229.4
];

const WMT_PRICES = [
  48.2, 46.6, 45.1, 49.6, 51.0, 42.9, 40.5, 44.0, 44.2, 43.2, 47.4, 50.8,
  47.2, 47.9, 47.4, 49.1, 50.3, 49.0, 52.4, 53.3, 54.2, 53.3, 54.5, 51.9,
  52.5, 55.1, 58.6, 60.2, 59.3, 65.8, 67.7, 68.6, 77.2, 80.7, 81.9, 92.5,
  90.4, 94.2, 96.8, 91.5, 95.4, 98.2, 101.4, 103.8, 106.2, 108.9, 111.5, 114.2,
  112.8, 115.6, 118.4, 120.1, 122.4, 124.8, 123.5, 126.9, 128.4, 130.2, 131.8, 133.6
];

const MSFT_PRICES = [
  328.4, 304.2, 294.8, 308.1, 274.6, 268.9, 254.3, 276.5, 259.4, 232.9, 231.5, 251.2,
  238.7, 248.4, 249.2, 286.1, 305.4, 326.8, 338.2, 333.9, 325.6, 314.8, 336.4, 376.1,
  374.5, 396.8, 412.2, 419.5, 391.4, 414.2, 445.6, 418.4, 416.2, 428.5, 411.8, 423.4,
  421.2, 414.8, 405.6, 396.2, 418.9, 434.5, 448.2, 459.4, 466.8, 474.2, 481.5, 488.9,
  482.4, 491.8, 498.5, 494.2, 506.4, 514.8, 510.2, 521.6, 528.4, 535.1, 539.8, 544.2
];

export const ILLUSTRATIVE_COMPANIES: CompanyProfile[] = [
  {
    ticker: 'AMD',
    name: 'Advanced Micro Devices, Inc.',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Semiconductors',
    headquarters: 'Santa Clara, California',
    ceo: 'Dr. Lisa Su',
    founded: 1969,
    employees: '~28,000',
    website: 'amd.com',
    plainEnglishSummary:
      'AMD designs computer processors (CPUs) and graphics chips (GPUs) that power cloud data centers, artificial intelligence servers, desktop PCs, laptops, and gaming consoles.',
    businessModelNote:
      'AMD is a "fabless" chip designer—it engineers the chip architecture and hires specialized manufacturing partners (like TSMC) to physically produce the silicon wafers.',
    isIllustrativeData: true,
    illustrativeMarket: {
      price: 218.50,
      changePercent: 1.84,
      marketCapB: 354.2,
      peRatio: 44.6,
      dividendYieldPercent: 0.0,
      week52Low: 112.40,
      week52High: 224.80,
      beta: 1.65,
    },
    segments: [
      {
        name: 'Data Center',
        sharePercent: 49,
        revenueBillions: 16.4,
        description: 'EPYC server CPUs and Instinct AI accelerators sold to cloud providers and enterprises.',
      },
      {
        name: 'Client (PC & Laptop)',
        sharePercent: 27,
        revenueBillions: 9.0,
        description: 'Ryzen desktop and notebook processors for consumer and commercial computers.',
      },
      {
        name: 'Embedded',
        sharePercent: 14,
        revenueBillions: 4.7,
        description: 'Adaptive chips and FPGAs used in networking, automotive, and industrial systems.',
      },
      {
        name: 'Gaming',
        sharePercent: 10,
        revenueBillions: 3.4,
        description: 'Radeon graphics cards and custom chips inside gaming consoles.',
      },
    ],
    strengths: [
      'Strong market share gains in data center server CPUs through its EPYC processor family.',
      'Growing adoption of Instinct AI GPUs as cloud providers seek an alternative supplier.',
      'Diversified portfolio spanning cloud servers, consumer PCs, embedded networking, and gaming.',
    ],
    risks: [
      'Intense competition from NVIDIA in AI accelerators and Intel in traditional PC and server CPUs.',
      'Semiconductor demand is cyclical; PC and gaming downturns can temporarily reduce profit margins.',
      'High reliance on external foundry partners for advanced chip manufacturing capacity.',
    ],
    annualFinancials: [
      { period: 'FY 2021', revenueB: 16.43, grossProfitB: 7.93, netIncomeB: 3.16, eps: 2.57, operatingCashFlowB: 3.52, freeCashFlowB: 3.22 },
      { period: 'FY 2022', revenueB: 23.60, grossProfitB: 10.60, netIncomeB: 1.32, eps: 0.84, operatingCashFlowB: 3.57, freeCashFlowB: 3.12 },
      { period: 'FY 2023', revenueB: 22.68, grossProfitB: 10.46, netIncomeB: 0.85, eps: 0.53, operatingCashFlowB: 1.67, freeCashFlowB: 1.12 },
      { period: 'FY 2024', revenueB: 25.79, grossProfitB: 12.73, netIncomeB: 1.64, eps: 1.00, operatingCashFlowB: 3.04, freeCashFlowB: 2.41 },
      { period: 'FY 2025', revenueB: 33.50, grossProfitB: 17.75, netIncomeB: 4.85, eps: 2.98, operatingCashFlowB: 6.10, freeCashFlowB: 5.25 },
    ],
    quarterlyFinancials: [
      { period: 'Q1 2025', revenueB: 7.44, grossProfitB: 3.74, netIncomeB: 0.88, eps: 0.54, operatingCashFlowB: 1.15, freeCashFlowB: 0.96 },
      { period: 'Q2 2025', revenueB: 7.98, grossProfitB: 4.15, netIncomeB: 1.06, eps: 0.65, operatingCashFlowB: 1.38, freeCashFlowB: 1.18 },
      { period: 'Q3 2025', revenueB: 8.62, grossProfitB: 4.65, netIncomeB: 1.32, eps: 0.81, operatingCashFlowB: 1.62, freeCashFlowB: 1.40 },
      { period: 'Q4 2025', revenueB: 9.46, grossProfitB: 5.21, netIncomeB: 1.59, eps: 0.98, operatingCashFlowB: 1.95, freeCashFlowB: 1.71 },
    ],
    stockHistory5Y: generateMonthlySeries(2021, 12, AMD_PRICES),
    projections: {
      bear: {
        type: 'bear',
        label: 'Bear Case (Cautious)',
        revenueCagrPercent: 9.5,
        targetNetMarginPercent: 13.0,
        summary: 'Assumes slower enterprise AI spending, heavier price competition in data center GPUs, and sluggish PC upgrade cycles.',
        keyDrivers: [
          'AI accelerator market share stabilizes below 10% due to competing ecosystems.',
          'Gross margin pressure from aggressive pricing in Client PC processors.',
          'Higher R&D spending compresses near-term operating profitability.',
        ],
        yearly: [
          { year: '2026E', revenueB: 36.2, netIncomeB: 4.7, operatingCashFlowB: 5.9, eps: 2.88 },
          { year: '2027E', revenueB: 39.8, netIncomeB: 5.1, operatingCashFlowB: 6.4, eps: 3.12 },
          { year: '2028E', revenueB: 43.6, netIncomeB: 5.6, operatingCashFlowB: 7.0, eps: 3.44 },
          { year: '2029E', revenueB: 47.9, netIncomeB: 6.2, operatingCashFlowB: 7.7, eps: 3.82 },
          { year: '2030E', revenueB: 52.7, netIncomeB: 6.8, operatingCashFlowB: 8.5, eps: 4.20 },
        ],
      },
      base: {
        type: 'base',
        label: 'Base Case (Consensus)',
        revenueCagrPercent: 18.0,
        targetNetMarginPercent: 19.5,
        summary: 'Assumes steady Data Center CPU expansion, gradual Instinct AI GPU adoption, and normalized growth in Client and Embedded chips.',
        keyDrivers: [
          'Data Center revenue compounds at ~24% annually on cloud infrastructure upgrades.',
          'Software ecosystem (ROCm) steadily lowers switching barriers for AI developers.',
          'Operating leverage expands net margin toward 19.5% by 2030E.',
        ],
        yearly: [
          { year: '2026E', revenueB: 40.5, netIncomeB: 6.5, operatingCashFlowB: 8.1, eps: 4.00 },
          { year: '2027E', revenueB: 48.2, netIncomeB: 8.4, operatingCashFlowB: 10.4, eps: 5.18 },
          { year: '2028E', revenueB: 56.9, netIncomeB: 10.5, eps: 6.48, operatingCashFlowB: 12.9 },
          { year: '2029E', revenueB: 66.4, netIncomeB: 12.6, operatingCashFlowB: 15.5, eps: 7.78 },
          { year: '2030E', revenueB: 76.7, netIncomeB: 15.0, operatingCashFlowB: 18.4, eps: 9.25 },
        ],
      },
      bull: {
        type: 'bull',
        label: 'Bull Case (Optimistic)',
        revenueCagrPercent: 26.5,
        targetNetMarginPercent: 25.0,
        summary: 'Assumes rapid enterprise adoption of AMD AI racks, major cloud hyperscaler wins, and strong AI-PC replacement demand.',
        keyDrivers: [
          'Next-generation Instinct accelerators capture meaningful second-source AI market share.',
          'Full-stack rack-scale systems command higher average selling prices and margins.',
          'Embedded and AI PC segments rebound simultaneously for broad margin expansion.',
        ],
        yearly: [
          { year: '2026E', revenueB: 44.0, netIncomeB: 7.9, operatingCashFlowB: 9.8, eps: 4.86 },
          { year: '2027E', revenueB: 56.8, netIncomeB: 11.4, operatingCashFlowB: 14.0, eps: 7.02 },
          { year: '2028E', revenueB: 72.1, netIncomeB: 15.9, operatingCashFlowB: 19.4, eps: 9.80 },
          { year: '2029E', revenueB: 90.2, netIncomeB: 21.6, operatingCashFlowB: 26.2, eps: 13.30 },
          { year: '2030E', revenueB: 108.5, netIncomeB: 27.1, operatingCashFlowB: 32.8, eps: 16.70 },
        ],
      },
    },
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Semiconductors & AI Computing',
    headquarters: 'Santa Clara, California',
    ceo: 'Jensen Huang',
    founded: 1993,
    employees: '~36,000',
    website: 'nvidia.com',
    plainEnglishSummary:
      'NVIDIA builds specialized graphics and AI computing chips along with the software platform (CUDA) that powers modern artificial intelligence training, data centers, and 3D graphics.',
    businessModelNote:
      'Rather than selling isolated chips, NVIDIA sells an integrated ecosystem—combining GPUs, high-speed networking hardware, and proprietary software tools that lock in developer workflows.',
    isIllustrativeData: true,
    illustrativeMarket: {
      price: 229.40,
      changePercent: 2.35,
      marketCapB: 5580.0,
      peRatio: 41.2,
      dividendYieldPercent: 0.02,
      week52Low: 118.20,
      week52High: 234.00,
      beta: 1.72,
    },
    segments: [
      {
        name: 'Data Center & AI',
        sharePercent: 88,
        revenueBillions: 167.2,
        description: 'AI training and inference systems, HGX/DGX server platforms, and InfiniBand networking.',
      },
      {
        name: 'Gaming',
        sharePercent: 7,
        revenueBillions: 13.3,
        description: 'GeForce RTX graphics cards for PC gaming and creative creators.',
      },
      {
        name: 'Professional Visualization',
        sharePercent: 3,
        revenueBillions: 5.7,
        description: 'Workstation GPUs and Omniverse 3D simulation software.',
      },
      {
        name: 'Automotive & Robotics',
        sharePercent: 2,
        revenueBillions: 3.8,
        description: 'DRIVE computing platforms for autonomous vehicles and Jetson robotics.',
      },
    ],
    strengths: [
      'Dominant CUDA software ecosystem with millions of developers trained on NVIDIA tools.',
      'Industry-leading gross margins driven by full-rack hardware and networking integration.',
      'Massive free cash flow generation funding rapid annual chip architecture cycles.',
    ],
    risks: [
      'High customer concentration: a large share of revenue comes from a handful of mega-cap cloud buyers.',
      'Cloud giants are designing custom in-house AI chips to reduce long-term reliance on third parties.',
      'Export restrictions and geopolitical rules can limit sales into certain international markets.',
    ],
    annualFinancials: [
      { period: 'FY 2022', revenueB: 26.91, grossProfitB: 17.47, netIncomeB: 9.75, eps: 0.39, operatingCashFlowB: 9.11, freeCashFlowB: 8.13 },
      { period: 'FY 2023', revenueB: 26.97, grossProfitB: 15.36, netIncomeB: 4.37, eps: 0.17, operatingCashFlowB: 5.64, freeCashFlowB: 3.81 },
      { period: 'FY 2024', revenueB: 60.92, grossProfitB: 44.30, netIncomeB: 29.76, eps: 1.19, operatingCashFlowB: 28.09, freeCashFlowB: 27.02 },
      { period: 'FY 2025', revenueB: 130.50, grossProfitB: 97.85, netIncomeB: 72.88, eps: 2.94, operatingCashFlowB: 64.10, freeCashFlowB: 60.85 },
      { period: 'FY 2026', revenueB: 190.00, grossProfitB: 141.55, netIncomeB: 104.50, eps: 4.25, operatingCashFlowB: 96.40, freeCashFlowB: 91.20 },
    ],
    quarterlyFinancials: [
      { period: 'Q1 FY26', revenueB: 42.10, grossProfitB: 31.15, netIncomeB: 22.80, eps: 0.93, operatingCashFlowB: 20.50, freeCashFlowB: 19.30 },
      { period: 'Q2 FY26', revenueB: 45.80, grossProfitB: 34.05, netIncomeB: 25.10, eps: 1.02, operatingCashFlowB: 23.10, freeCashFlowB: 21.85 },
      { period: 'Q3 FY26', revenueB: 49.30, grossProfitB: 36.85, netIncomeB: 27.20, eps: 1.11, operatingCashFlowB: 25.40, freeCashFlowB: 24.05 },
      { period: 'Q4 FY26', revenueB: 52.80, grossProfitB: 39.50, netIncomeB: 29.40, eps: 1.19, operatingCashFlowB: 27.40, freeCashFlowB: 26.00 },
    ],
    stockHistory5Y: generateMonthlySeries(2021, 12, NVDA_PRICES),
    projections: {
      bear: {
        type: 'bear',
        label: 'Bear Case (Cautious)',
        revenueCagrPercent: 7.0,
        targetNetMarginPercent: 42.0,
        summary: 'Assumes hyperscalers pause AI infrastructure expansion to digest capacity while custom in-house silicon takes inference workloads.',
        keyDrivers: [
          'Capital expenditure growth at top cloud buyers moderates sharply after multi-year buildout.',
          'Gross margins normalize from ~74% toward ~63% as competition intensifies.',
          'Sovereign AI and enterprise demand grow slower than expected.',
        ],
        yearly: [
          { year: '2027E', revenueB: 205.0, netIncomeB: 102.5, operatingCashFlowB: 94.5, eps: 4.18 },
          { year: '2028E', revenueB: 218.0, netIncomeB: 100.3, operatingCashFlowB: 93.2, eps: 4.10 },
          { year: '2029E', revenueB: 232.0, netIncomeB: 102.1, operatingCashFlowB: 95.8, eps: 4.18 },
          { year: '2030E', revenueB: 248.0, netIncomeB: 106.6, operatingCashFlowB: 100.4, eps: 4.38 },
          { year: '2031E', revenueB: 266.0, netIncomeB: 111.7, operatingCashFlowB: 105.6, eps: 4.60 },
        ],
      },
      base: {
        type: 'base',
        label: 'Base Case (Consensus)',
        revenueCagrPercent: 16.5,
        targetNetMarginPercent: 51.0,
        summary: 'Assumes steady annual chip architecture transitions, broad enterprise AI adoption, and expanding recurring software licensing revenue.',
        keyDrivers: [
          'Continuous data center upgrades driven by reasoning models and multimodal AI.',
          'Networking (Spectrum-X / NVLink) remains a major revenue attachment driver.',
          'Robotics and industrial simulation begin contributing meaningful scale by 2029E.',
        ],
        yearly: [
          { year: '2027E', revenueB: 232.0, netIncomeB: 125.3, operatingCashFlowB: 115.8, eps: 5.12 },
          { year: '2028E', revenueB: 274.0, netIncomeB: 145.2, operatingCashFlowB: 134.9, eps: 5.95 },
          { year: '2029E', revenueB: 318.0, netIncomeB: 165.4, operatingCashFlowB: 154.2, eps: 6.80 },
          { year: '2030E', revenueB: 365.0, netIncomeB: 186.2, operatingCashFlowB: 174.6, eps: 7.68 },
          { year: '2031E', revenueB: 408.0, netIncomeB: 208.1, operatingCashFlowB: 195.8, eps: 8.60 },
        ],
      },
      bull: {
        type: 'bull',
        label: 'Bull Case (Optimistic)',
        revenueCagrPercent: 24.0,
        targetNetMarginPercent: 56.0,
        summary: 'Assumes global AI factories become core utility infrastructure and physical AI (autonomous fleets and factory robotics) scales rapidly.',
        keyDrivers: [
          'Global sovereign and enterprise AI clusters expand faster than hyperscaler spending.',
          'Software-as-a-service (NVIDIA AI Enterprise) adds high-margin recurring revenue.',
          'Physical AI robotics creates a new multi-tens-of-billions computing market.',
        ],
        yearly: [
          { year: '2027E', revenueB: 252.0, netIncomeB: 141.1, operatingCashFlowB: 130.4, eps: 5.78 },
          { year: '2028E', revenueB: 318.0, netIncomeB: 178.1, operatingCashFlowB: 165.2, eps: 7.32 },
          { year: '2029E', revenueB: 396.0, netIncomeB: 221.8, operatingCashFlowB: 206.8, eps: 9.15 },
          { year: '2030E', revenueB: 482.0, netIncomeB: 269.9, operatingCashFlowB: 252.4, eps: 11.18 },
          { year: '2031E', revenueB: 558.0, netIncomeB: 312.5, operatingCashFlowB: 294.2, eps: 12.95 },
        ],
      },
    },
  },
  {
    ticker: 'WMT',
    name: 'Walmart Inc.',
    exchange: 'NYSE',
    sector: 'Consumer Defensive',
    industry: 'Discount & Omnichannel Retail',
    headquarters: 'Bentonville, Arkansas',
    ceo: 'Doug McMillon',
    founded: 1962,
    employees: '~2,100,000',
    website: 'walmart.com',
    plainEnglishSummary:
      'Walmart is the world’s largest retailer, operating thousands of supercenters, Sam’s Club warehouses, and an expanding e-commerce and digital advertising network.',
    businessModelNote:
      'Walmart thrives on "everyday low prices" and massive purchasing scale—accepting thin retail profit margins in exchange for enormous sales volume, steady grocery demand, and higher-margin membership and ad income.',
    isIllustrativeData: true,
    illustrativeMarket: {
      price: 133.60,
      changePercent: 0.68,
      marketCapB: 1072.0,
      peRatio: 38.4,
      dividendYieldPercent: 0.72,
      week52Low: 89.40,
      week52High: 135.10,
      beta: 0.58,
    },
    segments: [
      {
        name: 'Walmart U.S.',
        sharePercent: 68,
        revenueBillions: 486.2,
        description: 'U.S. Supercenters, Neighborhood Markets, grocery pickup/delivery, and e-commerce.',
      },
      {
        name: 'Walmart International',
        sharePercent: 18,
        revenueBillions: 128.7,
        description: 'Retail operations across Mexico, Canada, China, and Flipkart in India.',
      },
      {
        name: "Sam's Club",
        sharePercent: 14,
        revenueBillions: 100.1,
        description: 'Membership-only warehouse clubs offering bulk groceries, fuel, and general merchandise.',
      },
    ],
    strengths: [
      'Grocery dominance (~60% of U.S. sales) creates resilient, recession-resistant customer traffic.',
      'Fast-growing, high-margin digital advertising (Walmart Connect) and Walmart+ memberships.',
      'Supply chain automation is steadily lowering fulfillment costs for online orders.',
    ],
    risks: [
      'Historically thin retail operating margins (~4%) leave limited room if supply costs spike.',
      'Intense competition from Amazon in e-commerce and Costco/Aldi in value grocery.',
      'Labor wage inflation and inventory shrinkage can pressure store-level profitability.',
    ],
    annualFinancials: [
      { period: 'FY 2022', revenueB: 572.75, grossProfitB: 143.75, netIncomeB: 13.67, eps: 1.63, operatingCashFlowB: 24.18, freeCashFlowB: 11.07 },
      { period: 'FY 2023', revenueB: 611.29, grossProfitB: 147.57, netIncomeB: 11.68, eps: 1.42, operatingCashFlowB: 28.84, freeCashFlowB: 12.02 },
      { period: 'FY 2024', revenueB: 648.13, grossProfitB: 157.98, netIncomeB: 15.51, eps: 1.91, operatingCashFlowB: 35.73, freeCashFlowB: 15.12 },
      { period: 'FY 2025', revenueB: 681.00, grossProfitB: 169.57, netIncomeB: 19.44, eps: 2.41, operatingCashFlowB: 36.40, freeCashFlowB: 14.80 },
      { period: 'FY 2026', revenueB: 715.00, grossProfitB: 180.18, netIncomeB: 22.88, eps: 2.84, operatingCashFlowB: 40.20, freeCashFlowB: 18.10 },
    ],
    quarterlyFinancials: [
      { period: 'Q1 FY26', revenueB: 170.50, grossProfitB: 42.60, netIncomeB: 5.12, eps: 0.64, operatingCashFlowB: 7.40, freeCashFlowB: 2.30 },
      { period: 'Q2 FY26', revenueB: 176.80, grossProfitB: 44.55, netIncomeB: 5.58, eps: 0.69, operatingCashFlowB: 9.80, freeCashFlowB: 4.50 },
      { period: 'Q3 FY26', revenueB: 178.20, grossProfitB: 45.10, netIncomeB: 5.74, eps: 0.71, operatingCashFlowB: 10.20, freeCashFlowB: 4.80 },
      { period: 'Q4 FY26', revenueB: 189.50, grossProfitB: 47.93, netIncomeB: 6.44, eps: 0.80, operatingCashFlowB: 12.80, freeCashFlowB: 6.50 },
    ],
    stockHistory5Y: generateMonthlySeries(2021, 12, WMT_PRICES),
    projections: {
      bear: {
        type: 'bear',
        label: 'Bear Case (Cautious)',
        revenueCagrPercent: 3.0,
        targetNetMarginPercent: 2.9,
        summary: 'Assumes consumer spending tightens toward lower-margin essentials while wage and fulfillment costs offset digital ad gains.',
        keyDrivers: [
          'Slower discretionary spending in electronics, apparel, and home goods.',
          'Price competition forces deeper grocery rollbacks to defend traffic.',
          'International currency fluctuations weigh on reported dollar growth.',
        ],
        yearly: [
          { year: '2027E', revenueB: 736.5, netIncomeB: 22.1, operatingCashFlowB: 39.2, eps: 2.75 },
          { year: '2028E', revenueB: 758.5, netIncomeB: 22.4, operatingCashFlowB: 40.0, eps: 2.80 },
          { year: '2029E', revenueB: 781.3, netIncomeB: 22.9, operatingCashFlowB: 41.1, eps: 2.87 },
          { year: '2030E', revenueB: 804.7, netIncomeB: 23.5, operatingCashFlowB: 42.3, eps: 2.95 },
          { year: '2031E', revenueB: 828.9, netIncomeB: 24.0, operatingCashFlowB: 43.5, eps: 3.02 },
        ],
      },
      base: {
        type: 'base',
        label: 'Base Case (Consensus)',
        revenueCagrPercent: 5.0,
        targetNetMarginPercent: 3.8,
        summary: 'Assumes steady 4–5% retail sales growth paired with faster profit growth from advertising, memberships, and automated warehouses.',
        keyDrivers: [
          'Higher-income households continue adopting Walmart grocery delivery.',
          'Walmart Connect digital advertising scales at >20% annual growth.',
          'Supply chain automation lifts operating income faster than top-line revenue.',
        ],
        yearly: [
          { year: '2027E', revenueB: 751.0, netIncomeB: 25.2, operatingCashFlowB: 43.8, eps: 3.14 },
          { year: '2028E', revenueB: 788.5, netIncomeB: 27.6, operatingCashFlowB: 47.4, eps: 3.45 },
          { year: '2029E', revenueB: 828.0, netIncomeB: 30.2, operatingCashFlowB: 51.2, eps: 3.79 },
          { year: '2030E', revenueB: 869.4, netIncomeB: 32.8, operatingCashFlowB: 55.1, eps: 4.13 },
          { year: '2031E', revenueB: 912.9, netIncomeB: 34.7, operatingCashFlowB: 58.6, eps: 4.38 },
        ],
      },
      bull: {
        type: 'bull',
        label: 'Bull Case (Optimistic)',
        revenueCagrPercent: 6.8,
        targetNetMarginPercent: 4.5,
        summary: 'Assumes e-commerce turns meaningfully profitable ahead of schedule while Walmart+ and third-party marketplace fees transform the margin profile.',
        keyDrivers: [
          'Marketplace, advertising, and membership fees represent over 30% of operating profit.',
          'International growth in India (Flipkart) and Mexico accelerates.',
          'Automated micro-fulfillment centers slash last-mile delivery costs.',
        ],
        yearly: [
          { year: '2027E', revenueB: 764.0, netIncomeB: 27.5, operatingCashFlowB: 47.2, eps: 3.43 },
          { year: '2028E', revenueB: 816.0, netIncomeB: 31.8, operatingCashFlowB: 53.5, eps: 3.98 },
          { year: '2029E', revenueB: 871.5, netIncomeB: 36.6, operatingCashFlowB: 60.4, eps: 4.60 },
          { year: '2030E', revenueB: 930.8, netIncomeB: 41.0, operatingCashFlowB: 66.9, eps: 5.18 },
          { year: '2031E', revenueB: 994.0, netIncomeB: 44.7, operatingCashFlowB: 72.8, eps: 5.66 },
        ],
      },
    },
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Cloud Infrastructure & Enterprise Software',
    headquarters: 'Redmond, Washington',
    ceo: 'Satya Nadella',
    founded: 1975,
    employees: '~228,000',
    website: 'microsoft.com',
    plainEnglishSummary:
      'Microsoft builds cloud computing platforms (Azure), workplace productivity software (Microsoft 365), operating systems (Windows), and enterprise AI tools used by businesses worldwide.',
    businessModelNote:
      'Microsoft operates primarily on recurring software subscriptions and cloud usage fees—giving it predictable annual revenue, high gross margins, and strong free cash flow that funds AI data centers and dividends.',
    isIllustrativeData: true,
    illustrativeMarket: {
      price: 544.20,
      changePercent: 1.12,
      marketCapB: 4045.0,
      peRatio: 35.8,
      dividendYieldPercent: 0.68,
      week52Low: 392.50,
      week52High: 549.00,
      beta: 0.92,
    },
    segments: [
      {
        name: 'Intelligent Cloud (Azure)',
        sharePercent: 43,
        revenueBillions: 129.9,
        description: 'Azure cloud servers, AI hosting infrastructure, SQL Server, and enterprise cloud services.',
      },
      {
        name: 'Productivity & Business Processes',
        sharePercent: 34,
        revenueBillions: 102.7,
        description: 'Microsoft 365 subscriptions, Teams, Copilot AI add-ons, LinkedIn, and Dynamics 365.',
      },
      {
        name: 'More Personal Computing',
        sharePercent: 23,
        revenueBillions: 69.4,
        description: 'Windows operating system licensing, Xbox gaming & Game Pass, Surface devices, and Bing search ads.',
      },
    ],
    strengths: [
      'Deeply embedded enterprise software (Office 365 & Windows) creates high customer switching costs.',
      'Azure cloud platform benefits directly as companies adopt cloud computing and AI tools.',
      'Diversified mix of recurring subscriptions, cloud infrastructure, LinkedIn, and gaming.',
    ],
    risks: [
      'Heavy capital expenditure required to build AI data centers can weigh on near-term free cash flow.',
      'Intense cloud infrastructure competition from Amazon Web Services (AWS) and Google Cloud.',
      'Enterprise customers may adopt paid AI add-ons more slowly if budgets tighten.',
    ],
    annualFinancials: [
      { period: 'FY 2022', revenueB: 198.27, grossProfitB: 135.62, netIncomeB: 72.74, eps: 9.65, operatingCashFlowB: 89.04, freeCashFlowB: 65.15 },
      { period: 'FY 2023', revenueB: 211.92, grossProfitB: 146.05, netIncomeB: 72.36, eps: 9.68, operatingCashFlowB: 87.58, freeCashFlowB: 59.48 },
      { period: 'FY 2024', revenueB: 245.12, grossProfitB: 171.01, netIncomeB: 88.14, eps: 11.80, operatingCashFlowB: 118.55, freeCashFlowB: 74.07 },
      { period: 'FY 2025', revenueB: 274.50, grossProfitB: 190.20, netIncomeB: 100.20, eps: 13.45, operatingCashFlowB: 133.40, freeCashFlowB: 78.60 },
      { period: 'FY 2026', revenueB: 302.00, grossProfitB: 208.38, netIncomeB: 113.25, eps: 15.20, operatingCashFlowB: 148.80, freeCashFlowB: 87.40 },
    ],
    quarterlyFinancials: [
      { period: 'Q1 FY26', revenueB: 71.80, grossProfitB: 49.60, netIncomeB: 26.40, eps: 3.54, operatingCashFlowB: 34.90, freeCashFlowB: 20.10 },
      { period: 'Q2 FY26', revenueB: 74.60, grossProfitB: 51.45, netIncomeB: 27.95, eps: 3.75, operatingCashFlowB: 36.40, freeCashFlowB: 21.30 },
      { period: 'Q3 FY26', revenueB: 76.40, grossProfitB: 52.75, netIncomeB: 28.80, eps: 3.87, operatingCashFlowB: 37.80, freeCashFlowB: 22.40 },
      { period: 'Q4 FY26', revenueB: 79.20, grossProfitB: 54.58, netIncomeB: 30.10, eps: 4.04, operatingCashFlowB: 39.70, freeCashFlowB: 23.60 },
    ],
    stockHistory5Y: generateMonthlySeries(2021, 12, MSFT_PRICES),
    projections: {
      bear: {
        type: 'bear',
        label: 'Bear Case (Cautious)',
        revenueCagrPercent: 7.5,
        targetNetMarginPercent: 32.5,
        summary: 'Assumes slower enterprise cloud optimization, muted Copilot seat upgrades, and higher data center depreciation expenses.',
        keyDrivers: [
          'Azure cloud growth moderates as enterprise IT budgets tighten.',
          'Heavy AI server depreciation weighs slightly on operating margins.',
          'PC and gaming hardware demand stays flat.',
        ],
        yearly: [
          { year: '2027E', revenueB: 324.5, netIncomeB: 116.8, operatingCashFlowB: 152.5, eps: 15.70 },
          { year: '2028E', revenueB: 349.0, netIncomeB: 121.5, operatingCashFlowB: 160.2, eps: 16.38 },
          { year: '2029E', revenueB: 375.2, netIncomeB: 126.8, operatingCashFlowB: 168.4, eps: 17.15 },
          { year: '2030E', revenueB: 403.3, netIncomeB: 132.7, operatingCashFlowB: 177.8, eps: 18.02 },
          { year: '2031E', revenueB: 433.6, netIncomeB: 140.9, operatingCashFlowB: 188.6, eps: 19.18 },
        ],
      },
      base: {
        type: 'base',
        label: 'Base Case (Consensus)',
        revenueCagrPercent: 12.2,
        targetNetMarginPercent: 37.5,
        summary: 'Assumes steady double-digit Azure cloud expansion, gradual Microsoft 365 Copilot adoption, and disciplined operating costs.',
        keyDrivers: [
          'Azure remains a top enterprise cloud platform with ~22% annual growth.',
          'Productivity software subscriptions deliver stable pricing power.',
          'Capital spending normalizes relative to revenue, boosting free cash flow.',
        ],
        yearly: [
          { year: '2027E', revenueB: 339.8, netIncomeB: 127.4, operatingCashFlowB: 167.2, eps: 17.18 },
          { year: '2028E', revenueB: 382.3, netIncomeB: 143.4, operatingCashFlowB: 188.6, eps: 19.40 },
          { year: '2029E', revenueB: 429.0, netIncomeB: 160.9, operatingCashFlowB: 211.8, eps: 21.85 },
          { year: '2030E', revenueB: 480.5, netIncomeB: 180.2, operatingCashFlowB: 237.4, eps: 24.55 },
          { year: '2031E', revenueB: 536.8, netIncomeB: 201.3, operatingCashFlowB: 265.2, eps: 27.50 },
        ],
      },
      bull: {
        type: 'bull',
        label: 'Bull Case (Optimistic)',
        revenueCagrPercent: 16.5,
        targetNetMarginPercent: 40.5,
        summary: 'Assumes widespread enterprise AI agent adoption across Microsoft 365 and rapid market share gains for Azure AI services.',
        keyDrivers: [
          'Copilot and AI workflow tools become standard across commercial Office seats.',
          'Azure cloud capacity expansion translates into accelerating enterprise migration.',
          'Software-driven operating leverage expands net profit margin above 40%.',
        ],
        yearly: [
          { year: '2027E', revenueB: 353.0, netIncomeB: 137.7, operatingCashFlowB: 180.4, eps: 18.58 },
          { year: '2028E', revenueB: 412.5, netIncomeB: 162.9, operatingCashFlowB: 213.8, eps: 22.05 },
          { year: '2029E', revenueB: 481.0, netIncomeB: 192.4, operatingCashFlowB: 252.5, eps: 26.15 },
          { year: '2030E', revenueB: 559.5, netIncomeB: 226.6, operatingCashFlowB: 296.8, eps: 30.90 },
          { year: '2031E', revenueB: 648.0, netIncomeB: 262.4, operatingCashFlowB: 344.2, eps: 35.85 },
        ],
      },
    },
  },
];

export const BEGINNER_GLOSSARY: BeginnerTerm[] = [
  {
    key: 'revenue',
    term: 'Revenue (Top Line)',
    shortDefinition: 'Total money a company brings in from selling products or services before subtracting any expenses.',
    plainExample: 'If a coffee shop sells 1,000 lattes at $5 each, its revenue is $5,000—even before paying for beans or rent.',
    whyItMatters: 'Shows customer demand and overall business scale, though high revenue alone does not guarantee profit.',
  },
  {
    key: 'grossProfit',
    term: 'Gross Profit & Margin',
    shortDefinition: 'Revenue minus the direct cost of making the product or delivering the service (Cost of Goods Sold).',
    plainExample: 'Software and chip designers often keep 50–75% as gross profit, while grocery retailers keep ~25% because food inventory costs more.',
    whyItMatters: 'Measures pricing power and manufacturing efficiency before corporate overhead and R&D.',
  },
  {
    key: 'netIncome',
    term: 'Net Income (Bottom Line)',
    shortDefinition: 'The actual profit left over after paying all operating expenses, research, interest, and taxes.',
    plainExample: 'Out of $100 in sales, Walmart keeps around $3 in net income, while NVIDIA keeps over $50—different business models!',
    whyItMatters: 'Ultimately funds dividends, share buybacks, debt reduction, and reinvestment.',
  },
  {
    key: 'eps',
    term: 'Earnings Per Share (EPS)',
    shortDefinition: 'A company’s total net income divided by the number of shares owned by investors.',
    plainExample: 'If a company earns $100M and has 50M shares, its EPS is $2.00 per share.',
    whyItMatters: 'Lets beginners compare profitability on a single-share basis and calculate the P/E valuation ratio.',
  },
  {
    key: 'freeCashFlow',
    term: 'Free Cash Flow (FCF)',
    shortDefinition: 'Cash generated by daily operations minus capital spent on buildings, equipment, and servers.',
    plainExample: 'Think of it as true spare cash left in the bank after maintaining and upgrading the business.',
    whyItMatters: 'Accounting profits can include non-cash items, whereas cash flow shows real financial flexibility.',
  },
  {
    key: 'peRatio',
    term: 'P/E Ratio (Price-to-Earnings)',
    shortDefinition: 'Stock price divided by annual EPS—showing how many dollars investors pay for $1 of current profit.',
    plainExample: 'A $100 stock with $5 EPS has a P/E of 20x. Higher P/E usually means investors expect faster future growth.',
    whyItMatters: 'Helps compare whether a stock is priced optimistically or cautiously relative to its earnings.',
  },
];
