
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchImageAnalysis } from "@/services/imageAnalysisService";
import { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import { SimilarImage } from "@/components/results/SimilarImagesGrid";
import { useToast } from "@/hooks/use-toast";
import EmptyDashboard from "./EmptyDashboard";
import SelectedImageContent from "./SelectedImageContent";
import { HistoryItem } from "@/types/imageProcessing";

interface DashboardContentProps {
  authIDToken: string;
  historyItems: HistoryItem[];
  selectedItemId?: string;
  isAuthenticated: boolean;
  forceRefetch?: number; // A counter that, when incremented, forces a refetch
}

const DashboardContent = ({
  authIDToken,
  historyItems,
  selectedItemId,
  isAuthenticated,
  forceRefetch = 0
}: DashboardContentProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [activeLabel, setActiveLabel] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Fetch image analysis when a history item is selected or forceRefetch changes
  const loadImageAnalysis = useCallback(async () => {
    if (!selectedItemId || !isAuthenticated) return;
    
    // log here("Loading analysis for image:", selectedItemId);
    // log here("Auth token available:", authIDToken ? "Yes" : "No");
    
    setIsLoading(true);
    setError(null);
    
    try {
      const {analysis,similarImages,labels } = await fetchImageAnalysis(selectedItemId, authIDToken);
      
      // log here("Analysis results:", analysis);
      // log here("Labels:", labels);
      
      setAnalysis(analysis);
      setSimilarImages(similarImages);
      setLabels(labels);
      
      // Set the first label as active by default
      if (labels.length > 0) {
        setActiveLabel(labels[0]);
      }
      
      toast({
        title: "Analysis loaded",
        description: `Successfully loaded analysis for ${selectedItemId}`,
      });
    } catch (error) {
      console.error("Error loading image analysis:", error);
      setError("Failed to load image analysis");
      toast({
        title: "Error",
        description: "Failed to load image analysis",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedItemId, authIDToken, isAuthenticated, toast]);

  // Run when selectedItemId changes or when forceRefetch changes
  useEffect(() => {
    // log here("useEffect triggered - selectedItemId:", selectedItemId);
    // log here("forceRefetch counter:", forceRefetch);
    loadImageAnalysis();
  }, [loadImageAnalysis, selectedItemId, forceRefetch]);

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