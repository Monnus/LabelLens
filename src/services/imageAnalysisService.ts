
import { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import { SimilarImage } from "@/components/results/SimilarImagesGrid";

// Simulate image analysis - in real implementation, this would call AWS API Gateway
export const analyzeImage = async (): Promise<{
  analysis: ImageAnalysis;
  similarImages: SimilarImage[];
}> => {
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
  
  return {
    analysis: mockAnalysis,
    similarImages: mockSimilarImages
  };
};
