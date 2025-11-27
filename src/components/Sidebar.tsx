import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  Inbox, 
  Star, 
  Clock, 
  Send, 
  FileText, 
  AlertOctagon, 
  Trash2,
  Tag,
  Users,
  Newspaper,
  MessageSquare,
  Edit3
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCompose: () => void;
  isCollapsed?: boolean;
}

const navigationItems = [
  { icon: Inbox, label: "Inbox", id: "inbox", count: 12 },
  { icon: Star, label: "Starred", id: "starred", count: 3 },
  { icon: Clock, label: "Snoozed", id: "snoozed" },
  { icon: Send, label: "Sent", id: "sent" },
  { icon: FileText, label: "Drafts", id: "drafts", count: 2 },
  { icon: AlertOctagon, label: "Spam", id: "spam" },
  { icon: Trash2, label: "Trash", id: "trash" },
];

const categoryItems = [
  { icon: Users, label: "Social", id: "social" },
  { icon: Newspaper, label: "Updates", id: "updates" },
  { icon: MessageSquare, label: "Forums", id: "forums" },
];

export const Sidebar = ({ activeTab, onTabChange, onCompose, isCollapsed }: SidebarProps) => {
  return (
    <aside className={cn(
      "border-r border-border bg-background transition-all duration-200",
      isCollapsed ? "w-sidebar-collapsed" : "w-sidebar"
    )}>
      <div className="p-4">
        <Button 
          onClick={onCompose}
          className={cn(
            "bg-primary hover:bg-primary/90 text-primary-foreground shadow-shadow-glow",
            isCollapsed ? "w-14 h-14 rounded-full p-0" : "w-full"
          )}
        >
          <Edit3 className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
          {!isCollapsed && "Compose"}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-120px)]">
        <nav className="px-2 space-y-1">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-11",
                isCollapsed && "justify-center px-0"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </Button>
          ))}

          {!isCollapsed && (
            <>
              <div className="pt-4 pb-2 px-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Categories
                </p>
              </div>
              
              {categoryItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start h-11"
                  onClick={() => onTabChange(item.id)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                </Button>
              ))}
            </>
          )}
        </nav>
      </ScrollArea>
    </aside>
  );
};
