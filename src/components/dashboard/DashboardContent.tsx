import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchImageAnalysis } from "@/services/imageAnalysisService";
import { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import { SimilarImage } from "@/components/results/SimilarImagesGrid";
import { useToast } from "@/hooks/use-toast";
import EmptyDashboard from "./EmptyDashboard";
import SelectedImageContent from "./SelectedImageContent";
import { HistoryItem } from "@/types/imageProcessing";

interface DashboardContentProps {
  historyItems: HistoryItem[];
  selectedItemId?: string;
  isAuthenticated: boolean;
}

const DashboardContent = ({ 
  historyItems, 
  selectedItemId,
  isAuthenticated 
}: DashboardContentProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [activeLabel, setActiveLabel] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Fetch image analysis when a history item is selected
  useEffect(() => {
    const loadImageAnalysis = async () => {
      if (!selectedItemId || !isAuthenticated) return;
      
      const selectedItem = historyItems.find(item => item.id === selectedItemId);
      if (!selectedItem) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { analysis, similarImages, labels } = await fetchImageAnalysis(selectedItem.name);
        setAnalysis(analysis);
        setSimilarImages(similarImages);
        setLabels(labels);
        
        // Set the first label as active by default
        if (labels.length > 0) {
          setActiveLabel(labels[0]);
        }
      } catch (error) {
        setError("Failed to load image analysis");
        toast({
          title: "Error",
          description: "Failed to load image analysis",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadImageAnalysis();
  }, [selectedItemId, historyItems, toast, isAuthenticated]);

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6 flex justify-center items-center">
          <div className="animate-pulse text-center">
            <p className="text-lg font-medium">Loading analysis...</p>
            <p className="text-sm text-muted-foreground">Please wait</p>
          </div>
        </CardContent>
      </Card>
    );
  } 
  
  if (!selectedItemId || !analysis) {
    return (
      <EmptyDashboard 
        isAuthenticated={isAuthenticated} 
        hasHistoryItems={historyItems.length > 0} 
      />
    );
  }

  const selectedImage = historyItems.find(item => item.id === selectedItemId);
  const imageUrl = selectedImage?.thumbnail || "/placeholder.svg";

  return (
    <SelectedImageContent
      analysis={analysis}
      imageUrl={imageUrl}
      similarImages={similarImages}
      labels={labels}
      activeLabel={activeLabel}
      setActiveLabel={setActiveLabel}
      isLoading={isLoading}
    />
  );
};

export default DashboardContent;