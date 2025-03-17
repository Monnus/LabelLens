import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/upload/ImageUploader";
import { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
import { SimilarImage } from "@/components/results/SimilarImagesGrid";
import Navbar from "@/components/shared/Navbar";
import PageHeader from "@/components/shared/PageHeader";
import AnalyzingIndicator from "@/components/analysis/AnalyzingIndicator";
import AnalysisTabs from "@/components/analysis/AnalysisTabs";
import { useToast } from "@/hooks/use-toast";

const GetStarted = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ImageAnalysis | null>(null);
  const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);
  const { toast } = useToast();
  const apiGatewayUrl = `https://v4gxql7uyk.execute-api.us-east-1.amazonaws.com/Dev/images`;

  // 🛠️ Handle file selection
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

  // 🛠️ Handle image preview updates
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);


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
    
        try{
    
        } catch (error) {
          toast({
            title: "Upload Failed",
            description: "There was an error uploading your image",
            variant: "destructive",
          });
        } finally {
          // setUploading(false);
          // setIsAnalyzing(false);
        }
      };

    
  const handleAnalyzeClick = async () => {
    if(!selectedFile) return toast({
      title: "Retrieve failed",
      description:"You either refreshed the browser",
      variant:"destructive"
    });

    setIsAnalyzing(true);
    try {
      const response = await fetch(apiGatewayUrl,{
        method: "GET"
      });
      if (!response.ok) throw new Error(`Error fetching results: ${response.statusText}`);

      const data = await response.json();
      const parsedBody = JSON.parse(data.body); // This gives you the actual data
      console.log("Fetched results:", parsedBody.latest);
      setAnalysisResults(data);

    } catch (error) {
      console.error("Error fetching analysis:", error);
    } finally {
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
          {!uploading ?
         ( <div className="mb-12">
            <ImageUploader 
              onImageSelected={handleImageSelected}   onImageUpload={handleImageUpload} 
              />
          </div>)
           : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
             <img src={previewUrl} alt="Uploaded" style={{ maxWidth: "100%", height: "auto" }} />           
              {isAnalyzing && <AnalyzingIndicator />}
              <Button variant="secondary" size="default" onClick={handleAnalyzeClick} style={{ marginTop: "10px", padding: "10px" }}>
                Fetch Image Analyzed data
            </Button>
          </div>
        
        )}
          
          
          
          {/* {(analysisResults && previewUrl && !isAnalyzing) && (
            <AnalysisTabs 
              analysisResults={analysisResults}
              similarImages={similarImages}
              previewUrl={previewUrl}
            />
          )} */}
        </div>
      </main>
    </div>
  );
};

export default GetStarted;

   

// import { useState } from "react";
// import ImageUploader from "@/components/upload/ImageUploader";
// import { ImageAnalysis } from "@/components/results/ImageAnalysisResult";
// import { SimilarImage } from "@/components/results/SimilarImagesGrid";
// import Navbar from "@/components/shared/Navbar";
// import PageHeader from "@/components/shared/PageHeader";
// import AnalyzingIndicator from "@/components/analysis/AnalyzingIndicator";
// import AnalysisTabs from "@/components/analysis/AnalysisTabs";
// import { useToast } from "@/hooks/use-toast";
// import { analyzeImage } from "@/services/imageAnalysisService";

// const GetStarted = () => {
//   const [uploading, setUploading] = useState<boolean>(true);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [analysisResults, setAnalysisResults] = useState<ImageAnalysis | null>(null);
//   const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);
//   const { toast } = useToast();
//   const apiGatewayUrl= `https://v4gxql7uyk.execute-api.us-east-1.amazonaws.com/Dev/images`;


//   const handleImageSelected = (file: File) => {
//     setSelectedFile(file);
    
//     // Create preview URL
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setPreviewUrl(e.target?.result as string);
//     };
//     reader.readAsDataURL(file);
    
//     // Reset results
//     setAnalysisResults(null);
//     setSimilarImages([]);
//   };

//   const handleImageUpload = async () => {
//     if (!selectedFile) {
//       toast({
//         title: "No Image Selected",
//         description: "Please select an image before uploading",
//         variant: "destructive",
//       });
//       return;
//     }

//     setUploading(true);
//     try{

//     } catch (error) {
//       toast({
//         title: "Upload Failed",
//         description: "There was an error uploading your image",
//         variant: "destructive",
//       });
//     } finally {
//       setUploading(false);
//       setIsAnalyzing(false);
//     }
//   };
//   //Calls fetch to dynamodb AWS
//   const handleAnalyzeClick = async () => {
//     setIsAnalyzing(true);
//     try {
//       const response = await fetch(apiGatewayUrl);
//       const data = await response.json();
//       setAnalysisResults(data);
//     } catch (error) {
//       console.error('Error fetching analysis:', error);
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
      
//       <main className="container py-8">
//         <div className="max-w-4xl mx-auto">
//           <PageHeader 
//             title="Upload Your Image"
//             description="Get detailed information about your image and discover similar images"
//           />
//           {!uploading ?
//          ( <div className="mb-12">
//             <ImageUploader 
//               onImageSelected={handleImageSelected}
//               onImageUpload={handleImageUpload} 
//               />
//           </div>)
//            : (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>             
//                <img src={URL.createObjectURL(selectedFile)} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
//                {isAnalyzing && <AnalyzingIndicator />}
//                <button onClick={handleAnalyzeClick} style={{ marginTop: '10px', padding: '10px' }}>Analyze</button>
//          </div>)}
          
          
          
//           {/* {(analysisResults && previewUrl && !isAnalyzing) && (
//             <AnalysisTabs 
//               analysisResults={analysisResults}
//               similarImages={similarImages}
//               previewUrl={previewUrl}
//             />
//           )} */}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default GetStarted;
