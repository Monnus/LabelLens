import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "react-oidc-context";
import Index from "./pages/Index";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardUpload from "./pages/DashboardUpload";
import NotFound from "./pages/NotFound";
import { Amplify } from "aws-amplify";
import amplifyconfig from "./amplifyconfiguration.json";


Amplify.configure(amplifyconfig);


const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_15rmVRJ6C",
  client_id: "4488b559kpbreinm4uvanfec8k",
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT,
  response_type: "code",
  scope: "openid",
};

// log here("Redirect URI:", import.meta.env.VITE_COGNITO_REDIRECT);

// Query client instance
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider {...cognitoAuthConfig}>
        <AppContent /> {/* Handle authentication state in a separate component */}
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Main App component
const AppContent: React.FC = () => {  // ❌ Removed AuthProps here
  const auth = useAuth();
  const [authReady, setAuthReady] = useState(false);

  // Wait until authentication is loaded
  useEffect(() => {
    if (!auth.isLoading) {
      setAuthReady(true);
    }
  }, [auth.isLoading]);

  // Show a loading screen while authentication is still being processed
  if (!authReady) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading authentication...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index auth={auth} />} />
        <Route path="/get-started" element={<GetStarted  />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard auth={auth} />} />
        <Route path="/dashboard/upload" element={<DashboardUpload auth={auth} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
