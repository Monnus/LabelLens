
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ImageIcon, Upload, History, InfoIcon } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="py-24 px-6 container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">Image Recognition App</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Upload any image and get detailed information about it, plus discover similar images instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            onClick={() => navigate("/get-started")}
            className="gap-2"
          >
            <Upload size={18} />
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigate("/login")}
            className="gap-2"
          >
            <History size={18} />
            Sign In
          </Button>
        </div>
        <div className="mt-12 mx-auto max-w-5xl relative">
          <div className="relative z-10 bg-card rounded-xl border shadow-xl overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt="Image recognition demo" 
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<ImageIcon className="h-12 w-12 text-primary" />}
            title="Advanced Image Recognition"
            description="Get detailed information about any image you upload, including objects, colors, and more."
          />
          <FeatureCard 
            icon={<Upload className="h-12 w-12 text-primary" />}
            title="Quick & Easy Upload"
            description="Drag and drop or select images from your device. Supports all major image formats."
          />
          <FeatureCard 
            icon={<History className="h-12 w-12 text-primary" />}
            title="Image History"
            description="Sign in to access your upload history and revisit previous image analyses anytime."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 container mx-auto bg-card rounded-xl border my-12">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload an Image</h3>
            <p className="text-muted-foreground">Select or drag & drop any image to analyze</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Results</h3>
            <p className="text-muted-foreground">Our AI analyzes your image and provides detailed insights</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Discover Similar Images</h3>
            <p className="text-muted-foreground">Browse similar images from Unsplash based on your upload</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 container mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Try our image recognition technology for free, no account required.
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate("/get-started")}
          className="gap-2"
        >
          <Upload size={18} />
          Upload Your First Image
        </Button>
      </section>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <Card className="border bg-card h-full">
    <CardHeader className="flex flex-col items-center text-center">
      {icon}
      <CardTitle className="mt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-center text-base">{description}</CardDescription>
    </CardContent>
  </Card>
);

export default Index;
