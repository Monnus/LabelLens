import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getHistoryItems } from "@/services/imageAnalysisService";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { AuthProps } from "@/types/AuthProps";
// Mock authentication for development
// In real implementation, this would come from react-oidc-context


const Dashboard: React.FC<AuthProps> = ({ auth }) =>{
  const [historyItems, setHistoryItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get user ID from auth context
  const userId = auth.isAuthenticated 
    ? auth.user.profile.preferred_username 
    : "";
   console.log(auth);
  // Load history items from session storage on component mount
 
  const handleHistoryItemSelect = (id) => {
    setSelectedItemId(id);
  };

  if (auth) {
    // useEffect(() => {
    //   if (!auth.isAuthenticated) {
    //     toast({
    //       title: "No auth user",
    //       description: "You need to sign in first.",
    //       variant: "destructive",
    //     });
    //     navigate("/");
    //   } else {
    //     const items = getHistoryItems(userId);
    //     setHistoryItems(items);
        
    //     // Select the first item by default if available
    //     if (items.length > 0 && !selectedItemId) {
    //       setSelectedItemId(items[0].id);
    //     }
        
    //     setIsLoading(false);
    //   }
    // }, [userId, selectedItemId, navigate]);
    
    return (
      <SidebarProvider>
      <div className="min-h-screen flex">
        <DashboardSidebar 
          historyItems={historyItems}
          onHistoryItemSelect={handleHistoryItemSelect}
          selectedItemId={selectedItemId}
        />
        
        <SidebarInset>
          <div className="flex flex-col h-full">
            <DashboardHeader username={userId} />
            
            <main className="flex-1 overflow-auto p-6">
              <DashboardContent 
                historyItems={historyItems}
                selectedItemId={selectedItemId}
                isAuthenticated={auth.isAuthenticated}
              />
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
    );
  }

  return (
      <div className="flex h-screen items-center justify-center text-center">
        <h2 className="text-2xl font-semibold">Checking authentication...</h2>
      </div>
 
  );
};

export default Dashboard;

// const Dashboard: React.FC<AuthProps> = ({ auth }) => {
//   const [selectedItemId, setSelectedItemId] = useState<string | undefined>(mockHistoryItems[0]?.id);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!auth.isAuthenticated) {
//       toast({
//         title: "No auth user",
//         description: "You need to sign in first.",
//         variant: "destructive",
//       });
//       navigate("/");
//     } else {
//       setLoading(false);
//     }
//   }, [auth.isAuthenticated, navigate]);

//   console.log("Here is auth object", auth.user.profile.preferred_username);

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center text-center">
//         <h2 className="text-2xl font-semibold">Checking authentication...</h2>
//       </div>
//     );
//   }