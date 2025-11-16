import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { getAllPredictions } from '../services/api';
import { Prediction, RiskLevel } from '../types';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import { format } from 'date-fns';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import PredictionModal from '../components/predictions/PredictionModal';

const PredictionsHistory: React.FC = () => {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [riskFilter, setRiskFilter] = useState<RiskLevel | 'All'>('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Prediction; direction: 'asc' | 'desc' } | null>({ key: 'analysis_timestamp', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
    const rowsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getAllPredictions();
            setPredictions(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const filteredPredictions = useMemo(() => {
        return predictions
            .filter(p => searchTerm === '' || p.employee_name.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(p => riskFilter === 'All' || p.calculated_risk_level === riskFilter);
    }, [predictions, searchTerm, riskFilter]);

    const sortedPredictions = useMemo(() => {
        let sortableItems = [...filteredPredictions];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredPredictions, sortConfig]);

    const paginatedPredictions = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return sortedPredictions.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedPredictions, currentPage]);

    const totalPages = Math.ceil(sortedPredictions.length / rowsPerPage);

    const handleSort = (key: keyof Prediction) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortableHeader: React.FC<{ sortKey: keyof Prediction, label: string }> = ({ sortKey, label }) => (
        <th className="px-6 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort(sortKey)}>
            <div className="flex items-center">
                {label}
                {sortConfig?.key === sortKey && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                )}
            </div>
        </th>
    );

    return (
        <div className="space-y-6">
             <h1 className="text-3xl font-bold font-heading">Prediction History</h1>
            <Card>
                <CardHeader>
                    <CardTitle>All Employee Analyses</CardTitle>
                    <CardDescription>Browse, filter, and search through all historical predictions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-2 sm:space-y-0">
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm bg-transparent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <select
                            value={riskFilter}
                            onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'All')}
                            className="w-full sm:w-48 px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="All">All Risk Levels</option>
                            {Object.values(RiskLevel).map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-x-auto border border-border rounded-lg">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <SortableHeader sortKey="analysis_timestamp" label="Date" />
                                    <SortableHeader sortKey="employee_name" label="Employee" />
                                    <SortableHeader sortKey="calculated_risk_level" label="Risk Level" />
                                    <SortableHeader sortKey="calculated_risk_score" label="Risk Score" />
                                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Prediction Summary</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-card">
                                {loading ? Array(rowsPerPage).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                                    </tr>
                                )) : paginatedPredictions.map((p, index) => (
                                    <tr key={p.employee_id + p.analysis_timestamp} className="hover:bg-muted/50 cursor-pointer opacity-0 animate-slide-in-up" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }} onClick={() => setSelectedPrediction(p)}>
                                        <td className="px-6 py-4 whitespace-nowrap">{format(new Date(p.analysis_timestamp), 'PP')}</td>
                                        <td className="px-6 py-4 font-medium">{p.employee_name}</td>
                                        <td className="px-6 py-4"><Badge riskLevel={p.calculated_risk_level} /></td>
                                        <td className="px-6 py-4 text-center font-bold">{p.calculated_risk_score}</td>
                                        <td className="px-6 py-4 text-muted-foreground truncate max-w-xs">{p.ai_prediction}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-muted-foreground">
                            Showing {Math.min((currentPage - 1) * rowsPerPage + 1, sortedPredictions.length)} to {Math.min(currentPage * rowsPerPage, sortedPredictions.length)} of {sortedPredictions.length} results
                        </span>
                        <div className="flex space-x-1">
                             <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm border border-border rounded-md disabled:opacity-50 hover:bg-secondary"
                            >
                                Previous
                            </button>
                             <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="px-3 py-1 text-sm border border-border rounded-md disabled:opacity-50 hover:bg-secondary"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {selectedPrediction && <PredictionModal prediction={selectedPrediction} onClose={() => setSelectedPrediction(null)} />}
        </div>
    );
};

export default PredictionsHistory;