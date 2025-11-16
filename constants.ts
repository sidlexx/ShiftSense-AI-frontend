import { LayoutDashboard, Users, History, Upload, Settings as SettingsIcon } from 'lucide-react';
import { RiskLevel } from './types';

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analysis', label: 'Employee Analysis', icon: Users },
  { href: '/predictions', label: 'Predictions', icon: History },
  { href: '/batch', label: 'Batch Processing', icon: Upload },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

export const RISK_LEVEL_CLASSES: { [key in RiskLevel]: { container: string; text: string; hex: string; } } = {
  [RiskLevel.Critical]: { container: 'bg-critical/10 dark:bg-critical/20', text: 'text-critical', hex: '#ef4444' },
  [RiskLevel.Warning]: { container: 'bg-warning/10 dark:bg-warning/20', text: 'text-warning', hex: '#f97316' },
  [RiskLevel.Monitor]: { container: 'bg-monitor/10 dark:bg-monitor/20', text: 'text-monitor', hex: '#3b82f6' },
  [RiskLevel.Good]: { container: 'bg-good/10 dark:bg-good/20', text: 'text-good', hex: '#22c55e' },
};

export const N8N_WEBHOOK_URL_KEY = 'n8nWebhookUrl';
export const MOCK_N8N_WEBHOOK_URL = 'https://mock.n8n.io/webhook/shiftsense-intake';