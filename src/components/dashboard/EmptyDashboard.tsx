import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyDashboardProps {
  isAuthenticated: boolean;
  hasHistoryItems: boolean;
}

const EmptyDashboard = ({ isAuthenticated, hasHistoryItems }: EmptyDashboardProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Upload className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No Image Selected</h2>
      <p className="text-muted-foreground mb-4">
        {isAuthenticated
          ? hasHistoryItems
            ? "Select an image from your history or upload a new one"
            : "You haven't uploaded any images yet"
          : "Please log in to view your image history"}
      </p>
      <Button onClick={() => navigate("/dashboard/upload")}>
        Upload New Image
      </Button>
    </div>
  );
};

export default EmptyDashboard;