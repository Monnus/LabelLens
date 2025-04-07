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
import { parseApiGatewayResponse } from "@/services/imageAnalysisService";
import { uploadData } from "aws-amplify/storage";

const GetStarted = () => {
  // State management
  const [processState, setProcessState] = useState<UploadState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ImageAnalysis | null>(undefined);
  const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const { toast } = useToast();
  
  // API endpoint for analysis 
  const apiGatewayUrl = `https://v4gxql7uyk.execute-api.us-east-1.amazonaws.com/Dev/images`;

  // Handle image selection
  const handleImageSelected = (file: File) => {
    // setSelectedFile(file);
    
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
   handleAnalyzeClick();

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

    try {

       // This would be where we'd use AWS Amplify in a real implementation
       const fileName = `uploads/${Date.now()}-${selectedFile.name}`;
       const uploadResult = await uploadData({
         path: fileName,
         data: selectedFile,
         options: {
           contentType: selectedFile.type,
           onProgress: (progress) => {
             setUploadProgress((progress.transferredBytes / progress.totalBytes) * 100);
           },
         },
       }).result;
       console.log("file uploaded to S3", uploadResult);
       setProcessState('uploaded');
    
    } catch (error) {
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
  
    fetch(apiGatewayUrl, {
      method: "GET"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching results: ${response.statusText}`);
        }
        return response.json();  // Return the parsed JSON response
      })
      .then((data) => {
        const parsedBody = data.latest;  // Parse the actual body from the response
  
        // Log fetched data for debugging
        console.log("Fetched const data:", data);
        console.log("Fetched const parsedBody:", parsedBody);
  
        // Set the analysis results, labels, and similar images
        setLabels(parsedBody.Labels || []);
        setAnalysisResults(parsedBody);
        setPreviewUrl(parsedBody.ImageURL)
        // setSimilarImages(parsedBody.similarImages);
        setProcessState('complete');
        // console.log("Labels", parsedBody.latest);

  
        // Show success toast
        toast({
          title: "Analysis Complete",
          description: `Found ${parsedBody.Labels.length} labels in your image`
        });
      })
      .catch((error) => {
        console.error("Error analyzing image:", error);
        setAnalysisError("Analysis failed. Please try again.");
  
        toast({
          title: "Analysis Failed",
          description: "There was an error analyzing your image",
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsAnalyzing(false);
      });
  };
  

  // Utility function to retry analysis with backoff
  const fetchAnalysisWithRetry = async (retries = 3, delay = 1000) => {
    try {
      // Attempt to make the API call
      const response = await fetch(apiGatewayUrl, {
        method: "GET",
       
      }).then((res) => {
        if (!res.ok) {
          // If the response is not ok, throw an error
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        // Log the response object for debugging
        const data= res.json();
        console.log("data", data);
        return data // Assuming the response is in JSON format
      })
      .then((data) => {
        // Once we get the parsed JSON data, we can work with it
        console.log("Response data:", data);
        // Process your data here as needed
       const parsedBody=data.latest;

        setLabels(parsedBody?.Labels || []);
        setAnalysisResults(parsedBody);
        // setSimilarImages(parsedBody?.);
        setProcessState('complete');
        setAnalysisError(null);
        return parsedBody;
      })
  
return response;
}catch(error){
console.log(error);
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
                  onClick={handleRestart}
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
              labels={labels}
            />
          )}
          
          {/* Restart Option */}
          {(processState === 'uploaded' || processState === 'complete' || processState === 'error') && (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={()=>handleAnalyzeClick()}
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