import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Send, Paperclip, X, Minimize2, Maximize2,
  Bold, Italic, Underline, Link2, AlignLeft, List, 
  Smile, Upload, FileText
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Attachment {
  file: File;
  preview?: string;
}

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComposeModal = ({ isOpen, onClose }: ComposeModalProps) => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const newAttachments: Attachment[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newAttachments.push({ file, preview: e.target?.result as string });
          if (newAttachments.length === files.length) {
            setAttachments((prev) => [...prev, ...newAttachments]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        newAttachments.push({ file });
        if (newAttachments.length === files.length) {
          setAttachments((prev) => [...prev, ...newAttachments]);
        }
      }
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!to || !subject || !message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const attachmentData = await Promise.all(
        attachments.map(async (att) => {
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(att.file);
          });
          return {
            filename: att.file.name,
            content: base64,
          };
        })
      );

      const { error } = await supabase.functions.invoke("send-email", {
        body: {
          to,
          subject,
          message,
          attachments: attachmentData.length > 0 ? attachmentData : undefined,
        },
      });

      if (error) throw error;

      toast({
        title: "Email sent successfully!",
        description: `Your email has been sent to ${to}`,
      });

      setTo("");
      setCc("");
      setBcc("");
      setSubject("");
      setMessage("");
      setAttachments([]);
      onClose();
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Failed to send email",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-8 w-full max-w-2xl shadow-shadow-card rounded-t-xl bg-background border border-border z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <h3 className="font-medium text-sm">New Message</h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <form onSubmit={handleSend} className="flex flex-col h-[600px]">
          <div className="p-4 space-y-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="To"
                className="flex-1 border-0 focus-visible:ring-0 px-0"
                required
              />
              <div className="flex gap-1 text-xs">
                <button type="button" onClick={() => setShowCc(!showCc)} className="text-link-blue hover:underline">
                  Cc
                </button>
                <button type="button" onClick={() => setShowBcc(!showBcc)} className="text-link-blue hover:underline">
                  Bcc
                </button>
              </div>
            </div>

            {showCc && (
              <Input
                type="email"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="Cc"
                className="border-0 focus-visible:ring-0 px-0"
              />
            )}

            {showBcc && (
              <Input
                type="email"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder="Bcc"
                className="border-0 focus-visible:ring-0 px-0"
              />
            )}

            <Input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="border-0 focus-visible:ring-0 px-0"
              required
            />
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-border">
            {[Bold, Italic, Underline, Link2, AlignLeft, List, Smile].map((Icon, i) => (
              <Button key={i} variant="ghost" size="icon" type="button" className="h-8 w-8">
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          <ScrollArea className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Compose your message..."
              className="min-h-[300px] border-0 focus-visible:ring-0 resize-none rounded-none"
              required
            />

            {attachments.length > 0 && (
              <div className="p-4 space-y-2">
                <p className="text-sm font-medium">Attached Files ({attachments.length})</p>
                <div className="grid grid-cols-4 gap-3">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="relative group rounded border border-border overflow-hidden">
                      {attachment.preview ? (
                        <img src={attachment.preview} alt={attachment.file.name} className="w-full h-20 object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-20 bg-accent">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <p className="text-xs truncate w-full px-2">{attachment.file.name}</p>
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files)}
                multiple
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4 mr-2" />
                Attach
              </Button>
            </div>
            
            <Button
              type="submit"
              disabled={isSending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSending ? "Sending..." : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
