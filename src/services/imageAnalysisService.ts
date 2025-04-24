import { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import { SimilarImage } from "@/components/results/SimilarImagesGrid";
import { HistoryItem } from "@/types/imageProcessing";

// API Gateway URL
const API_GATEWAY_URL:string = import.meta.env.VITE_API_URL;

// Session storage key for history
const HISTORY_STORAGE_KEY = "image-insight-history";

// Parse AWS API Gateway response based on the provided format
export const parseApiGatewayResponse = (responseData: any): { 
  analysis: ImageAnalysis; 
  labels: string[];
} => {
  try {
    // Handle different response formats
    let data = responseData;
    
    // If it's a string, parse it
    if (typeof responseData === 'string') {
      data = JSON.parse(responseData);
    }
    
    // If it has a body property that's a string, parse that too
    if (data.body && typeof data.body === 'string') {
      data = JSON.parse(data.body);
    }
    
    // Handle case where data might be under 'latest' or direct
    const apiData = data.latest || data;

    
    // Extract labels from the response
    const labels = apiData.Labels || [];
    const confidenceScores = apiData.ConfidenceScores || [];
    // log here("data", apiData)
    // Map confidence scores to labels
    const objectsWithConfidence = labels.map((label: string, index: number) => {
      return {
        name: label,
        confidence: confidenceScores[index] || 0
      };
    });
    
    // Sort by confidence in descending order
    objectsWithConfidence.sort((a, b) => b.confidence - a.confidence);
    
    // Create mock color data since it's not in the API response
    const mockColors = [
      { name: 'Blue', hex: '#4285F4', percentage: 45 },
      { name: 'Green', hex: '#34A853', percentage: 30 },
      { name: 'Gray', hex: '#9AA0A6', percentage: 15 },
      { name: 'Red', hex: '#EA4335', percentage: 10 }
    ];
    
    // Create the analysis object
    const analysis: ImageAnalysis = {
      objects: labels,
      confidence: objectsWithConfidence.map(obj => ({
        label: obj.name,
        score: obj.confidence
      })),
      colors: mockColors,
      tags: labels,
      timestamp: apiData.Timestamp,
      imageUrl: apiData.ImageURL
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

// Fetch image analysis from API Gateway with the correct response format
export const fetchImageAnalysis = async (imageName: string, authToken: string = "") => {
  // log here("Fetching analysis for image:", imageName);
  // log here("Using auth token:", authToken);

  // If an auth token is present, try calling the real API
  if (authToken) {
    const apiUrl = `${API_GATEWAY_URL}/${imageName}`;
    // log here("Fetching from API:", apiUrl);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 6000)); // wait 6s
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const responseText = await response.text();
      // log here("Raw API response:", responseText);

      const responseData = JSON.parse(responseText);
      // log here("Parsed API response:", responseData);

      const { analysis, labels } = parseApiGatewayResponse(responseData);
      // log here("analysis", analysis, "labels", labels);

      const similarImages: SimilarImage[] = labels.slice(0, 4).map((label, i) => ({
        id: `${label}-${i}`,
        url: `https://source.unsplash.com/random/300x300?${encodeURIComponent(label)}&sig=${i}`,
        thumbnailUrl: `https://source.unsplash.com/random/300x300?${encodeURIComponent(label)}&sig=${i}`,
        title: label,
        author: "Unsplash",
        authorUrl: "https://unsplash.com"
      }));

      // return // log here("analysis,similarImages,labels",analysis, similarImages,labels)
      return {analysis,similarImages,labels};
     
    } catch (error) {
      console.error("Fetch or parse error:", error);
      // Fall through to return mock data
    }
  }

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

