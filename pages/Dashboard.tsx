import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { getDashboardData } from '../services/api';
import Skeleton from '../components/ui/Skeleton';
import { AlertTriangle, TrendingUp, Users, ShieldCheck, Download, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Prediction, Alert as AlertType, RiskLevel, DashboardData } from '../types';
import { RISK_LEVEL_CLASSES } from '../constants';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import HighRiskCarousel from '../components/dashboard/HighRiskCarousel';

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRunAnalysis = async () => {
        setIsRefreshing(true);
        await new Promise(res => setTimeout(res, 1500));
        await fetchData();
        toast.success('Workforce data refreshed!');
        setIsRefreshing(false);
    };
    
    const handleExport = () => {
        toast.success('Report is generating and will download shortly.');
    }

    const pieChartData = useMemo(() => data?.riskDistribution || [], [data]);

    return (
        <div className="space-y-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, here's your workforce overview.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="secondary" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export Report</Button>
                    <Button onClick={handleRunAnalysis} isLoading={isRefreshing}><RefreshCw className="h-4 w-4 mr-2" />Run Analysis</Button>
                    <Link to="/analysis">
                        <Button>Add New Employee</Button>
                    </Link>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Total Employees" value={data?.totalEmployees} icon={Users} loading={loading} delay={0} />
                <MetricCard title="Critical Risks" value={data?.criticalRiskCount} icon={AlertTriangle} loading={loading} iconColor="text-critical" delay={100} />
                <MetricCard title="Team Health" value={data?.teamHealthStatus} icon={ShieldCheck} loading={loading} iconColor={data?.teamHealthStatus === 'Good' ? 'text-good' : 'text-warning'} delay={200} />
                <MetricCard title="Avg. Adherence" value={data ? `${data.avgTeamAdherence}%` : undefined} icon={TrendingUp} loading={loading} iconColor="text-primary" delay={300} />
            </div>
            
            {/* High Risk Carousel */}
            <div>
                <h2 className="text-2xl font-bold font-heading mb-4">High-Risk Employees</h2>
                {loading ? <Skeleton className="h-48 w-full" /> : <HighRiskCarousel employees={data?.highRiskEmployees || []} />}
            </div>


            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2" style={{ animationDelay: '400ms'}}>
                    <CardHeader>
                        <CardTitle>Risk Distribution</CardTitle>
                        <CardDescription>Breakdown of employee risk levels.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-[250px] w-full" /> : (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                        {pieChartData.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} fill={RISK_LEVEL_CLASSES[entry.name as RiskLevel].hex} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3" style={{ animationDelay: '500ms'}}>
                    <CardHeader>
                        <CardTitle>Recent Critical Alerts</CardTitle>
                        <CardDescription>Last 10 critical risk alerts requiring action.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">Timestamp</th>
                                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">Employee</th>
                                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">Risk Score</th>
                                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {loading ? Array(5).fill(0).map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                                        </tr>
                                    )) : data?.recentAlerts.map((alert, index) => (
                                        <tr key={alert.employee_id} className="hover:bg-muted/50 opacity-0 animate-slide-in-up" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}>
                                            <td className="px-6 py-4 whitespace-nowrap">{format(new Date(alert.alert_timestamp), 'PP pp')}</td>
                                            <td className="px-6 py-4 font-medium">{alert.employee_name}</td>
                                            <td className="px-6 py-4 text-center font-bold text-critical">{alert.risk_score}</td>
                                            <td className="px-6 py-4"><Badge riskLevel={RiskLevel.Critical} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

interface MetricCardProps {
    title: string;
    value?: string | number;
    icon: React.ElementType;
    loading: boolean;
    iconColor?: string;
    delay: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, loading, iconColor = "text-muted-foreground", delay }) => (
    <Card className="animate-pop-in" style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards', opacity: 0 }}>
        <CardContent className="flex items-center justify-between p-6">
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                {loading ? <Skeleton className="h-8 w-24 mt-1" /> : (
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                )}
            </div>
            <div className={`p-3 bg-muted rounded-lg ${iconColor}`}>
                <Icon className="h-6 w-6" />
            </div>
        </CardContent>
    </Card>
);

export default Dashboard;