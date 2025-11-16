import React, { useState } from 'react';
import { Prediction } from '../../types';
import { Card, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import RiskGauge from '../ui/RiskGauge';
import PredictionModal from '../predictions/PredictionModal';

interface HighRiskCarouselProps {
  employees: Prediction[];
}

const HighRiskCarousel: React.FC<HighRiskCarouselProps> = ({ employees }) => {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);

  if (employees.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No employees currently at high risk. Great job!
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
        {employees.map((employee, index) => (
          <Card key={employee.employee_id} className="flex-shrink-0 w-72 animate-pop-in opacity-0" style={{animationDelay: `${index * 100}ms`, animationFillMode: 'forwards'}}>
            <CardContent className="p-4 flex flex-col items-center justify-between h-full">
              <div className="text-center">
                <h4 className="font-bold text-lg">{employee.employee_name}</h4>
                <p className="text-xs text-muted-foreground">{employee.employee_id}</p>
                <div className="my-3">
                    <Badge riskLevel={employee.calculated_risk_level} />
                </div>
                 <p className="text-3xl font-bold" style={{color: employee.calculated_risk_level === 'Critical' ? '#ef4444' : '#f97316'}}>{employee.calculated_risk_score}
                    <span className="text-sm font-normal text-muted-foreground"> / 100</span>
                 </p>
                 <p className="text-xs text-muted-foreground">Risk Score</p>
              </div>
              <Button size="sm" variant="secondary" className="mt-4 w-full" onClick={() => setSelectedPrediction(employee)}>
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedPrediction && <PredictionModal prediction={selectedPrediction} onClose={() => setSelectedPrediction(null)} />}
    </>
  );
};

export default HighRiskCarousel;