import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface AnalyzingIndicatorProps {
  message?: string;
  submessage?: string;
}

const AnalyzingIndicator = ({ 
  message = "Analyzing your image...",
  submessage = "This may take a few moments"
}: AnalyzingIndicatorProps) => {
  return (
    <Card className="mb-8 border border-primary/50 bg-primary/5">
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <div>
            <p className="text-lg font-medium">{message}</p>
            <p className="text-muted-foreground">{submessage}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyzingIndicator;