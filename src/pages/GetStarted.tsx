
import { useState } from "react";
import ImageUploader from "@/components/upload/ImageUploader";
import ImageAnalysisResult, { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import SimilarImagesGrid, { SimilarImage } from "@/components/results/SimilarImagesGrid";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/shared/Navbar";
import { uploadData } from "aws-amplify/storage";
import { useToast } from "@/hooks/use-toast";
import { Image, Palette, Tag, Search, Grid, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const GetStarted = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [success, setSuccess] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ImageAnalysis | null>(null);
  const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);
  const [activeTab, setActiveTab] = useState("image");
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
    setActiveTab("image");
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image before uploading",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setIsAnalyzing(true);
    const fileName = `uploads/${Date.now()}-${selectedFile.name}`;
    setUploadedFileName(fileName);
    
    try {
      const uploadProgress = await uploadData({
        path: fileName,
        data: selectedFile,
        options: {
          contentType: selectedFile.type,
          onProgress: (progress) => {
            console.log(`Progress: ${(progress.transferredBytes / progress.totalBytes) * 100}%`);
          },
        },
      }).result;

      console.log("File uploaded successfully:", uploadProgress);
      setSuccess(true);
      toast({
        title: "Upload Successful",
        description: "Your image has been uploaded to S3 successfully",
      });
      
      // Simulate API call to AWS Gateway/Lambda for image analysis
      // In a real implementation, you would call your AWS API Gateway endpoint here
      await simulateImageAnalysis();
      
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  // Simulate image analysis - in real implementation, this would be replaced with an API call to AWS Gateway
  const simulateImageAnalysis = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis results
      const mockAnalysis: ImageAnalysis = {
        objects: ['person', 'tree', 'car', 'building', 'sky', 'road', 'traffic light'],
        colors: [
          { name: 'Blue', hex: '#4285F4', percentage: 45 },
          { name: 'Green', hex: '#34A853', percentage: 30 },
          { name: 'Gray', hex: '#9AA0A6', percentage: 15 },
          { name: 'Red', hex: '#EA4335', percentage: 10 }
        ],
        tags: ['outdoor', 'urban', 'daytime', 'architecture', 'street', 'city', 'modern', 'sunny', 'vehicle']
      };
      
      // Mock similar images
      const mockSimilarImages: SimilarImage[] = Array(6).fill(0).map((_, i) => ({
        id: `img-${i}`,
        url: `https://source.unsplash.com/random/300x300?sig=${i}`,
        thumbnailUrl: `https://source.unsplash.com/random/300x300?sig=${i}`,
        title: `Similar Image ${i + 1}`,
        author: `Author ${i + 1}`,
        authorUrl: `https://unsplash.com/@author${i}`
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
  
  const handleTabClick = (value: string) => {
    setActiveTab(value);
  };
  
  const handleSearchMore = (category: string) => {
    console.log(`Searching for more images with category: ${category}`);
    // Here you would integrate with an API like Unsplash to find more similar images
    // For example: searchUnsplashImages(category);
    
    toast({
      title: "Search Initiated",
      description: `Searching for more images related to "${category}"`
    });
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
          
          {(analysisResults && previewUrl && !isAnalyzing) && (
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
          )}
        </div>
      </main>
    </div>
  );
};

export default GetStarted;
