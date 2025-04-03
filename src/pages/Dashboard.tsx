import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getHistoryItems } from "@/services/imageAnalysisService";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { AuthProps } from "@/types/AuthProps";

const Dashboard: React.FC<AuthProps>= ({auth}) =>{
  const [historyItems, setHistoryItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [forceRefetch, setForceRefetch] = useState(0); // Counter to force refetch
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get user ID from auth context
  const userId = auth.isAuthenticated 
    ? auth.user.profile.preferred_username 
    : "";
  
  console.log("Auth object:", auth);
  
  // Handle history item selection
  const handleHistoryItemSelect = (itemId, authToken) => {
    console.log("History item selected:", itemId);
    console.log("Auth token available:", authToken ? "Yes" : "No");
    
    if (selectedItemId === itemId) {
      // If the same item is selected again, increment the counter to force a refetch
      setForceRefetch(prev => prev + 1);
      console.log("Force refetching same item");
    } else {
      // Otherwise just update the selected item
      setSelectedItemId(itemId);
    }
  };

  // Load history items from session storage on component mount
  useEffect(() => {
    if (!auth.isAuthenticated) {
      toast({
        title: "No auth user",
        description: "You need to sign in first.",
        variant: "destructive",
      });
      navigate("/");
    } else {
      const items = getHistoryItems(userId);
      setHistoryItems(items);
      
      // Select the first item by default if available
      if (items.length > 0 && !selectedItemId) {
        setSelectedItemId(items[0].id);
      }
      
      setIsLoading(false);
    }
  }, [userId, auth.isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-center">
        <h2 className="text-2xl font-semibold">Checking authentication...</h2>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <DashboardSidebar 
          authIDToken={auth.user?.id_token || ""}
          historyItems={historyItems}
          onHistoryItemSelect={handleHistoryItemSelect}
          selectedItemId={selectedItemId}
        />
        
        <SidebarInset>
          <div className="flex flex-col h-full">
            <DashboardHeader username={userId} />
            
            <main className="flex-1 overflow-auto p-6">
              <DashboardContent 
               authIDToken={auth.user?.id_token || ""}
               historyItems={historyItems}
               selectedItemId={selectedItemId}
               isAuthenticated={auth.isAuthenticated}
               forceRefetch={forceRefetch}
              />
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;