
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EmployeeMetrics } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateLiveRisk(metrics: Partial<EmployeeMetrics>): number {
    let riskScore = 0;

    const { 
        adherence_pct = 90, 
        tardiness_count = 0, 
        aux_time_pct = 10, 
        calls_handled = 120, 
        unplanned_absences = 0 
    } = metrics;

    if (adherence_pct < 60) riskScore += 35;
    else if (adherence_pct < 75) riskScore += 20;
    else if (adherence_pct < 85) riskScore += 10;

    if (tardiness_count > 4) riskScore += 25;
    else if (tardiness_count > 2) riskScore += 15;

    if (aux_time_pct > 40) riskScore += 20;
    else if (aux_time_pct > 25) riskScore += 10;
    
    if (calls_handled < 60) riskScore += 15;
    else if (calls_handled < 100) riskScore += 5;

    if (unplanned_absences > 2) riskScore += 25;
    else if (unplanned_absences > 0) riskScore += 10;

    return Math.min(100, Math.max(0, riskScore));
}
