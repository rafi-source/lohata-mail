import { EmailComposer } from "@/components/EmailComposer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Professional Email System
          </h1>
          <p className="text-xl text-muted-foreground">
            Send emails anywhere with Resend & Cloudflare
          </p>
        </div>
        
        <EmailComposer />
        
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>📧 Powered by Resend API</p>
          <p>To use a custom domain (e.g., yourname@yourdomain.com), verify your domain at resend.com/domains</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
