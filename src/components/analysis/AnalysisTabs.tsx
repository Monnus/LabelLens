import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import SimilarImagesGrid, { SimilarImage } from "@/components/results/SimilarImagesGrid";
import { Image, Palette, Tag, Grid, ChevronRight, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisTabsProps {
  analysisResults: ImageAnalysis;
  similarImages: SimilarImage[];
  previewUrl: string;
  labels?: string[];
}

const AnalysisTabs = ({ analysisResults, similarImages, previewUrl, labels = [] }: AnalysisTabsProps) => {
  const [activeTab, setActiveTab] = useState("image");
  const [labelImages, setLabelImages] = useState<Record<string, SimilarImage[]>>({});
  const [loadingLabel, setLoadingLabel] = useState<string | null>(null);
  const { toast } = useToast();

  // Use labels from props if available, otherwise fall back to tags from analysis
  const displayLabels = labels.length > 0 ? labels : (analysisResults.tags || []);

  const handleTabClick = (value: string) => {
    setActiveTab(value);
    
    // If this is a label tab and we haven't loaded images for it yet, search for images
    if (displayLabels.includes(value) && !labelImages[value]) {
      handleSearchMore(value);
    }
  };

  const handleSearchMore = async (category: string) => {
    setLoadingLabel(category);
    
    try {
      // Here we're using Unsplash API to find images
      // In a production app, you'd want to use your own API key
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(category)}&per_page=9`,
        {
          headers: {
            // For demo purposes only - in production use environment variables
            // and server-side requests to protect your API key
            'Authorization': 'Client-ID YOUR_UNSPLASH_API_KEY'
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch images');
      
      const data = await response.json();
      
      // Map the results to our SimilarImage format
      const images: SimilarImage[] = data.results.map((photo: any) => ({
        id: photo.id,
        url: photo.urls.regular,
        thumbnailUrl: photo.urls.small,
        title: photo.description || category,
        author: photo.user.name,
        authorUrl: photo.user.links.html
      }));
      
      setLabelImages(prev => ({
        ...prev,
        [category]: images
      }));
      
      // If this was our active tab, make sure we stay on it
      if (activeTab === category) {
        setActiveTab(category);
      }
      
      toast({
        title: "Images Found",
        description: `Found ${images.length} images related to "${category}"`
      });
    } catch (error) {
      console.error("Error searching for images:", error);
      toast({
        title: "Search Failed",
        description: `Could not find images for "${category}"`,
        variant: "destructive"
      });
    } finally {
      setLoadingLabel(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analysis Results</h2>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabClick} className="w-full">
        <TabsList className="flex flex-wrap mb-6 h-auto p-1">
          {/* Standard tabs first */}
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
          
          {/* Dynamic label tabs */}
          {/* {displayLabels.map((label) => (
            <TabsTrigger 
              key={label} 
              value={label} 
              className="flex items-center gap-2 mt-1"
            >
              {loadingLabel === label ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              <span>{label}</span>
            </TabsTrigger>
          ))} */}
        </TabsList>
        
        {/* Standard content tabs */}
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
                <h3 className="text-lg font-medium mb-2">All Labels</h3>
                <div className="flex flex-wrap gap-2">
                  {displayLabels.map((tag, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setActiveTab(tag)}
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
                    onClick={() => setActiveTab(object)}
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
        
        {/* Dynamic content tabs for each label */}
        {displayLabels.map((label) => (
          <TabsContent key={label} value={label} className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Images for "{label}"</h3>
                <SimilarImagesGrid 
                  images={labelImages[label] || []}
                  isLoading={loadingLabel === label}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AnalysisTabs;