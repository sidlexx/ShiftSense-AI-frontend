import React from 'react';
import { Prediction, RiskLevel } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import RiskGauge from '../ui/RiskGauge';
import { X, Printer, Mail } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface PredictionModalProps {
  prediction: Prediction;
  onClose: () => void;
}

const PredictionModal: React.FC<PredictionModalProps> = ({ prediction, onClose }) => {

  const handlePrint = () => {
      toast.success("Printing report...");
      // In a real app, you would use window.print() or a library like react-to-print
  };

  const handleEmail = () => {
      toast.success(`Emailing report for ${prediction.employee_name} to manager.`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col animate-pop-in opacity-0" style={{ animationFillMode: 'forwards' }}>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{prediction.employee_name} - Analysis Report</CardTitle>
            <CardDescription>
                Analyzed on {format(new Date(prediction.analysis_timestamp), 'PPP p')}
            </CardDescription>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
            <X className="h-6 w-6 text-muted-foreground" />
          </button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center space-y-4 p-6 bg-muted/50 rounded-lg">
                    <RiskGauge score={prediction.calculated_risk_score} />
                    <Badge riskLevel={prediction.calculated_risk_level} className="text-lg px-6 py-2" />
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <MetricItem label="Employee ID" value={prediction.employee_id} />
                    <MetricItem label="Shift Date" value={format(new Date(prediction.shift_date), 'PP')} />
                    <MetricItem label="Adherence" value={`${prediction.adherence_pct}%`} />
                    <MetricItem label="Tardiness" value={prediction.tardiness_count} />
                    <MetricItem label="AUX Time" value={`${prediction.aux_time_pct}%`} />
                    <MetricItem label="Calls Handled" value={prediction.calls_handled} />
                    <MetricItem label="Absences" value={prediction.unplanned_absences} />
                    <MetricItem label="Shift Coverage" value={prediction.needs_shift_coverage ? 'Recommended' : 'Not Needed'} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard title="AI Prediction" content={prediction.ai_prediction} />
                <InfoCard title="AI Recommendation" content={prediction.ai_recommendation} />
                <InfoCard title="Overtime Strategy" content={prediction.ot_strategy} />
                <InfoCard title="AUX Strategy" content={prediction.aux_strategy} />
            </div>
        </CardContent>
        <div className="p-6 border-t border-border flex justify-end space-x-2">
            <Button variant="secondary" onClick={handleEmail}><Mail className="h-4 w-4 mr-2" />Email Manager</Button>
            <Button onClick={handlePrint}><Printer className="h-4 w-4 mr-2"/>Print Report</Button>
        </div>
      </Card>
    </div>
  );
};

const MetricItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-muted/50 p-3 rounded-md">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-bold text-lg">{value}</p>
    </div>
);

const InfoCard: React.FC<{ title: string; content: string }> = ({ title, content }) => (
    <div>
        <h4 className="font-heading font-semibold text-lg mb-1">{title}</h4>
        <p className="text-muted-foreground text-sm">{content}</p>
    </div>
)

export default PredictionModal;