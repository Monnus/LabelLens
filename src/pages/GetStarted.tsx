
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import { SimilarImage } from "@/components/results/SimilarImagesGrid";
import ImageUploader from "@/components/upload/ImageUploader";
import Navbar from "@/components/shared/Navbar";
import PageHeader from "@/components/shared/PageHeader";
import AnalyzingIndicator from "@/components/analysis/AnalyzingIndicator";
import AnalysisTabs from "@/components/analysis/AnalysisTabs";
import ProcessSteps from "@/components/shared/ProcessSteps";
import ImagePreview from "@/components/upload/ImagePreview";
import UploadProgress from "@/components/upload/UploadProgress";
import AnalysisControls from "@/components/analysis/AnalysisControls";
import { useToast } from "@/hooks/use-toast";
import { UploadState } from "@/types/imageProcessing";
import { AlertCircle, RefreshCcw } from "lucide-react";

const GetStarted = () => {
  // State management
  const [processState, setProcessState] = useState<UploadState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ImageAnalysis | null>(null);
  const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);
  const { toast } = useToast();
  
  // API endpoint for analysis 
  const apiGatewayUrl = `https://v4gxql7uyk.execute-api.us-east-1.amazonaws.com/Dev/images`;

  // Handle image selection
  const handleImageSelected = (file: File) => {
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Reset states
    setProcessState('idle');
    setUploadProgress(0);
    setUploadError(null);
    setAnalysisError(null);
    setAnalysisResults(null);
    setSimilarImages([]);
  };

  // Handle preview URL creation
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image before uploading",
        variant: "destructive",
      });
      return;
    }

    setProcessState('uploading');
    setUploadProgress(0);
    setUploadError(null);

    // Simulate upload progress for demo
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    try {
      // This is where the actual upload to S3 would happen
      // Replace with actual AWS Amplify upload code
      
      // Simulate upload complete
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setProcessState('uploaded');
        
        toast({
          title: "Upload Successful",
          description: "Your image has been uploaded to S3 successfully"
        });
      }, 2000);

    } catch (error) {
      clearInterval(progressInterval);
      setUploadError("Upload failed. Please try again.");
      setProcessState('error');
      
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image",
        variant: "destructive",
      });
    }
  };

  // Handle analysis process
  const handleAnalyzeClick = async () => {
    if (!selectedFile) {
      toast({
        title: "Retrieval failed",
        description: "You either refreshed the browser or no image was uploaded",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setProcessState('analyzing');
    setAnalysisError(null);

    try {
      // Simulating API call to API Gateway
      const response = await fetchAnalysisWithRetry();
      
      if (!response) throw new Error("Failed to analyze image after multiple attempts");
      
      setAnalysisResults(response.analysis);
      setSimilarImages(response.similarImages);
      setProcessState('complete');
      
      toast({
        title: "Analysis Complete",
        description: "Your image has been analyzed successfully"
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      setAnalysisError("Analysis failed. Please try again.");
      
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your image",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Utility function to retry analysis with backoff
  const fetchAnalysisWithRetry = async (retries = 3, delay = 1000) => {
    // In a real implementation, this would call the API Gateway
    // For now, we'll simulate the API response using the analyzeImage service
    
    // Simulating a network request with potential failure
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate API response
      const { analyzeImage } = await import('@/services/imageAnalysisService');
      return await analyzeImage();
    } catch (error) {
      if (retries <= 0) throw error;
      
      // Wait for the specified delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry with one fewer retry and longer delay
      return fetchAnalysisWithRetry(retries - 1, delay * 1.5);
    }
  };

  // Reset the process
  const handleRestart = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setUploadError(null);
    setAnalysisError(null);
    setAnalysisResults(null);
    setSimilarImages([]);
    setIsAnalyzing(false);
    setProcessState('idle');
  };

  // Retry the upload process
  const handleRetryUpload = () => {
    setUploadError(null);
    handleImageUpload();
  };

  // Retry the analysis process
  const handleRetryAnalysis = () => {
    setAnalysisError(null);
    handleAnalyzeClick();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <PageHeader 
            title="Upload Your Image"
            description="Get detailed information about your image and discover similar images"
          />
          
          {/* Process Steps Indicator */}
          {selectedFile && (
            <ProcessSteps currentState={processState} />
          )}
          
          {/* Upload Section */}
          {processState === 'idle' && (
            <div className="mb-8">
              <ImageUploader 
                onImageSelected={handleImageSelected}   
                onImageUpload={handleImageUpload} 
              />
            </div>
          )}
          
          {/* Upload Progress & Preview Section */}
          {(processState === 'uploading' || processState === 'uploaded') && selectedFile && (
            <div className="space-y-6 mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Image Preview</h3>
                  {previewUrl && (
                    <ImagePreview 
                      previewUrl={previewUrl}
                      fileName={selectedFile.name}
                      fileSize={selectedFile.size}
                      onRemove={handleRestart}
                    />
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Upload Status</h3>
                  <Card>
                    <CardContent className="p-6">
                      <UploadProgress 
                        progress={uploadProgress} 
                        isComplete={processState === 'uploaded'} 
                        error={uploadError} 
                      />
                      
                      {uploadError ? (
                        <Button 
                          onClick={handleRetryUpload} 
                          variant="outline" 
                          className="w-full mt-4"
                        >
                          <RefreshCcw className="mr-2 h-4 w-4" /> Retry Upload
                        </Button>
                      ) : processState === 'uploaded' ? (
                        <div className="space-y-4 mt-4">
                          <p className="text-sm text-muted-foreground">
                            Your image has been uploaded successfully. You can now proceed to analyze it.
                          </p>
                          <AnalysisControls 
                            onAnalyze={handleAnalyzeClick} 
                            isAnalyzing={isAnalyzing}
                            hasError={false}
                          />
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
          
          {/* Analysis Section */}
          {processState === 'analyzing' && (
            <div className="mb-8">
              <AnalyzingIndicator 
                message="Analyzing your image..."
                submessage="Please wait while we process your image. This may take a few moments."
              />
            </div>
          )}
          
          {/* Error State for Analysis */}
          {analysisError && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>
                {analysisError}
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleRetryAnalysis}
                  className="mt-2"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> Retry Analysis
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Results Section */}
          {processState === 'complete' && analysisResults && previewUrl && (
            <AnalysisTabs 
              analysisResults={analysisResults}
              similarImages={similarImages}
              previewUrl={previewUrl}
            />
          )}
          
          {/* Restart Option */}
          {(processState === 'uploaded' || processState === 'complete' || processState === 'error') && (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={handleRestart}
              >
                Upload Another Image
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GetStarted;
