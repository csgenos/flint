import { ProjectionAssumptions } from './finance';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  assumptions: ProjectionAssumptions & {
    oneTimeEvents?: OneTimeEvent[];
  };
  color: string;
}

export interface OneTimeEvent {
  year: number;
  label: string;
  netWorthImpact: number;
  incomeImpact?: number;
  expenseImpact?: number;
}

export interface ScenarioComparison {
  baseScenario: Scenario;
  alternateScenarios: Scenario[];
}
