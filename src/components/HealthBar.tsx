// ============================================================
// HealthBar.tsx — Animated health/block bar component
// ============================================================

import React from 'react';

interface HealthBarProps {
  current: number;
  max: number;
  block?: number;
  color?: string;        // e.g. 'bg-green-500'
  height?: string;       // e.g. 'h-3'
  showLabels?: boolean;
}

export const HealthBar: React.FC<HealthBarProps> = ({
  current,
  max,
  block = 0,
  color = 'bg-green-500',
  height = 'h-3',
  showLabels = true,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (current / max) * 100));

  // Dynamic color based on HP percentage
  const dynamicColor =
    hpPercent > 60
      ? 'bg-green-500'
      : hpPercent > 30
        ? 'bg-yellow-500'
        : 'bg-red-500';

  const barColor = color === 'bg-green-500' ? dynamicColor : color;

  return (
    <div className="w-full">
      <div className={`relative w-full ${height} bg-slate-700 rounded-full overflow-hidden border border-slate-600`}>
        {/* HP fill */}
        <div
          className={`absolute inset-y-0 left-0 ${barColor} health-bar-fill rounded-full`}
          style={{ width: `${hpPercent}%` }}
        />
        {/* Block overlay */}
        {block > 0 && (
          <div
            className="absolute inset-y-0 left-0 bg-blue-400/50 health-bar-fill rounded-full"
            style={{ width: `${Math.min(100, (block / max) * 100)}%` }}
          />
        )}
      </div>
      {showLabels && (
        <div className="flex justify-between items-center mt-0.5 text-[10px] leading-none">
          <span className="text-slate-300 font-mono">
            {current}/{max}
          </span>
          {block > 0 && (
            <span className="text-blue-400 font-mono font-bold">
              🛡️ {block}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
