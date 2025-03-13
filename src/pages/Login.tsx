
import Navbar from "@/components/shared/Navbar";
import LoginForm from "@/components/auth/LoginForm";
import { ImageIcon } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-12">
        <div className="max-w-md mx-auto text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to access your image history and personalized features
          </p>
        </div>
        
        <LoginForm />
      </main>
    </div>
  );
};

export default Login;
