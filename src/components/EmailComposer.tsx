import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Send, Paperclip, X, Menu, Search, MoreVertical, 
  Inbox, Star, Clock, Trash2, Maximize2, Minimize2,
  Bold, Italic, Underline, Link, AlignLeft, ListOrdered, 
  Smile, Upload, FileText
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [isComposerOpen, setIsComposerOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("compose");
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
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Send className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Lovable Mail
              </h1>
            </div>
          </div>
          
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search mail..." 
                className="pl-10 bg-secondary/50 border-border/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card/30 p-4 hidden lg:block">
          <Button 
            onClick={() => setIsComposerOpen(true)}
            className="w-full mb-6 bg-gradient-primary hover:opacity-90 shadow-elegant"
          >
            <Paperclip className="mr-2 h-4 w-4" />
            Compose
          </Button>

          <ScrollArea className="h-[calc(100vh-180px)]">
            <nav className="space-y-1">
              {[
                { icon: Inbox, label: "Inbox", count: "12", active: activeTab === "inbox" },
                { icon: Star, label: "Starred", count: "3", active: false },
                { icon: Clock, label: "Snoozed", count: null, active: false },
                { icon: Send, label: "Sent", count: null, active: activeTab === "sent" },
                { icon: Trash2, label: "Trash", count: null, active: false },
              ].map((item) => (
                <Button
                  key={item.label}
                  variant={item.active ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(item.label.toLowerCase())}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                  {item.count && (
                    <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </Button>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative">
          {!isComposerOpen ? (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-secondary/10 to-accent/5">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-elegant">
                  <Paperclip className="h-12 w-12 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-semibold">No Message Selected</h2>
                <p className="text-muted-foreground">Click compose to start writing</p>
                <Button 
                  onClick={() => setIsComposerOpen(true)}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  Compose New Email
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col bg-gradient-to-br from-background via-secondary/10 to-accent/5">
              {/* Composer Header */}
              <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
                <h3 className="font-semibold">New Message</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsComposerOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <ScrollArea className="flex-1">
                  <form onSubmit={handleSend} className="p-6 space-y-4">
                    {/* To Field */}
                    <div className="flex items-center border-b border-border pb-3">
                      <label className="text-sm text-muted-foreground w-16">To</label>
                      <Input
                        type="email"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="recipients@example.com"
                        className="flex-1 border-0 focus-visible:ring-0 px-2"
                        required
                      />
                    </div>

                    {/* Subject Field */}
                    <div className="flex items-center border-b border-border pb-3">
                      <label className="text-sm text-muted-foreground w-16">Subject</label>
                      <Input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject"
                        className="flex-1 border-0 focus-visible:ring-0 px-2"
                        required
                      />
                    </div>

                    {/* Formatting Toolbar */}
                    <div className="flex items-center gap-1 border-b border-border pb-3">
                      {[Bold, Italic, Underline, Link, AlignLeft, ListOrdered, Smile].map((Icon, i) => (
                        <Button key={i} variant="ghost" size="icon" type="button" className="h-8 w-8">
                          <Icon className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>

                    {/* Message Field */}
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Compose your message..."
                      className="min-h-[300px] border-0 focus-visible:ring-0 resize-none"
                      required
                    />

                    {/* Attachments Drop Zone */}
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                        isDragging
                          ? "border-primary bg-primary/5 scale-[1.02]"
                          : "border-border/50 hover:border-primary/50 hover:bg-secondary/30"
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFileSelect(e.target.files)}
                        multiple
                        className="hidden"
                      />
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files here, or click to browse
                      </p>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="mr-2 h-4 w-4" />
                        Choose Files
                      </Button>
                    </div>

                    {/* Attachments Preview */}
                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Attached Files ({attachments.length})</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="relative group rounded-lg overflow-hidden border border-border bg-card/50 backdrop-blur-sm hover:shadow-elegant transition-all"
                            >
                              {attachment.preview ? (
                                <div className="aspect-square">
                                  <img
                                    src={attachment.preview}
                                    alt={attachment.file.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="aspect-square flex flex-col items-center justify-center p-4 bg-secondary/30">
                                  <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                                  <p className="text-xs text-center truncate w-full px-2">
                                    {attachment.file.name}
                                  </p>
                                </div>
                              )}
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                onClick={() => removeAttachment(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Send Button */}
                    <div className="flex justify-between items-center pt-4">
                      <div className="flex gap-2">
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
                        className="bg-gradient-primary hover:opacity-90 shadow-elegant px-8"
                      >
                        {isSending ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </ScrollArea>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
