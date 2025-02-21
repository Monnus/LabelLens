import { useState,useEffect } from "react";
import ImageDisplay from "./ImageDisplay";
import { uploadData } from "aws-amplify/storage";
import ImageHistoryList from "../ImageHistory/ImageHistoryList";
import { useAuth } from "react-oidc-context";
  

export default function UpLoadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
    const [results, setResults] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [UploadILeNameExtention, setUploadILeNameExtention] = useState("");
  const [isUser, setUser]=useState(false);
  const auth=useAuth();
  console.log("Auth logged", auth);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setUser(auth.user);
    } else {
      setUser(null);
    }
  }, [auth.isAuthenticated, auth.user]);



  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };




  const handleUpload = async () => {
    if (!selectedFile) return;
    const onProgress = (progress) => {
      console.log(`Progress: ${(progress.loaded / progress.total) * 100}%`);
    };
    setUploadILeNameExtention(`${Date.now()}-${selectedFile.name}`);
    // const apiGatewayUrl = `https://v4gxql7uyk.execute-api.us-east-1.amazonaws.com/Dev/images/${UploadILeNameExtention}`;
    // ==========================================================
    setUploading(true);
    try {
      const uploadProgress = await uploadData({
        path: `uploads/${UploadILeNameExtention}`,
        data: selectedFile,
        options: {
          contentType: selectedFile.type,
          onProgress, // Optional progress callback.
        },
      }).result;

      console.log("File uploaded successfully:", uploadProgress);
      console.log("UploadILeNameExtention", UploadILeNameExtention);

      setSuccess(true);

     
      //   const response = await fetch(apiGatewayUrl, {
      //     method: "POST",
      //     body: JSON.stringify({ fileName }),
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   });

      //   const data = await response.json();
      //   setResults(data);
      //   console.log('====================================');
      //   console.log("uploadProgress", uploadProgress);
      //   console.log('====================================');
    } catch (error) {
      console.error("Error uploading file:", error);
      setSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const returnVersion1Front = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          height: "100vh",
        }}
      >
        {/* Main content: file upload, image display, and results */}
        <div className="flex-1 p-6">
          {/* Upload Section */}
          <div className="mt-6 p-4 bg-white shadow rounded-lg w-96 text-center mx-auto" >
            <input type="file" onChange={handleFileChange} className="mb-4" />
            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              disabled={!selectedFile || uploading}
            >
              {uploading ? "Uploading..." : "Upload & Analyze"}
            </button>
            {success && <p>File uploaded successfully!</p>}
            <br />

            {/* Display Image after file is selected */}
            {selectedFile && (
              <ImageDisplay
                uploadedImage={URL.createObjectURL(selectedFile)} // Convert file to URL
                relatedImages={[
                  "/path/to/related-image1.jpg",
                  "/path/to/related-image2.jpg",
                ]}
              />
            )}
          </div>
          {/* Recognition Results */}
          {results && (
            <div className="mt-6 p-4 bg-white shadow rounded-lg w-96 mx-auto">
              <h3 className="text-lg font-semibold mb-2">Recognition Results</h3>
              <ul>
                {results.labels.map((label, index) => (
                  <li key={index} className="text-gray-700">
                    {label} - {results.confidenceScores[index]}%
                  </li>
                ))}
              </ul>
            </div>
          )} 
        </div>
      </div>
    );
  };
  const returnVersion2Front = () => {
    return (
        <>
      <div>
        <ImageHistoryList selectedFile={UploadILeNameExtention} setResults={setResults}/>
      </div>
      {returnVersion1Front()}</>
    );
  };
// below are JSX thats going to front-end
  return (
    <div
    className="List&Uploads"
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
      }}
    >
{!isUser ? returnVersion1Front() : returnVersion2Front()}
    </div>
  );
}
