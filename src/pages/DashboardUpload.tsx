import { useState } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import ImageUploader from "@/components/upload/ImageUploader";
import AnalysisResults from "@/components/upload/AnalysisResults";
import { useToast } from "@/hooks/use-toast";
import { getHistoryItems } from "@/services/imageAnalysisService";
import AnalyzingIndicator from "@/components/analysis/AnalyzingIndicator";
import { AuthProps } from "@/types/AuthProps";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";

const DashboardUpload: React.FC<AuthProps> = ({ auth }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(undefined);
  const userId = auth.isAuthenticated ? auth.user.profile.preferred_username : "";
  const historyItems = getHistoryItems(userId);
  console.log("auth", auth);
  
  const {
    previewUrl,
    isUploading,
    isAnalyzing,
    analysisResults,
    similarImages,
    labels,
    handleImageSelected,
    handleImageUpload,
    handleHistoryItemSelect
  } = useImageAnalysis(userId, auth.user?.id_token || "");

  // Wrapper for history item selection
  const onHistoryItemSelect = (id: string, authToken: string) => {
    setSelectedItemId(id);
    handleHistoryItemSelect(id, authToken);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <DashboardSidebar 
          historyItems={historyItems}
          onHistoryItemSelect={onHistoryItemSelect} 
          authIDToken={auth.user?.id_token || ""}
          selectedItemId={selectedItemId}
        />
        
        <SidebarInset>
          <div className="flex flex-col h-full">
            <header className="border-b p-4 flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Upload New Image</h1>
              {auth.isAuthenticated && (
                <span className="text-sm text-muted-foreground ml-2">
                  Logged in as {auth.user.profile.preferred_username}
                </span>
              )}
            </header>
            
            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto space-y-10">
                <div className="mb-8">
                  <ImageUploader 
                    onImageSelected={handleImageSelected}
                    onImageUpload={handleImageUpload}
                  />
                </div>
                
                {(isUploading || isAnalyzing) && (
                  <AnalyzingIndicator 
                    message={isUploading ? "Uploading your image..." : "Analyzing your image..."}
                    submessage={isUploading ? "Uploading to secure storage" : "This may take a few moments"}
                  />
                )}
                
                {analysisResults && previewUrl && (
                  <AnalysisResults 
                    analysis={analysisResults}
                    previewUrl={previewUrl}
                    similarImages={similarImages}
                    labels={labels}
                    isLoading={isUploading || isAnalyzing}
                  />
                )}
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardUpload;