
import { useState } from "react";
import ImageUploader from "@/components/upload/ImageUploader";
import ImageAnalysisResult, { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import SimilarImagesGrid, { SimilarImage } from "@/components/results/SimilarImagesGrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/shared/Navbar";
import { useToast } from "@/hooks/use-toast";

const GetStarted = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ImageAnalysis | null>(null);
  const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);
  const { toast } = useToast();

  const handleImageSelected = (file: File) => {
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Reset results
    setAnalysisResults(null);
    setSimilarImages([]);
  };

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis results
      const mockAnalysis: ImageAnalysis = {
        objects: ['person', 'tree', 'car', 'building'],
        colors: [
          { name: 'Blue', hex: '#4285F4', percentage: 45 },
          { name: 'Green', hex: '#34A853', percentage: 30 },
          { name: 'Gray', hex: '#9AA0A6', percentage: 15 },
          { name: 'Red', hex: '#EA4335', percentage: 10 }
        ],
        tags: ['outdoor', 'urban', 'daytime', 'architecture', 'street']
      };
      
      // Mock similar images
      const mockSimilarImages: SimilarImage[] = Array(6).fill(0).map((_, i) => ({
        id: `img-${i}`,
        url: `https://example.com/image${i}`,
        thumbnailUrl: '/placeholder.svg', // Use actual placeholder image
        title: `Similar Image ${i + 1}`,
        author: `Author ${i + 1}`,
        authorUrl: `https://example.com/author${i}`
      }));
      
      setAnalysisResults(mockAnalysis);
      setSimilarImages(mockSimilarImages);
      
      toast({
        title: "Analysis Complete",
        description: "Your image has been analyzed successfully"
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your image",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Upload Your Image</h1>
            <p className="text-muted-foreground">
              Get detailed information about your image and discover similar images
            </p>
          </div>
          
          <div className="mb-12">
            <ImageUploader 
              onImageSelected={handleImageSelected}
              onImageUpload={handleImageUpload}
            />
          </div>
          
          {isAnalyzing && (
            <Card className="mb-8 border border-primary/50 bg-primary/5">
              <CardContent className="p-6 text-center">
                <div className="animate-pulse">
                  <p className="text-lg">Analyzing your image...</p>
                  <p className="text-muted-foreground">This may take a few moments</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {analysisResults && previewUrl && (
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
                <ImageAnalysisResult 
                  analysis={analysisResults}
                  imageUrl={previewUrl}
                />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6">Similar Images</h2>
                <SimilarImagesGrid 
                  images={similarImages}
                  isLoading={isAnalyzing}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GetStarted;
