import { FC } from "react";
import { cn } from "@/lib/utils";

interface ProgressMeterProps {
  value: number;
  label?: string;
  showValue?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent" | "destructive";
}

export const ProgressMeter: FC<ProgressMeterProps> = ({
  value,
  label,
  showValue = true,
  className = "",
  size = "md",
  color = "secondary"
}) => {
  // Make sure value is between 0 and 10
  const normalizedValue = Math.min(Math.max(0, value), 10);
  const percentage = `${normalizedValue * 10}%`;
  
  const colorClass = {
    primary: "bg-primary",
    secondary: "bg-secondary-500",
    accent: "bg-accent-500",
    destructive: "bg-destructive"
  };
  
  const heightClass = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2"
  };
  
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="font-medium text-neutral-700 text-xs mb-1">{label}</div>
      )}
      <div className="flex items-center">
        <div className={cn("w-full bg-neutral-200 rounded-full mr-1", heightClass[size])}>
          <div 
            className={cn(colorClass[color], "rounded-full", heightClass[size])} 
            style={{ width: percentage }}
          />
        </div>
        {showValue && (
          <span className="text-xs">{normalizedValue.toFixed(1)}</span>
        )}
      </div>
    </div>
  );
};

export default ProgressMeter;
