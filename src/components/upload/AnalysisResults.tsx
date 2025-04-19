import { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import { SimilarImage } from "@/components/results/SimilarImagesGrid";
import ImageAnalysisResult from "@/components/results/ImageAnalysisResult";
import SimilarImagesGrid from "@/components/results/SimilarImagesGrid";

interface AnalysisResultsProps {
  analysis: ImageAnalysis;
  previewUrl: string;
  similarImages: SimilarImage[];
  labels: string[];
  isLoading: boolean;
}

const AnalysisResults = ({
  analysis,
  previewUrl,
  similarImages,
  labels,
  isLoading
}: AnalysisResultsProps) => {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
        <ImageAnalysisResult 
          analysis={analysis}
          imageUrl={previewUrl}
        />
      </div>
      
      {labels.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Detected Labels</h3>
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <span 
                key={label}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-2xl font-bold mb-6">Similar Images</h2>
        <SimilarImagesGrid 
          images={similarImages}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AnalysisResults;