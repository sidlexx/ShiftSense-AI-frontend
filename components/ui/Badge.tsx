import React from 'react';
import { cn } from '../../utils/helpers';
import { RiskLevel } from '../../types';
import { RISK_LEVEL_CLASSES } from '../../constants';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  riskLevel: RiskLevel;
}

const Badge: React.FC<BadgeProps> = ({ riskLevel, className, ...props }) => {
  const colorClasses = RISK_LEVEL_CLASSES[riskLevel] || RISK_LEVEL_CLASSES.Good;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        colorClasses.container,
        colorClasses.text,
        className
      )}
      {...props}
    >
      {riskLevel}
    </span>
  );
};

export default Badge;