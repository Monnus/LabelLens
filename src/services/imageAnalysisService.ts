import { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import { SimilarImage } from "@/components/results/SimilarImagesGrid";
import { HistoryItem } from "@/types/imageProcessing";

// API Gateway URL
const API_GATEWAY_URL = "https://v4gxql7uyk.execute-api.us-east-1.amazonaws.com/Dev/images/";

// Session storage key for history
const HISTORY_STORAGE_KEY = "image-insight-history";

// Parse AWS API Gateway response and extract labels
export const parseApiGatewayResponse = (responseData: any): { 
  analysis: ImageAnalysis; 
  labels: string[];
} => {
  try {
    // If the response is already parsed, use it directly
    const data = typeof responseData.body === 'string' 
      ? JSON.parse(responseData.body) 
      : responseData.body;
    
    // Extract the labels array
    const latest = data.latest || {};
    const labels = latest.Labels || [];
    
    // Create a mock analysis result using the labels
    const analysis: ImageAnalysis = {
      objects: labels.slice(), // Clone the array
      colors: [
        { name: 'Blue', hex: '#4285F4', percentage: 45 },
        { name: 'Green', hex: '#34A853', percentage: 30 },
        { name: 'Gray', hex: '#9AA0A6', percentage: 15 },
        { name: 'Red', hex: '#EA4335', percentage: 10 }
      ],
      tags: labels.slice() // Clone the array
    };
    
    return {
      analysis,
      labels
    };
  } catch (error) {
    console.error("Error parsing API Gateway response:", error);
    return {
      analysis: {
        objects: [],
        colors: [],
        tags: []
      },
      labels: []
    };
  }
};

// Get history items from session storage for a specific user
export const getHistoryItems = (userId: string): HistoryItem[] => {
  try {
    const historyString = sessionStorage.getItem(HISTORY_STORAGE_KEY);
    if (!historyString) return [];
    
    const history = JSON.parse(historyString) as HistoryItem[];
    return history.filter(item => item.userId === userId);
  } catch (error) {
    console.error("Error getting history from session storage:", error);
    return [];
  }
};

// Save a history item to session storage
export const saveHistoryItem = (item: HistoryItem): void => {
  try {
    const existingHistory = getHistoryItems(item.userId);
    
    // Check if this item already exists (by id)
    const itemExists = existingHistory.some(historyItem => historyItem.id === item.id);
    
    if (!itemExists) {
      const newHistory = [item, ...existingHistory];
      sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
    }
  } catch (error) {
    console.error("Error saving history to session storage:", error);
  }
};

// Extract image name from S3 path
export const extractImageName = (s3Path: string): string => {
  // Example: "uploads/1646123456789-image.jpg" -> "1646123456789-image.jpg"
  const parts = s3Path.split('/');
  return parts[parts.length - 1];
};

// Fetch image analysis from API Gateway
export const fetchImageAnalysis = async (imageName: string): Promise<{
  analysis: ImageAnalysis;
  similarImages: SimilarImage[];
  labels: string[];
}> => {
  try {
    const response = await fetch(`${API_GATEWAY_URL}${imageName}`);
    if (!response.ok) {
      throw new Error(`API Gateway error: ${response.status}`);
    }
    
    const responseData = await response.json();
    const { analysis, labels } = parseApiGatewayResponse(responseData);
    
    // For similar images, we'll use the first label to fetch images
    const firstLabel = labels[0] || "image";
    const similarImages = await fetchImagesForLabel(firstLabel);
    
    return {
      analysis,
      similarImages,
      labels
    };
  } catch (error) {
    console.error("Error fetching image analysis:", error);
    throw error;
  }
};

// Simulate image analysis - in real implementation, this would call AWS API Gateway
export const analyzeImage = async (): Promise<{
  analysis: ImageAnalysis;
  similarImages: SimilarImage[];
  labels: string[];
}> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Sample response from API Gateway
  const mockApiResponse = {
    statusCode: 200,
    body: JSON.stringify({
      latest: {
        Timestamp: "2025-03-16T21:04:27.014Z",
        ImageID: "1742159056388-bags andd bags.jpg",
        Labels: ["Accessories", "Backpack", "Bag", "Clothing", "Coat", "Handbag", "Lifejacket", "Vest"],
        ConfidenceScores: [80.58, 98.95, 88.58, 85.74, 99.58, 89.17],
        ImageURL: "https://image-rekognition-bucketf163b-dev.s3.amazonaws.com/uploads/1742159056388-bags andd bags.jpg"
      }
    })
  };
  
  // Parse the response
  const { analysis, labels } = parseApiGatewayResponse(mockApiResponse);
  
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
    analysis,
    similarImages: mockSimilarImages,
    labels
  };
};

// Function to fetch images from Unsplash based on a label
export const fetchImagesForLabel = async (label: string): Promise<SimilarImage[]> => {
  // In a real implementation, you would call the Unsplash API
  // For demo purposes, we'll simulate a response
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return Array(9).fill(0).map((_, i) => ({
    id: `${label}-${i}`,
    url: `https://source.unsplash.com/random/300x300?${label}&sig=${i}`,
    thumbnailUrl: `https://source.unsplash.com/random/300x300?${label}&sig=${i}`,
    title: `${label} Image ${i + 1}`,
    author: `Unsplash Author ${i + 1}`,
    authorUrl: `https://unsplash.com/@author${i}`
  }));
};