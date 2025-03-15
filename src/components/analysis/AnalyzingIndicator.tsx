
import { Card, CardContent } from "@/components/ui/card";

const AnalyzingIndicator = () => {
  return (
    <Card className="mb-8 border border-primary/50 bg-primary/5">
      <CardContent className="p-6 text-center">
        <div className="animate-pulse">
          <p className="text-lg">Analyzing your image...</p>
          <p className="text-muted-foreground">This may take a few moments</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyzingIndicator;
