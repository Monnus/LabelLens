import { useState } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import ImageUploader from "@/components/upload/ImageUploader";
import ImageAnalysisResult, { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import SimilarImagesGrid, { SimilarImage } from "@/components/results/SimilarImagesGrid";
import { useToast } from "@/hooks/use-toast";
import { analyzeImage, getHistoryItems, saveHistoryItem } from "@/services/imageAnalysisService";
import { HistoryItem } from "@/types/imageProcessing";
import AnalyzingIndicator from "@/components/analysis/AnalyzingIndicator";
import { AuthProps } from "@/types/AuthProps";
import { uploadData } from "aws-amplify/storage";

const DashboardUpload: React.FC<AuthProps> = ({ auth }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<ImageAnalysis | null>(null);
  const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const { toast } = useToast();

  // Get user ID from auth context
  const userId = auth.isAuthenticated 
    ? auth.user.profile.preferred_username 
    : "";
    const s3_bucket:string =  import.meta.env.VITE_S3_BUCKET;

  // Load history items
  const historyItems = getHistoryItems(userId);
  
  // Handle history item selection (empty function for now)
  const handleHistoryItemSelect = (id: string, authToken: string) => {
    console.log("DashboardUpload: History item selected", id);
    console.log("Auth token available:", authToken ? "Yes" : "No");
  };

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
    setLabels([]);
    setUploadedFileName(null);
  };

  // Step 1: Upload the image to S3
  const uploadImageToS3 = async (file: File): Promise<string> => {
    if (!auth.isAuthenticated) {
      throw new Error("Authentication required");
    }

    setIsUploading(true);
    
    try {
      // In a real implementation, this would upload to S3 using AWS Amplify
      const fileNameANDs3Url = `${s3_bucket}auth/${Date.now()}-${selectedFile.name}`;

      console.log("Starting S3 upload for file:", fileNameANDs3Url);
      
      // Actual S3 upload using Amplify
      const uploadResult = await uploadData({
        path: fileNameANDs3Url,
        data: selectedFile,
        options: {
          contentType: selectedFile.type,
          onProgress: (progress) => {
            console.log(`Upload progress: ${(progress.transferredBytes / progress.totalBytes) * 100}%`);
          },
        },
      }).result;
      
      console.log("Upload complete:", uploadResult);
      
      // After successful upload, save to history
      const newHistoryItem: HistoryItem = {
        id: `${fileNameANDs3Url}`,  // Using filename as ID for simplicity
        name: `${fileNameANDs3Url}`,
        date: new Date().toLocaleDateString(),
        thumbnail: previewUrl || "/placeholder.svg",
        userId
      };
      
      saveHistoryItem(newHistoryItem);
      
      toast({
        title: "Upload Complete",
        description: "Your image has been uploaded successfully. Starting analysis..."
      });
      
      return fileNameANDs3Url;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Step 2: Fetch the analysis results
  const fetchAnalysisResults = async (fileName: string) => {
    setIsAnalyzing(true);
    
    try {
      console.log("Starting analysis for file:", fileName);
      
      // Simulate waiting for the backend to process the image
      // In a real implementation, you might poll an endpoint or use WebSockets
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Now fetch the analysis results using the auth token
      const authToken = auth.user?.id_token || "";
      const { analysis, similarImages, labels } = await analyzeImage();
      
      console.log("Analysis complete:", analysis);
      
      setAnalysisResults(analysis);
      setSimilarImages(similarImages);
      setLabels(labels);
      
      toast({
        title: "Analysis Complete",
        description: "Your image has been analyzed successfully"
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your image",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Main handler that coordinates the upload and analysis process
  const handleImageUpload = async (file: File) => {
    if (!auth.isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload and analyze images",
        variant: "destructive"
      });
      return;
    }

    try {
      // Step 1: Upload to S3
      const fileName = await uploadImageToS3(file);
      setUploadedFileName(fileName);
      
      // Step 2: Fetch analysis results
      await fetchAnalysisResults(fileName);
    } catch (error) {
      console.error("Error in upload/analysis process:", error);
      // Error handling already done in the individual functions
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <DashboardSidebar 
          historyItems={historyItems}
          onHistoryItemSelect={handleHistoryItemSelect} 
          authIDToken={auth.user?.id_token || ""}
        />
        
        <SidebarInset>
          <div className="flex flex-col h-full">
            <header className="border-b p-4 flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Upload New Image</h1>
              {auth.isAuthenticated && (
                <span className="text-sm text-muted-foreground ml-2">
                  Logged in as {auth.user.profile.preferred_username}
                </span>
              )}
            </header>
            
            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto space-y-10">
                <div className="mb-8">
                  <ImageUploader 
                    onImageSelected={handleImageSelected}
                    onImageUpload={handleImageUpload}
                  />
                </div>
                
                {(isUploading || isAnalyzing) && (
                  <AnalyzingIndicator 
                    message={isUploading ? "Uploading your image..." : "Analyzing your image..."}
                    submessage={isUploading ? "Uploading to secure storage" : "This may take a few moments"}
                  />
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
                        isLoading={isUploading || isAnalyzing}
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