import { EmployeeMetrics, Prediction, Alert, RiskLevel, RiskDistribution, DashboardData } from '../types';
// FIX: The function 'sub' is not an exported member of 'date-fns'. Replaced with 'subDays'.
import { format, subDays } from 'date-fns';
import { N8N_WEBHOOK_URL_KEY, MOCK_N8N_WEBHOOK_URL } from '../constants';

// --- Mock Data Generation ---

// FIX: Removed invalid 'timestamp' property from mock data objects to match the EmployeeMetrics interface.
const baseMockData: EmployeeMetrics[] = [
    { employee_id: "EMP201", employee_name: "Jessica Torres", shift_date: "2024-11-16", adherence_pct: 42, tardiness_count: 6, aux_time_pct: 58, calls_handled: 38, unplanned_absences: 3 },
    { employee_id: "EMP202", employee_name: "Kevin Brown", shift_date: "2024-11-16", adherence_pct: 35, tardiness_count: 8, aux_time_pct: 70, calls_handled: 25, unplanned_absences: 4 },
    { employee_id: "EMP203", employee_name: "Linda Chen", shift_date: "2024-11-16", adherence_pct: 48, tardiness_count: 5, aux_time_pct: 52, calls_handled: 55, unplanned_absences: 2 },
    { employee_id: "EMP204", employee_name: "Robert Kim", shift_date: "2024-11-16", adherence_pct: 31, tardiness_count: 9, aux_time_pct: 65, calls_handled: 18, unplanned_absences: 5 },
    { employee_id: "EMP205", employee_name: "Amanda Lee", shift_date: "2024-11-16", adherence_pct: 52, tardiness_count: 7, aux_time_pct: 48, calls_handled: 62, unplanned_absences: 3 },
    { employee_id: "EMP206", employee_name: "Michael Santos", shift_date: "2024-11-16", adherence_pct: 94, tardiness_count: 0, aux_time_pct: 14, calls_handled: 158, unplanned_absences: 0 },
    { employee_id: "EMP207", employee_name: "Emma Wilson", shift_date: "2024-11-16", adherence_pct: 91, tardiness_count: 1, aux_time_pct: 16, calls_handled: 145, unplanned_absences: 0 },
    { employee_id: "EMP208", employee_name: "James Park", shift_date: "2024-11-16", adherence_pct: 96, tardiness_count: 0, aux_time_pct: 11, calls_handled: 162, unplanned_absences: 0 },
    { employee_id: "EMP209", employee_name: "Sofia Garcia", shift_date: "2024-11-16", adherence_pct: 89, tardiness_count: 1, aux_time_pct: 18, calls_handled: 138, unplanned_absences: 0 },
    { employee_id: "EMP210", employee_name: "Daniel Cooper", shift_date: "2024-11-16", adherence_pct: 93, tardiness_count: 0, aux_time_pct: 15, calls_handled: 151, unplanned_absences: 0 },
];

const generateMockPredictions = (baseData: EmployeeMetrics[]): Prediction[] => {
  const predictions: Prediction[] = baseData.map((metrics, i) => {
    let riskScore = 0;
    if (metrics.adherence_pct < 60) riskScore += 35; else if (metrics.adherence_pct < 85) riskScore += 10;
    if (metrics.tardiness_count > 4) riskScore += 25; else if (metrics.tardiness_count > 2) riskScore += 15;
    if (metrics.aux_time_pct > 40) riskScore += 20;
    if (metrics.unplanned_absences > 2) riskScore += 25; else if (metrics.unplanned_absences > 0) riskScore += 10;
    riskScore = Math.min(100, riskScore + Math.floor(Math.random() * 5));

    let riskLevel: RiskLevel;
    if (riskScore >= 70) riskLevel = RiskLevel.Critical;
    else if (riskScore >= 40) riskLevel = RiskLevel.Warning;
    else if (riskScore >= 20) riskLevel = RiskLevel.Monitor;
    else riskLevel = RiskLevel.Good;

    return {
      ...metrics,
      // FIX: Replaced 'sub' with 'subDays' to resolve module export error.
      analysis_timestamp: subDays(new Date(), i).toISOString(),
      calculated_risk_score: riskScore,
      calculated_risk_level: riskLevel,
      risk_factors: 'Low adherence, high tardiness',
      needs_shift_coverage: riskLevel === RiskLevel.Critical,
      ai_prediction: 'Employee shows signs of burnout and may be a flight risk.',
      ai_recommendation: 'Schedule a 1-on-1 meeting to discuss workload and well-being.',
      ot_strategy: 'Offer OT to high-performing peers to cover potential gaps.',
      aux_strategy: 'Review AUX codes for coaching opportunities.',
    };
  });
  
  // Add more generic data
  const names = ['John Doe', 'Jane Smith', 'Peter Jones', 'Mary Williams', 'David Brown', 'Susan Miller', 'Michael Wilson'];
  for (let i = 0; i < 40; i++) {
     const riskScore = Math.floor(Math.random() * 100);
     let riskLevel: RiskLevel;
     if (riskScore >= 70) riskLevel = RiskLevel.Critical;
     else if (riskScore >= 40) riskLevel = RiskLevel.Warning;
     else if (riskScore >= 20) riskLevel = RiskLevel.Monitor;
     else riskLevel = RiskLevel.Good;
     predictions.push({
      employee_id: `E${1000 + i}`,
      employee_name: names[i % names.length],
      // FIX: Replaced 'sub' with 'subDays' to resolve module export error.
      shift_date: format(subDays(new Date(), i + 10), 'yyyy-MM-dd'),
      adherence_pct: Math.floor(Math.random() * 50) + 50,
      tardiness_count: Math.floor(Math.random() * 5),
      aux_time_pct: Math.floor(Math.random() * 30),
      calls_handled: Math.floor(Math.random() * 100) + 50,
      unplanned_absences: Math.floor(Math.random() * 3),
      // FIX: Replaced 'sub' with 'subDays' to resolve module export error.
      analysis_timestamp: subDays(new Date(), i + 10).toISOString(),
      calculated_risk_score: riskScore,
      calculated_risk_level: riskLevel,
      risk_factors: 'Low adherence, high tardiness',
      needs_shift_coverage: riskLevel === RiskLevel.Critical,
      ai_prediction: 'Employee shows signs of burnout and may be a flight risk.',
      ai_recommendation: 'Schedule a 1-on-1 meeting to discuss workload and well-being.',
      ot_strategy: 'Offer OT to high-performing peers to cover potential gaps.',
      aux_strategy: 'Review AUX codes for coaching opportunities.',
    });
  }

  return predictions.sort((a,b) => new Date(b.analysis_timestamp).getTime() - new Date(a.analysis_timestamp).getTime());
};

