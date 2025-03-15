
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import SimilarImagesGrid, { SimilarImage } from "@/components/results/SimilarImagesGrid";
import { Image, Palette, Tag, Grid, ChevronRight, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisTabsProps {
  analysisResults: ImageAnalysis;
  similarImages: SimilarImage[];
  previewUrl: string;
}

const AnalysisTabs = ({ analysisResults, similarImages, previewUrl }: AnalysisTabsProps) => {
  const [activeTab, setActiveTab] = useState("image");
  const { toast } = useToast();

  const handleTabClick = (value: string) => {
    setActiveTab(value);
  };

  const handleSearchMore = (category: string) => {
    console.log(`Searching for more images with category: ${category}`);
    // Here you would integrate with an API like Unsplash to find more similar images
    
    toast({
      title: "Search Initiated",
      description: `Searching for more images related to "${category}"`
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analysis Results</h2>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabClick} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Image size={16} />
            <span className="hidden sm:inline">Image</span>
          </TabsTrigger>
          <TabsTrigger value="objects" className="flex items-center gap-2">
            <Tag size={16} />
            <span className="hidden sm:inline">Objects</span>
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette size={16} />
            <span className="hidden sm:inline">Colors</span>
          </TabsTrigger>
          <TabsTrigger value="similar" className="flex items-center gap-2">
            <Grid size={16} />
            <span className="hidden sm:inline">Similar</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="image" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-video max-h-[500px] rounded-md overflow-hidden bg-muted/50 border flex items-center justify-center">
                <img 
                  src={previewUrl} 
                  alt="Uploaded image" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">All Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResults.tags?.map((tag, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleSearchMore(tag)}
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <ChevronRight size={14} />
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="objects" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Objects Detected</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysisResults.objects?.map((object, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    className="justify-between h-auto py-3 px-4"
                    onClick={() => handleSearchMore(object)}
                  >
                    <span>{object}</span>
                    <Search size={16} />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="colors" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Dominant Colors</h3>
              <div className="space-y-4">
                {analysisResults.colors?.map((color, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-md border" 
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{color.name}</span>
                        <span className="text-sm text-muted-foreground">{color.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${color.percentage}%`,
                            backgroundColor: color.hex
                          }}
                        />
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSearchMore(color.name)}
                    >
                      <Search size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="similar" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Similar Images</h3>
              <SimilarImagesGrid 
                images={similarImages}
                isLoading={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisTabs;
