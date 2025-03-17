
import { Button } from "@/components/ui/button";
import { Search, RotateCw } from "lucide-react";

interface AnalysisControlsProps {
  onAnalyze: () => void;
  isAnalyzing: boolean;
  hasError: boolean;
  onRetry?: () => void;
}

const AnalysisControls = ({ 
  onAnalyze, 
  isAnalyzing, 
  hasError, 
  onRetry 
}: AnalysisControlsProps) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto my-6">
      {hasError && onRetry ? (
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="gap-2"
        >
          <RotateCw className="h-4 w-4" />
          Retry Analysis
        </Button>
      ) : (
        <Button 
          onClick={onAnalyze} 
          disabled={isAnalyzing}
          className="gap-2"
        >
          <Search className="h-4 w-4" />
          {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
        </Button>
      )}
      
      {!isAnalyzing && !hasError && (
        <p className="text-center text-sm text-muted-foreground">
          Click to analyze your uploaded image
        </p>
      )}
    </div>
  );
};

export default AnalysisControls;
