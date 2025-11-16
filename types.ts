
export enum RiskLevel {
  Critical = 'Critical',
  Warning = 'Warning',
  Monitor = 'Monitor',
  Good = 'Good',
}

export interface EmployeeMetrics {
  employee_id: string;
  employee_name: string;
  shift_date: string;
  adherence_pct: number;
  tardiness_count: number;
  aux_time_pct: number;
  calls_handled: number;
  unplanned_absences: number;
}

export interface Prediction extends EmployeeMetrics {
  analysis_timestamp: string;
  calculated_risk_score: number;
  calculated_risk_level: RiskLevel;
  risk_factors: string;
  needs_shift_coverage: boolean;
  ai_prediction: string;
  ai_recommendation: string;
  ot_strategy: string;
  aux_strategy: string;
}

export interface Alert {
  alert_timestamp: string;
  employee_id: string;
  employee_name: string;
  risk_level: RiskLevel;
  risk_score: number;
  recommended_action: string;
  action_status: 'Pending' | 'Complete' | 'Dismissed';
}

export type RiskDistribution = {
  name: RiskLevel;
  value: number;
}[];

export interface DashboardData {
    totalEmployees: number;
    criticalRiskCount: number;
    warningCount: number;
    teamHealthStatus: string;
    avgTeamAdherence: number;
    riskDistribution: RiskDistribution;
    recentAlerts: Alert[];
    highRiskEmployees: Prediction[];
}
