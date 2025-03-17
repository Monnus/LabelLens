
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface UploadProgressProps {
  progress: number;
  isComplete: boolean;
  error: string | null;
}

const UploadProgress = ({ progress, isComplete, error }: UploadProgressProps) => {
  return (
    <div className="w-full space-y-2 my-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Upload Progress</span>
        {isComplete && !error && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Complete
          </Badge>
        )}
        {error && (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Failed
          </Badge>
        )}
      </div>
      <Progress value={progress} className="h-2" />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default UploadProgress;
