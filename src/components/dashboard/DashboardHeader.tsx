import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
  username: string;
}

const DashboardHeader = ({ username }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <header className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <span className="text-sm text-muted-foreground ml-2">
          Welcome, {username}
        </span>
      </div>
      <Button onClick={() => navigate("/dashboard/upload")}>
        <Upload className="mr-2 h-4 w-4" />
        Upload New Image
      </Button>
    </header>
  );
};

export default DashboardHeader;