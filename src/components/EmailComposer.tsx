import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2 } from "lucide-react";

export const EmailComposer = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

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
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: {
          to,
          subject,
          message,
          from: from || undefined,
        },
      });

      if (error) throw error;

      toast({
        title: "Email sent successfully! ✉️",
        description: `Your email has been sent to ${to}`,
      });

      // Reset form
      setTo("");
      setSubject("");
      setMessage("");
      setFrom("");
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
    <Card className="w-full max-w-2xl shadow-[var(--shadow-elegant)] border-border/50 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_hsl(217_91%_60%/0.3)]">
      <CardHeader className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-t-lg">
        <CardTitle className="text-2xl">Compose Email</CardTitle>
        <CardDescription className="text-primary-foreground/90">
          Send professional emails powered by Resend
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSend} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="from">From (optional)</Label>
            <Input
              id="from"
              type="text"
              placeholder="your-name@yourdomain.com"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="transition-all duration-300 focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use default sender. For custom domains, verify your domain with Resend first.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To *</Label>
            <Input
              id="to"
              type="email"
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              className="transition-all duration-300 focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              type="text"
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="transition-all duration-300 focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="min-h-[200px] transition-all duration-300 focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300"
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
