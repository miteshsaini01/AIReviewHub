import { FC } from "react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  readOnly?: boolean;
  onChange?: (value: number) => void;
}

export const Rating: FC<RatingProps> = ({
  value,
  max = 5,
  size = "md",
  className = "",
  readOnly = true,
  onChange
}) => {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  
  const sizeClass = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };
  
  const handleClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };
  
  return (
    <div className={cn("flex", className)}>
      {stars.map((star) => (
        <span
          key={star}
          className={cn(
            sizeClass[size],
            "text-accent-500",
            !readOnly && "cursor-pointer"
          )}
          onClick={() => handleClick(star)}
        >
          {star <= value ? (
            <i className="ri-star-fill"></i>
          ) : star - 0.5 <= value ? (
            <i className="ri-star-half-fill"></i>
          ) : (
            <i className="ri-star-line"></i>
          )}
        </span>
      ))}
    </div>
  );
};

export default Rating;
