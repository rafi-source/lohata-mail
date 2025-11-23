import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, Paperclip, X, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Attachment {
  file: File;
  preview?: string;
}

export const EmailComposer = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
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

      const { data, error } = await supabase.functions.invoke("send-email", {
        body: {
          to,
          subject,
          message,
          attachments: attachmentData.length > 0 ? attachmentData : undefined,
        },
      });

      if (error) throw error;

      toast({
        title: "Email sent successfully! ✉️",
        description: `Your email has been sent to ${to}`,
      });

      setTo("");
      setSubject("");
      setMessage("");
      setAttachments([]);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-card/95 backdrop-blur-sm shadow-[var(--shadow-elegant)] border-border/50 overflow-hidden">
        <div className="bg-gradient-to-r from-primary via-accent to-primary/80 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary-foreground/90 p-3 rounded-full">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Compose Email</h1>
              <p className="text-primary-foreground/80 text-sm">Send professional emails with attachments</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSend} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="to" className="text-sm font-medium">To</Label>
            <Input
              id="to"
              type="email"
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              className="border-border/60 focus:border-primary bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
            <Input
              id="subject"
              type="text"
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="border-border/60 focus:border-primary bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="min-h-[250px] border-border/60 focus:border-primary bg-background resize-none"
            />
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <Paperclip className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop files here, or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary font-medium hover:underline"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-muted-foreground">
              Supports all file types
            </p>
          </div>

          {attachments.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Attachments ({attachments.length})</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {attachments.map((att, index) => (
                  <div key={index} className="relative group">
                    {att.preview ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-border/60">
                        <img
                          src={att.preview}
                          alt={att.file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg border border-border/60 bg-muted flex items-center justify-center p-3">
                        <p className="text-xs text-center truncate w-full text-muted-foreground">
                          {att.file.name}
                        </p>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <Badge variant="secondary" className="absolute bottom-2 left-2 text-xs">
                      {(att.file.size / 1024).toFixed(1)} KB
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 h-12 text-base font-medium"
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Email
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};
