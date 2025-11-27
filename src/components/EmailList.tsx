import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  timestamp: string;
  isUnread: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
}

interface EmailListProps {
  onEmailClick: (email: Email) => void;
}

const mockEmails: Email[] = [
  {
    id: "1",
    sender: "John Doe",
    senderEmail: "john@example.com",
    subject: "Project Update - Q4 Review",
    preview: "Hey team, I wanted to share the latest updates on our Q4 project progress...",
    timestamp: "10:30 AM",
    isUnread: true,
    isStarred: false,
    hasAttachment: true,
  },
  {
    id: "2",
    sender: "Sarah Wilson",
    senderEmail: "sarah@example.com",
    subject: "Meeting Notes from Yesterday",
    preview: "Here are the notes from our strategy meeting. Please review and add your comments...",
    timestamp: "9:15 AM",
    isUnread: true,
    isStarred: true,
    hasAttachment: false,
  },
  {
    id: "3",
    sender: "Mike Johnson",
    senderEmail: "mike@example.com",
    subject: "Re: Budget Approval",
    preview: "Thanks for submitting the budget proposal. I've reviewed it and have a few questions...",
    timestamp: "Yesterday",
    isUnread: false,
    isStarred: false,
    hasAttachment: true,
  },
];

export const EmailList = ({ onEmailClick }: EmailListProps) => {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [starredEmails, setStarredEmails] = useState<string[]>(
    mockEmails.filter(e => e.isStarred).map(e => e.id)
  );

  const toggleSelect = (emailId: string) => {
    setSelectedEmails(prev =>
      prev.includes(emailId)
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const toggleStar = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredEmails(prev =>
      prev.includes(emailId)
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  return (
    <ScrollArea className="flex-1">
      <div className="divide-y divide-border">
        {mockEmails.map((email) => (
          <div
            key={email.id}
            onClick={() => onEmailClick(email)}
            className={cn(
              "flex items-center gap-4 px-4 py-3 h-email-row cursor-pointer transition-colors",
              "hover:bg-hover-bg",
              email.isUnread && "bg-background",
              selectedEmails.includes(email.id) && "bg-accent"
            )}
          >
            <Checkbox
              checked={selectedEmails.includes(email.id)}
              onCheckedChange={() => toggleSelect(email.id)}
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => toggleStar(email.id, e)}
              className="text-muted-foreground hover:text-yellow-500 transition-colors"
            >
              <Star
                className={cn(
                  "h-5 w-5",
                  starredEmails.includes(email.id) && "fill-yellow-500 text-yellow-500"
                )}
              />
            </button>

            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {email.sender.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  "text-sm truncate",
                  email.isUnread ? "font-semibold text-foreground" : "font-normal text-foreground"
                )}>
                  {email.sender}
                </span>
                {email.isUnread && (
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-sm truncate",
                  email.isUnread ? "font-medium" : "font-normal text-muted-foreground"
                )}>
                  {email.subject}
                </span>
                <span className="text-xs text-muted-foreground">—</span>
                <span className="text-xs text-muted-foreground truncate">
                  {email.preview}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {email.hasAttachment && (
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground min-w-[60px] text-right">
                {email.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export type { Email };
