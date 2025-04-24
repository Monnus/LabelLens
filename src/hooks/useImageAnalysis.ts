
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadData } from "aws-amplify/storage";
import { saveHistoryItem, fetchImageAnalysis } from "@/services/imageAnalysisService";
import type { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import type { SimilarImage } from "@/components/results/SimilarImagesGrid";
import type { HistoryItem } from "@/types/imageProcessing";

export const useImageAnalysis = (userId: string, authToken: string) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<ImageAnalysis | null>(null);
  const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const { toast } = useToast();

  const handleImageSelected = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    setAnalysisResults(null);
    setSimilarImages([]);
    setLabels([]);
    setUploadedFileName(null);
  };

  const uploadImageToS3 = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const uploadResult = await uploadData({
        path: `uploads/auth/${fileName}`,
        data: file,
        options: {
          contentType: file.type,
          onProgress: (progress) => {
            // log here(`Upload progress: ${(progress.transferredBytes / progress.totalBytes) * 100}%`);
          },
        },
      }).result;
      
      const newHistoryItem: HistoryItem = {
        id: fileName,
        name: fileName,
        date: new Date().toLocaleDateString(),
        thumbnail: previewUrl || "/placeholder.svg",
        userId
      };
      
      saveHistoryItem(newHistoryItem);
      
      toast({
        title: "Upload Complete",
        description: "Your image has been uploaded successfully. Starting analysis..."
      });
      
      return fileName;
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

  const fetchResults = async (fileName: string, authToken:string) => {
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const { analysis, similarImages, labels } = await fetchImageAnalysis(fileName,authToken);
      // log here("fileName useImageAnalysis.ts", fileName);
      
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

  const handleHistoryItemSelect = async (id: string, authToken: string) => {
    setIsAnalyzing(true);
    try {
      const { analysis, similarImages, labels } = await fetchImageAnalysis(id, authToken);
      setAnalysisResults(analysis);
      setSimilarImages(similarImages);
      setLabels(labels);
      
      // toast({
      //   title: "Image Loaded",
      //   description: `Successfully loaded ${id}`
      // });
    } catch (error) {
      console.error("Error loading image:", error);
      toast({
        title: "Error",
        description: "Could not load the selected image",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileName = await uploadImageToS3(file);
      setUploadedFileName(fileName);
      await fetchResults(fileName, authToken);
    } catch (error) {
      console.error("Error in upload/analysis process:", error);
    }
  };

  return {
    selectedFile,
    previewUrl,
    isUploading,
    isAnalyzing,
    analysisResults,
    similarImages,
    labels,
    handleImageSelected,
    handleImageUpload,
    handleHistoryItemSelect,
    setPreviewUrl
  };
};