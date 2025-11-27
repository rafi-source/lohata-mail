import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, RefreshCw, Settings, Bell, Menu } from "lucide-react";

interface TopNavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const TopNavbar = ({ onMenuClick, showMenuButton = false }: TopNavbarProps) => {
  return (
    <header className="h-navbar border-b border-border bg-background px-4 flex items-center gap-4 sticky top-0 z-10">
      {showMenuButton && (
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      )}
      
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary-foreground">
            <path fill="currentColor" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-foreground hidden md:block">Mail</h1>
      </div>

      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search mail" 
            className="pl-10 h-11 rounded-full bg-accent border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <RefreshCw className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <Avatar className="h-8 w-8 ml-2">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
