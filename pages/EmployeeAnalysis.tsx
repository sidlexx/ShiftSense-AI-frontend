import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import RiskGauge from '../components/ui/RiskGauge';
import { EmployeeMetrics, Prediction, RiskLevel } from '../types';
import { calculateLiveRisk } from '../utils/helpers';
import { analyzeEmployee, savePrediction } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ArrowLeft, BrainCircuit, Lightbulb, TrendingUp, ShieldAlert, Save, ListTodo } from 'lucide-react';
import Badge from '../components/ui/Badge';

const initialMetrics: EmployeeMetrics = {
    employee_id: `E${Math.floor(1000 + Math.random() * 9000)}`,
    employee_name: '',
    shift_date: format(new Date(), 'yyyy-MM-dd'),
    adherence_pct: 95,
    tardiness_count: 0,
    aux_time_pct: 8,
    calls_handled: 120,
    unplanned_absences: 0,
};

const EmployeeAnalysis: React.FC = () => {
    const [metrics, setMetrics] = useState<EmployeeMetrics>(initialMetrics);
    const [liveRisk, setLiveRisk] = useState(0);
    const [analysisResult, setAnalysisResult] = useState<Prediction | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const risk = calculateLiveRisk(metrics);
        setLiveRisk(risk);
    }, [metrics]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setMetrics(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };
    
    const handleSliderChange = (name: keyof EmployeeMetrics, value: number) => {
        setMetrics(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAnalyze = async () => {
        if (!metrics.employee_name) {
            toast.error("Please enter an employee name.");
            return;
        }
        setIsLoading(true);
        try {
            const result = await analyzeEmployee(metrics);
            setAnalysisResult(result);
            toast.success(`Analysis complete for ${metrics.employee_name}`);
        } catch (error) {
            toast.error("Analysis failed. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const resetForm = () => {
        setMetrics(initialMetrics);
        setAnalysisResult(null);
    };

    if (analysisResult) {
        return <AnalysisResults result={analysisResult} onAnalyzeAnother={resetForm} />;
    }

    return (
        <div className="max-w-4xl mx-auto">
             <h1 className="text-3xl font-bold font-heading mb-6">Employee Performance Analysis</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Enter Employee Metrics</CardTitle>
                    <CardDescription>Fill in the details below to get an AI-powered risk analysis.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="Employee ID" name="employee_id" value={metrics.employee_id} onChange={handleChange} />
                                <InputField label="Employee Name" name="employee_name" value={metrics.employee_name} onChange={handleChange} required />
                            </div>
                            <InputField label="Shift Date" name="shift_date" type="date" value={metrics.shift_date} onChange={handleChange} />
                            
                            <SliderField label="Adherence %" name="adherence_pct" value={metrics.adherence_pct} onChange={(val) => handleSliderChange('adherence_pct', val)} min={0} max={100} />
                            <SliderField label="AUX Time %" name="aux_time_pct" value={metrics.aux_time_pct} onChange={(val) => handleSliderChange('aux_time_pct', val)} min={0} max={100} />

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <InputField label="Tardiness Count" name="tardiness_count" type="number" value={metrics.tardiness_count} onChange={handleChange} />
                                <InputField label="Calls Handled" name="calls_handled" type="number" value={metrics.calls_handled} onChange={handleChange} />
                                <InputField label="Unplanned Absences" name="unplanned_absences" type="number" value={metrics.unplanned_absences} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="md:col-span-1 flex flex-col items-center justify-center bg-muted/50 rounded-lg p-6">
                            <h4 className="text-lg font-semibold mb-4">Live Risk Score</h4>
                            <RiskGauge score={liveRisk} />
                            <p className="text-sm text-muted-foreground mt-4 text-center">This score updates in real-time as you enter metrics.</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    <Button onClick={handleAnalyze} isLoading={isLoading}>Analyze with AI</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

const AnalysisResults: React.FC<{ result: Prediction, onAnalyzeAnother: () => void }> = ({ result, onAnalyzeAnother }) => {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await savePrediction(result);
            toast.success("Prediction saved!");
        } catch (error) {
            toast.error("Failed to save prediction.");
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div className="max-w-5xl mx-auto">
            <button onClick={onAnalyzeAnother} className="flex items-center text-sm text-primary hover:underline mb-4">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Analyze Another Employee
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="text-center animate-pop-in" style={{ animationFillMode: 'forwards', opacity: 0 }}>
                        <CardHeader>
                            <CardTitle>{result.employee_name}</CardTitle>
                            <CardDescription>ID: {result.employee_id}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <RiskGauge score={result.calculated_risk_score} />
                            <div className="mt-4">
                               <Badge riskLevel={result.calculated_risk_level} className="text-base px-4 py-1" />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="space-y-2 animate-pop-in" style={{animationDelay: '100ms', animationFillMode: 'forwards', opacity: 0}}>
                        <Button onClick={handleSave} isLoading={isSaving} className="w-full">
                            <Save className="h-4 w-4 mr-2" /> Save Prediction
                        </Button>
                        {result.calculated_risk_level === RiskLevel.Critical && (
                             <Button variant="destructive" className="w-full" onClick={() => toast.success(`Alert for ${result.employee_name} dispatched to manager.`)}>
                                <ShieldAlert className="h-5 w-5 mr-2" /> Send Email Alert
                            </Button>
                        )}
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <ResultCard icon={BrainCircuit} title="AI Prediction" content={result.ai_prediction} delay={200} />
                    <ResultCard icon={ListTodo} title="Recommended Actions" content={result.ai_recommendation} delay={300} />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ResultCard icon={TrendingUp} title="OT Strategy" content={result.ot_strategy} delay={400} />
                        <ResultCard icon={Lightbulb} title="AUX Optimization" content={result.aux_strategy} delay={500} />
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ResultCardProps { icon: React.ElementType; title: string; content: string; delay: number; }
const ResultCard: React.FC<ResultCardProps> = ({ icon: Icon, title, content, delay }) => (
    <Card className="animate-pop-in" style={{animationDelay: `${delay}ms`, animationFillMode: 'forwards', opacity: 0}}>
        <CardHeader className="flex flex-row items-center space-x-3 pb-2">
            <Icon className="h-6 w-6 text-primary" />
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{content}</p>
        </CardContent>
    </Card>
)

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}
const InputField: React.FC<InputFieldProps> = ({ label, name, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
        <input id={name} name={name} {...props} className="w-full px-3 py-2 text-sm bg-transparent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
    </div>
);

interface SliderFieldProps {
    label: string;
    name: keyof EmployeeMetrics;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}
const SliderField: React.FC<SliderFieldProps> = ({ label, name, value, onChange, min = 0, max = 100 }) => (
    <div>
        <label htmlFor={name.toString()} className="block text-sm font-medium text-muted-foreground mb-1">{label}: <span className="font-bold text-primary">{value}</span></label>
        <input
            type="range"
            id={name.toString()}
            name={name.toString()}
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
    </div>
);


export default EmployeeAnalysis;