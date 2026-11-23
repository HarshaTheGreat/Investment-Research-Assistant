import { CompanyProfile, ProjectionScenario, ProjectionScenarioType, TickerSymbol } from '../types/financial';
import { getCompanyByTicker } from './financialDataService';

/**
 * Five-Year Financial Projection Service
 * --------------------------------------
 * Currently returns structured illustrative sample scenario assumptions (Bear / Base / Bull)
 * without generating stock price predictions or personalized investment advice.
 *
 * Future Forecasting Model Integration:
 * Replace `getCompanyProjectionModel` with a dynamic driver-based financial model
 * (e.g., segment revenue growth rates, margin curves, working capital & CapEx schedules,
 * or server-side econometric forecasting endpoints) while keeping the same return contract.
 */

export interface ProjectionModelBundle {
  company: CompanyProfile;
  scenarios: Record<ProjectionScenarioType, ProjectionScenario>;
  methodologyNote: string;
  isIllustrativeEstimate: true;
}

export interface ScenarioAssumptionGuide {
  type: ProjectionScenarioType;
  beginnerTitle: string;
  plainExplanation: string;
  whatChanges: string[];
}

export function getCompanyProjectionModel(ticker: TickerSymbol): ProjectionModelBundle | undefined {
  const company = getCompanyByTicker(ticker);
  if (!company) return undefined;

  return {
    company,
    scenarios: company.projections,
    methodologyNote:
      'These 5-year estimates model Revenue, Net Income, and Operating Cash Flow using illustrative growth and margin assumptions. They do not predict stock prices or guarantee actual future results.',
    isIllustrativeEstimate: true,
  };
}

export function getScenarioAssumptionsGuide(scenario: ProjectionScenario): ScenarioAssumptionGuide {
  const map: Record<ProjectionScenarioType, { title: string; explanation: string }> = {
    bear: {
      title: 'What the Bear Case Assumes',
      explanation:
        'The Bear Case tests how the business might perform if major headwinds hit—such as slower customer demand, tougher competition, or rising costs squeezing profit margins.',
    },
    base: {
      title: 'What the Base Case Assumes',
      explanation:
        'The Base Case models a middle-ground path where the company executes steadily along recent historical trends without extreme surprises.',
    },
    bull: {
      title: 'What the Bull Case Assumes',
      explanation:
        'The Bull Case explores what happens if everything goes right—faster product adoption, stronger pricing power, and higher operating efficiency.',
    },
  };

  return {
    type: scenario.type,
    beginnerTitle: map[scenario.type].title,
    plainExplanation: map[scenario.type].explanation,
    whatChanges: [
      `Annual Revenue Growth (CAGR): +${scenario.revenueCagrPercent.toFixed(1)}% per year on average.`,
      `Target Net Profit Margin: ~${scenario.targetNetMarginPercent.toFixed(1)}% by Year 5.`,
      ...scenario.keyDrivers,
    ],
  };
}
