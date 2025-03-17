
import { CheckCircle2, Upload, Search, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadState } from "@/types/imageProcessing";

interface StepIndicatorProps {
  currentState: UploadState;
}

const ProcessSteps = ({ currentState }: StepIndicatorProps) => {
  const steps = [
    { 
      id: 'upload', 
      label: 'Upload', 
      icon: Upload, 
      states: ['idle', 'uploading'],
      completed: ['uploaded', 'analyzing', 'complete'],
    },
    { 
      id: 'analyze', 
      label: 'Analyze', 
      icon: Search, 
      states: ['analyzing'],
      completed: ['complete'],
    },
    { 
      id: 'complete', 
      label: 'Results', 
      icon: CheckCircle2, 
      states: ['complete'],
      completed: [],
    },
  ];

  return (
    <div className="flex items-center justify-center max-w-md mx-auto mb-8">
      {steps.map((step, index) => {
        const isActive = step.states.includes(currentState);
        const isCompleted = step.completed.includes(currentState);
        const isError = currentState === 'error';
        
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div 
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border transition-colors",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isCompleted && "border-green-500 bg-green-500 text-white",
                  isError && step.id === 'analyze' && "border-red-500 bg-red-500 text-white",
                  !isActive && !isCompleted && !isError && "border-muted-foreground/30 text-muted-foreground/50"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  isActive ? (
                    <step.icon className="h-4 w-4 animate-pulse" />
                  ) : (
                    <CircleDashed className="h-4 w-4" />
                  )
                )}
              </div>
              <span 
                className={cn(
                  "text-xs mt-1",
                  isActive && "text-primary font-medium",
                  isCompleted && "text-green-500 font-medium",
                  !isActive && !isCompleted && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "flex-1 h-[1px] mx-2",
                  (isCompleted || (index === 0 && currentState === 'analyzing')) ? "bg-green-500" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProcessSteps;
