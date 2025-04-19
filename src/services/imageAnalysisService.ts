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
    console.log("data", apiData)
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

  console.log("Fetching analysis for image:", imageName);
  console.log("Using auth token:", authToken );
  
  try {
    // Only make the API call if we have an auth token
    if (authToken) {
      const apiUrl = `${API_GATEWAY_URL}/${imageName}`;
      console.log("Fetching from API:", apiUrl);
      
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization':`Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const responseText = await response.text();
        console.log("Raw API response:", responseText);
        
        try {
          // Try to parse the response as JSON
          const responseData = JSON.parse(responseText);
          console.log("Parsed API response:", responseData);
          
          // Parse the response data using our utility function
          const { analysis, labels } = parseApiGatewayResponse(responseData);
          
          // Generate mock similar images based on the labels
          const similarImages: SimilarImage[] = labels.slice(0, 4).map((label, i) => ({
            id: `${label}-${i}`,
            url: `https://source.unsplash.com/random/300x300?${encodeURIComponent(label)}&sig=${i}`,
            thumbnailUrl: `https://source.unsplash.com/random/300x300?${encodeURIComponent(label)}&sig=${i}`,
            title: `${label}`,
            author: `Unsplash`,
            authorUrl: `https://unsplash.com`
          }));
          
          return {
            analysis,
            similarImages,
            labels
          };
        } catch (parseError) {
          console.error("Error parsing API response:", parseError);
          throw new Error("Invalid response format from API");
        }
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        throw fetchError;
      }
    }
    
    // If we don't have an auth token or the API call failed, return mock data
    console.log("Returning mock analysis data based on camera example");
    
    // Using the provided example data structure
    const mockApiResponse = {
      Timestamp: "2025-02-15T09:26:12.062Z",
      ImageID: "1739611571421_camera.jpg",
      Labels: [
        "Camera",
        "Digital Camera",
        "Electronics",
        "Photography",
        "Speaker",
        "Video Camera"
      ],
      ConfidenceScores: [
        72.07,
        75.18,
        99.84,
        71.02,
        99.93,
        85.64
      ],
      ImageURL: "https://image-recognizer-bucket.s3.amazonaws.com/uploads/camera.jpg"
    };
    
    const { analysis, labels } = parseApiGatewayResponse(mockApiResponse);
    
    // Mock similar images based on the labels
    const similarImages = labels.slice(0, 4).map((label, i) => ({
      id: `${label}-${i}`,
      url: `https://source.unsplash.com/random/300x300?${encodeURIComponent(label)}&sig=${i}`,
      thumbnailUrl: `https://source.unsplash.com/random/300x300?${encodeURIComponent(label)}&sig=${i}`,
      title: `${label}`,
      author: `Unsplash`,
      authorUrl: `https://unsplash.com`
    }));
    
    return {
      analysis,
      similarImages,
      labels
    };
  } catch (error) {
    console.error("Error in fetchImageAnalysis:", error);
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