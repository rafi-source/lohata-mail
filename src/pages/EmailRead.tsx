import { useLocation, useNavigate } from "react-router-dom";
import { TopNavbar } from "@/components/TopNavbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Archive, 
  Trash2, 
  MailOpen, 
  FolderInput,
  Reply,
  Forward,
  Star,
  Paperclip
} from "lucide-react";
import { Email } from "@/components/EmailList";

const EmailRead = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email as Email;

  if (!email) {
    navigate("/inbox");
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopNavbar />
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto p-6">
            {/* Back button */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/inbox")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inbox
            </Button>

            {/* Action bar */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <Button variant="ghost" size="icon" title="Archive">
                <Archive className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Mark unread">
                <MailOpen className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Move to folder">
                <FolderInput className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Star">
                <Star className={email.isStarred ? "fill-yellow-500 text-yellow-500" : ""} />
              </Button>
            </div>

            {/* Email header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold mb-4">{email.subject}</h1>
              
              <div className="flex items-start gap-4 p-4 bg-accent/30 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {email.sender.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="font-semibold">{email.sender}</p>
                      <p className="text-sm text-muted-foreground">{email.senderEmail}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{email.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Email body */}
            <div className="prose max-w-none mb-8">
              <p className="text-base leading-relaxed">
                {email.preview}
              </p>
              <p className="text-base leading-relaxed mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-base leading-relaxed mt-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p className="text-base leading-relaxed mt-4">
                Best regards,<br />
                {email.sender}
              </p>
            </div>

            {/* Attachments */}
            {email.hasAttachment && (
              <div className="mb-8 p-4 bg-accent/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Paperclip className="h-4 w-4" />
                  <span className="font-medium text-sm">2 Attachments</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-background rounded border border-border hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                      <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Document.pdf</p>
                      <p className="text-xs text-muted-foreground">2.4 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded border border-border hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                      <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Screenshot.png</p>
                      <p className="text-xs text-muted-foreground">1.8 MB</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Reply className="mr-2 h-4 w-4" />
                Reply
              </Button>
              <Button variant="outline">
                <Forward className="mr-2 h-4 w-4" />
                Forward
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default EmailRead;
