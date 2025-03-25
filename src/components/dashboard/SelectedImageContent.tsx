import { useState } from "react";
import ImageAnalysisResult, { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import SimilarImagesGrid, { SimilarImage } from "@/components/results/SimilarImagesGrid";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchImagesForLabel } from "@/services/imageAnalysisService";

interface SelectedImageContentProps {
  analysis: ImageAnalysis;
  imageUrl: string;
  similarImages: SimilarImage[];
  labels: string[];
  activeLabel?: string;
  setActiveLabel: (label: string) => void;
  isLoading: boolean;
}

const SelectedImageContent = ({
  analysis,
  imageUrl,
  similarImages,
  labels,
  activeLabel,
  setActiveLabel,
  isLoading
}: SelectedImageContentProps) => {
  const { toast } = useToast();
  const [labelLoading, setLabelLoading] = useState(false);
  
  const handleLabelSelect = async (label: string) => {
    setActiveLabel(label);
    setLabelLoading(true);
    
    try {
      // This would typically be handled in the parent component
      // but we're keeping similar functionality during refactoring
      await fetchImagesForLabel(label);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to load images for ${label}`,
        variant: "destructive"
      });
    } finally {
      setLabelLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <InfoIcon className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Image Analysis</h2>
        </div>
        
        {labels.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {labels.map((label) => (
                <Button
                  key={label}
                  variant={activeLabel === label ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLabelSelect(label)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <ImageAnalysisResult 
          analysis={analysis}
          imageUrl={imageUrl}
        />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Similar Images</h2>
        <SimilarImagesGrid 
          images={similarImages}
          isLoading={isLoading || labelLoading}
        />
      </div>
    </div>
  );
};

export default SelectedImageContent;