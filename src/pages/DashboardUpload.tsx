
import { useState } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import ImageUploader from "@/components/upload/ImageUploader";
import ImageAnalysisResult, { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import SimilarImagesGrid, { SimilarImage } from "@/components/results/SimilarImagesGrid";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

// Mock data for history items
const mockHistoryItems = Array(10).fill(0).map((_, i) => ({
  id: `img-${i}`,
  name: `Image ${i + 1}.jpg`,
  date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
  thumbnail: '/placeholder.svg'
}));

const DashboardUpload = () => {
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
    <SidebarProvider>
      <div className="min-h-screen flex">
        <DashboardSidebar 
          historyItems={mockHistoryItems}
          onHistoryItemSelect={() => {}}
        />
        
        <SidebarInset>
          <div className="flex flex-col h-full">
            <header className="border-b p-4 flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Upload New Image</h1>
            </header>
            
            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto space-y-10">
                <div className="mb-8">
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardUpload;
