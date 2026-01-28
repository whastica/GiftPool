import type { FC } from 'react';

type ProgressBarProps = {
  current: number;
  target: number;
  showPercentage?: boolean;
  className?: string;
};

const ProgressBar: FC<ProgressBarProps> = ({ current, target, showPercentage = true, className = '' }) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className={className}>
      {showPercentage && (
        <div className="flex items-center justify-between mb-2 text-sm font-semibold">
          <span className="text-gray-600">
            ${current.toLocaleString()} de ${target.toLocaleString()}
          </span>
          <span className="text-primary-600">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
      
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>

      {showPercentage && (
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Faltan ${(target - current).toLocaleString()}</span>
          <span>{percentage >= 100 ? '¡Completado!' : `${(100 - percentage).toFixed(0)}% restante`}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;