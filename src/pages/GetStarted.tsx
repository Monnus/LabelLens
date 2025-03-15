
import { useState } from "react";
import ImageUploader from "@/components/upload/ImageUploader";
import { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import { SimilarImage } from "@/components/results/SimilarImagesGrid";
import Navbar from "@/components/shared/Navbar";
import PageHeader from "@/components/shared/PageHeader";
import AnalyzingIndicator from "@/components/analysis/AnalyzingIndicator";
import AnalysisTabs from "@/components/analysis/AnalysisTabs";
import { useToast } from "@/hooks/use-toast";
import { analyzeImage } from "@/services/imageAnalysisService";

const GetStarted = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [success, setSuccess] = useState(false);
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
      // Placeholder for AWS S3 upload - you can replace this with your actual code
      console.log("Simulating upload of file:", fileName);
      
      // Simulate successful upload
      setSuccess(true);
      toast({
        title: "Upload Successful",
        description: "Your image has been uploaded to S3 successfully",
      });
      
      // Call image analysis service
      const results = await analyzeImage();
      setAnalysisResults(results.analysis);
      setSimilarImages(results.similarImages);
      
      toast({
        title: "Analysis Complete",
        description: "Your image has been analyzed successfully"
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setIsAnalyzing(false);
    }
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
          
          <div className="mb-12">
            <ImageUploader 
              onImageSelected={handleImageSelected}
              onImageUpload={handleImageUpload} 
            />
          </div>
          
          {isAnalyzing && <AnalyzingIndicator />}
          
          {(analysisResults && previewUrl && !isAnalyzing) && (
            <AnalysisTabs 
              analysisResults={analysisResults}
              similarImages={similarImages}
              previewUrl={previewUrl}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default GetStarted;
