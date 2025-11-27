import { useState } from "react";
import { TopNavbar } from "@/components/TopNavbar";
import { Sidebar } from "@/components/Sidebar";
import { EmailList, Email } from "@/components/EmailList";
import { ComposeModal } from "@/components/ComposeModal";
import { useNavigate } from "react-router-dom";

const Inbox = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleEmailClick = (email: Email) => {
    navigate(`/email/${email.id}`, { state: { email } });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopNavbar 
        onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        showMenuButton
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCompose={() => setIsComposeOpen(true)}
          isCollapsed={isSidebarCollapsed}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <EmailList onEmailClick={handleEmailClick} />
        </main>
      </div>

      <ComposeModal 
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />
    </div>
  );
};

export default Inbox;
