import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import Index from "./pages/Index";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardUpload from "./pages/DashboardUpload";
import NotFound from "./pages/NotFound";
import { Amplify } from "aws-amplify";
import amplifyconfig from "./amplifyconfiguration.json";



// Cognito Auth Config
Amplify.configure(amplifyconfig);


const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_15rmVRJ6C",
  client_id: "4488b559kpbreinm4uvanfec8k",
  redirect_uri: "http://localhost:8080/callback",
  response_type: "code",
  scope: "openid",
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider {...cognitoAuthConfig}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/upload" element={<DashboardUpload />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