let mockPredictions = generateMockPredictions(baseMockData as EmployeeMetrics[]);

// --- Mock API Service ---

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getDashboardData = async (): Promise<DashboardData> => {
  await wait(500);
  const criticalCount = mockPredictions.filter(p => p.calculated_risk_level === RiskLevel.Critical).length;
  const warningCount = mockPredictions.filter(p => p.calculated_risk_level === RiskLevel.Warning).length;
  const riskDistribution: RiskDistribution = [
    { name: RiskLevel.Critical, value: criticalCount },
    { name: RiskLevel.Warning, value: warningCount },
    { name: RiskLevel.Monitor, value: mockPredictions.filter(p => p.calculated_risk_level === RiskLevel.Monitor).length },
    { name: RiskLevel.Good, value: mockPredictions.filter(p => p.calculated_risk_level === RiskLevel.Good).length },
  ];

  const recentAlerts: Alert[] = mockPredictions
    .filter(p => p.calculated_risk_level === RiskLevel.Critical)
    .slice(0, 10)
    .map(p => ({
      alert_timestamp: p.analysis_timestamp,
      employee_id: p.employee_id,
      employee_name: p.employee_name,
      risk_level: p.calculated_risk_level,
      risk_score: p.calculated_risk_score,
      recommended_action: p.ai_recommendation,
      action_status: Math.random() > 0.5 ? 'Pending' : 'Complete',
    }));
    
  const highRiskEmployees = mockPredictions
    .filter(p => p.calculated_risk_level === RiskLevel.Critical || p.calculated_risk_level === RiskLevel.Warning)
    .sort((a,b) => b.calculated_risk_score - a.calculated_risk_score)
    .slice(0, 10);

  return {
    totalEmployees: 120,
    criticalRiskCount: criticalCount,
    warningCount: warningCount,
    teamHealthStatus: criticalCount > 5 ? 'At Risk' : 'Good',
    avgTeamAdherence: 88,
    riskDistribution,
    recentAlerts,
    highRiskEmployees,
  };
};

export const getAllPredictions = async (): Promise<Prediction[]> => {
  await wait(800);
  return mockPredictions;
};

export const analyzeEmployee = async (employeeData: EmployeeMetrics): Promise<Prediction> => {
  const webhookUrl = localStorage.getItem(N8N_WEBHOOK_URL_KEY) || MOCK_N8N_WEBHOOK_URL;

  console.log(`Submitting to webhook: ${webhookUrl}`, employeeData);
  await wait(1500); 

  const riskScore = Math.floor(Math.random() * 100);
  let riskLevel: RiskLevel;
  if (riskScore >= 70) riskLevel = RiskLevel.Critical;
  else if (riskScore >= 40) riskLevel = RiskLevel.Warning;
  else if (riskScore >= 20) riskLevel = RiskLevel.Monitor;
  else riskLevel = RiskLevel.Good;

  return {
    ...employeeData,
    analysis_timestamp: new Date().toISOString(),
    calculated_risk_score: riskScore,
    calculated_risk_level: riskLevel,
    risk_factors: 'AI-generated risk factors based on input.',
    needs_shift_coverage: riskLevel === RiskLevel.Critical,
    ai_prediction: `Based on the provided metrics, ${employeeData.employee_name} is showing a performance trend that requires attention.`,
    ai_recommendation: 'Immediate follow-up is recommended to address the key performance indicators.',
    ot_strategy: 'Consider pre-booking overtime with top performers as a contingency.',
    aux_strategy: 'Analyze AUX usage patterns for potential system issues or coaching needs.',
  };
};

export const savePrediction = async (prediction: Prediction): Promise<{ success: boolean }> => {
    await wait(500);
    console.log("Saving prediction to mock database:", prediction);
    const index = mockPredictions.findIndex(p => p.employee_id === prediction.employee_id && p.shift_date === prediction.shift_date);
    if (index > -1) {
        mockPredictions[index] = prediction;
    } else {
        mockPredictions.unshift(prediction);
    }
    return { success: true };
}