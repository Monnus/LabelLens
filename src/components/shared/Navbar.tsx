import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ImageIcon, History } from "lucide-react";
import {AuthProvider,useAuth } from "react-oidc-context";

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setUser(auth.user);
    } else {
      setUser(null);
    }
  }, [auth.isAuthenticated, auth.user]);

  const handleSignIn = () => {
    auth.signinRedirect();
  };

  const handleSignOut = () => {
    const clientId = "4488b559kpbreinm4uvanfec8k";
    const logoutUri = window.location.origin; // Redirect to homepage after logout
    const cognitoDomain = "https://us-east-115rmvrj6c.auth.us-east-1.amazoncognito.com";
    
    auth.removeUser(); // Remove local user data
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Logo / Home Navigation */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <ImageIcon className="h-6 w-6" />
          <span className="text-xl font-semibold">ImageInsight</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/get-started")}>
            Get Started
          </Button>

          {/* Show user info & sign out if authenticated */}
          {auth.isAuthenticated ? (
            <>
              <span className="text-sm font-medium">{user?.profile?.email}</span>
              <Button variant="outline" onClick={handleSignOut} className="gap-2">
                <History size={16} />
                Sign Out
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleSignIn} className="gap-2">
              <History size={16} />
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
