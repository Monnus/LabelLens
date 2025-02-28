import { useState, useEffect } from "react";
import ImageDisplay from "./ImageDisplay";
import { uploadData } from "aws-amplify/storage";
import ImageHistoryList from "../ImageHistory/ImageHistoryList";
import { useAuth } from "react-oidc-context";

export default function UpLoadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isUser, setIsUser] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    setIsUser(auth.isAuthenticated ? auth.user : null);
  }, [auth.isAuthenticated, auth.user]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const fileName = `${Date.now()}-${selectedFile.name}`;
    setUploadedFileName(fileName);

    try {
      const uploadProgress = await uploadData({
        path: `uploads/${fileName}`,
        data: selectedFile,
        options: {
          contentType: selectedFile.type,
          onProgress: (progress) => {
            console.log(`Progress: ${(progress.loaded / progress.total) * 100}%`);
          },
        },
      }).result;

      console.log("File uploaded successfully:", uploadProgress);
      setSuccess(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      setSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  // New Fetch Function to Get Results from API Gateway
  const fetchResults = async () => {
    // if (!uploadedFileName) {
    //   console.error("No uploaded file to fetch results for.");
    //   return;
    // }

    try {
      const apiGatewayUrl = `https://v4gxql7uyk.execute-api.us-east-1.amazonaws.com/Dev/images`;

      const response = await fetch(apiGatewayUrl, {
        method: "GET"
      });

      if (!response.ok) throw new Error(`Error fetching results: ${response.statusText}`);

      const data = await response.json();
      const parsedBody = JSON.parse(data.body); // This gives you the actual data
        setResults(parsedBody.latest); // Assuming you're focusing on the 'latest' key

      console.log("Fetched results:", parsedBody.latest);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const renderRecognitionResults = () =>
    results && (
      <div style={{
        marginTop: "24px",
        padding: "16px",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        width: "400px",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center"
      }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "12px" }}>
          Recognition Results
        </h3>
        <ul style={{ listStyleType: "none", padding: "0" }}>
          {results.Labels.map((label, index) => (
            <li key={index} style={{
              color: "#4a4a4a",
              fontSize: "1rem",
              padding: "8px 0",
              borderBottom: index !== results.Labels.length - 1 ? "1px solid #e0e0e0" : "none"
            }}>
              <span style={{ fontWeight: "500" }}>{label}</span> -{" "}
              <span style={{ color: "#2c7a7b" }}>
                {results.ConfidenceScores[index]?.toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  

  const renderUploadSection = () => (
    <div className="mt-6 p-4 bg-white shadow rounded-lg w-96 text-center mx-auto">
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        disabled={!selectedFile || uploading}
      >
        {uploading ? "Uploading..." : "Upload & Analyze"}
      </button>

      {/* New Fetch Results Button */}
      {success && (
        <>
          <p>File uploaded successfully!</p>
          <button
            onClick={fetchResults}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Fetch Results
          </button>
        </>
      )}
      
      {/* Display Image after file is selected */}
      {selectedFile && (
        <ImageDisplay
          uploadedImage={URL.createObjectURL(selectedFile)}
          relatedImages={["/path/to/related-image1.jpg", "/path/to/related-image2.jpg"]}
        />
      )}
    </div>
  );

  return (
    <div className="List&Uploads" style={{ display: "flex", width: "100vw", height: "100vh" }}>
      {!isUser ? (
        <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh" }}>
          <div className="flex-1 p-6">
            {renderUploadSection()}
            {renderRecognitionResults()}
          </div>
        </div>
      ) : (
        <>
          <div>
            <ImageHistoryList selectedFile={uploadedFileName} setResults={setResults} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh" }}>
            <div className="flex-1 p-6">
              {renderUploadSection()}
              {renderRecognitionResults()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
