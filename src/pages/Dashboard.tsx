
import { useState } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import ImageAnalysisResult, { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import SimilarImagesGrid, { SimilarImage } from "@/components/results/SimilarImagesGrid";
import { Button } from "@/components/ui/button";
import { InfoIcon, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for history items
const mockHistoryItems = Array(10).fill(0).map((_, i) => ({
  id: `img-${i}`,
  name: `Image ${i + 1}.jpg`,
  date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
  thumbnail: '/placeholder.svg'
}));

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
  id: `similar-${i}`,
  url: `https://example.com/image${i}`,
  thumbnailUrl: '/placeholder.svg',
  title: `Similar Image ${i + 1}`,
  author: `Author ${i + 1}`,
  authorUrl: `https://example.com/author${i}`
}));

const Dashboard = () => {
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(mockHistoryItems[0]?.id);
  const navigate = useNavigate();
  
  const handleHistoryItemSelect = (id: string) => {
    setSelectedItemId(id);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <DashboardSidebar 
          historyItems={mockHistoryItems}
          onHistoryItemSelect={handleHistoryItemSelect}
          selectedItemId={selectedItemId}
        />
        
        <SidebarInset>
          <div className="flex flex-col h-full">
            <header className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold">Dashboard</h1>
              </div>
              <Button onClick={() => navigate("/dashboard/upload")}>
                <Upload className="mr-2 h-4 w-4" />
                Upload New Image
              </Button>
            </header>
            
            <main className="flex-1 overflow-auto p-6">
              {selectedItemId ? (
                <div className="max-w-4xl mx-auto space-y-10">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <InfoIcon className="h-5 w-5 text-primary" />
                      <h2 className="text-2xl font-bold">Image Analysis</h2>
                    </div>
                    <ImageAnalysisResult 
                      analysis={mockAnalysis}
                      imageUrl="/placeholder.svg"
                    />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Similar Images</h2>
                    <SimilarImagesGrid images={mockSimilarImages} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">No Image Selected</h2>
                  <p className="text-muted-foreground mb-4">
                    Select an image from your history or upload a new one
                  </p>
                  <Button onClick={() => navigate("/dashboard/upload")}>
                    Upload New Image
                  </Button>
                </div>
              )}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
