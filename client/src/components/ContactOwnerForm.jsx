import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle } from "lucide-react";


const ContactOwnerForm = ({ ownerName, propertyTitle }) => {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
    }, 800);
  };

  if (sent) {
    return (
      <div className="text-center py-6">
        <CheckCircle className="w-12 h-12 text-secondary mx-auto mb-3" />
        <h4 className="font-display text-lg font-bold text-foreground mb-1">Message Sent!</h4>
        <p className="text-muted-foreground font-body text-sm">
          {ownerName} will get back to you soon.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setSent(false)}>
          Send Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="font-body text-sm">Your Name</Label>
        <Input placeholder="Full name" className="h-10 font-body text-sm" required />
      </div>
      <div className="space-y-2">
        <Label className="font-body text-sm">Email</Label>
        <Input type="email" placeholder="you@email.com" className="h-10 font-body text-sm" required />
      </div>
      <div className="space-y-2">
        <Label className="font-body text-sm">Phone (optional)</Label>
        <Input type="tel" placeholder="+1 (555) 000-0000" className="h-10 font-body text-sm" />
      </div>
      <div className="space-y-2">
        <Label className="font-body text-sm">Message</Label>
        <Textarea
          placeholder={`Hi ${ownerName}, I'm interested in "${propertyTitle}"...`}
          className="min-h-[80px] font-body text-sm"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-amber text-secondary-foreground font-semibold shadow-amber hover:opacity-90 h-10"
      >
        <Send className="w-4 h-4 mr-2" />
        {isLoading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
};

export default ContactOwnerForm;
