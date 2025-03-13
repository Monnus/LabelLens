
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ImageIcon, History } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <ImageIcon className="h-6 w-6" />
          <span className="text-xl font-semibold">ImageInsight</span>
        </div>
        
        <nav className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/get-started")}
          >
            Get Started
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/login")}
            className="gap-2"
          >
            <History size={16} />
            Sign In
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
