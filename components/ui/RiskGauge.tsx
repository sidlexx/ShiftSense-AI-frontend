import React from 'react';
import { RiskLevel } from '../../types';
import { RISK_LEVEL_CLASSES } from '../../constants';

interface RiskGaugeProps {
  score: number;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ score }) => {
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let riskLevel: RiskLevel;
  if (score >= 70) riskLevel = RiskLevel.Critical;
  else if (score >= 40) riskLevel = RiskLevel.Warning;
  else if (score >= 20) riskLevel = RiskLevel.Monitor;
  else riskLevel = RiskLevel.Good;
    
  const color = RISK_LEVEL_CLASSES[riskLevel].hex;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.5s ease-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {Math.round(score)}
        </span>
        <span className="text-xs text-muted-foreground">Risk Score</span>
      </div>
    </div>
  );
};

export default RiskGauge;