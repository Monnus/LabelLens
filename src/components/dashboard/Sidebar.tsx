
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarInput,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { Search, Upload, Settings, LogOut, History, ImageIcon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

type HistoryItem = {
  id: string;
  name: string;
  date: string;
  thumbnail: string;
};

type DashboardSidebarProps = {
  authIDToken: string;
  historyItems: HistoryItem[];
  onHistoryItemSelect: (id: string, authIDToken: string) => void;
  selectedItemId?: string;
};

const DashboardSidebar = ({ 
  authIDToken,
  historyItems, 
  onHistoryItemSelect,
  selectedItemId 
}: DashboardSidebarProps) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // In real implementation, this would call AWS Cognito logout
    navigate("/");
  };

  const handleHistoryItemClick = (itemId: string) => {
    console.log("Sidebar item clicked:", itemId);
    console.log("Auth token available:", authIDToken ? "Yes" : "No");
    
    // Always pass both parameters to the parent's function
    onHistoryItemSelect(itemId, authIDToken);
  };

  const isOnDashboardPage = window.location.pathname === "/dashboard";

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <ImageIcon className="h-6 w-6" />
          <span className="text-xl font-semibold">ImageInsight</span>
        </div>
        <div className="px-2 py-2">
          <SidebarInput placeholder="Search images..." />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Upload" 
                onClick={() => navigate("/dashboard/upload")}
                isActive={window.location.pathname === "/dashboard/upload"}
              >
                <Upload />
                <span>Upload New Image</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="History"
                isActive={isOnDashboardPage}
                onClick={() => navigate("/dashboard")}
              >
                <History />
                <span>Image History</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>Recent Images</SidebarGroupLabel>
          <div className="px-2">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-1">
                {/*Test button for fetching from API*/}
                <Button
                  key="test-button"
                  variant="ghost"
                  className={`w-full justify-start text-left h-auto py-2 ${
                    selectedItemId === "1739611571421_camera.jpg" ? "bg-accent text-accent-foreground" : ""
                  }`}
                  onClick={() => {
                    console.log("Test button clicked");
                    handleHistoryItemClick("1739611571421_camera.jpg");
                  }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-muted">
                      <img 
                        src="/placeholder.svg" 
                        alt="1739611571421_camera.jpg"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">1739611571421_camera.jpg</p>
                      <p className="text-xs text-muted-foreground">1739611571421</p>
                    </div>
                  </div>
                </Button>

                {/* Render actual history items */}
                {historyItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`w-full justify-start text-left h-auto py-2 ${
                      selectedItemId === item.id ? "bg-accent text-accent-foreground" : ""
                    }`}
                    onClick={() => handleHistoryItemClick(item.id)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-muted">
                        <img 
                          src={item.thumbnail} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Profile">
                <User />
                <span>Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Log Out"
                onClick={handleLogout}
              >
                <LogOut />
                <span>Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;