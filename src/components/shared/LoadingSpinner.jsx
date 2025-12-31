import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export function LoadingSpinner({ size = "default", className }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export function ButtonLoading({ className }) {
  return <Loader2 className={cn("h-4 w-4 animate-spin", className)} />;
}
