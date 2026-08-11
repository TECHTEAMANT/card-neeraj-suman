import { motion } from "framer-motion";
import { useState } from "react";
import { User, Phone, Send, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { profile, whatsappDigits } from "@/lib/profile";

interface LeadCaptureFormProps {
  onLeadCapture: (name: string, phone: string) => void;
}

const LeadCaptureForm = ({ onLeadCapture }: LeadCaptureFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const generateVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
TITLE:${profile.title}
ORG:${profile.company || ""}
TEL;TYPE=CELL:${profile.mobile || ""}
EMAIL;TYPE=WORK:${profile.email || ""}
URL:${profile.website || ""}
URL;TYPE=LinkedIn:${profile.linkedin || ""}
ADR;TYPE=WORK:;;${profile.address || ""}
NOTE:${profile.note || ""}
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Contact saved! Check your downloads.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[\d\s+()-]{10,}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Auto-add 91 prefix if not present
    let formattedPhone = phone.replace(/\s+/g, ''); // Remove spaces
    if (!formattedPhone.startsWith('+91') && !formattedPhone.startsWith('91')) {
      formattedPhone = '91' + formattedPhone;
    }
    // Remove + if present for consistency
    formattedPhone = formattedPhone.replace('+', '');

    try {
      // Step 1: Save to Google Sheets
      const { googleSheetsService } = await import('@/services/api');
      const sheetsResult = await googleSheetsService.saveContact({
        name,
        phone: formattedPhone,
        timestamp: new Date().toISOString(),
      });

      if (!sheetsResult.success) {
        throw new Error(sheetsResult.message);
      }

      // Step 2: Send WhatsApp message via backend API
      const { whatsappService } = await import('@/services/api');
      const whatsappResult = await whatsappService.sendMessage({
        phoneNumber: formattedPhone,
        message: `Hi! I'm ${name}, and I just connected with you via ${profile.name}'s digital card.`,
        messageType: 'text',
      });

      if (!whatsappResult.success) {
        console.warn('WhatsApp message failed:', whatsappResult.error);
        // Don't fail the entire flow if WhatsApp fails
        toast.warning("Details saved, but WhatsApp message couldn't be sent");
      }

      // Success!
      toast.success("Connected successfully!");
      setIsSubmitted(true);
      onLeadCapture(name, formattedPhone);
      
      // Generate vCard automatically
      setTimeout(() => {
        generateVCard();
      }, 500);

      // Open WhatsApp with pre-filled message
      const ownerDigits = whatsappDigits(profile.whatsapp || profile.mobile);
      const whatsappMessage = encodeURIComponent(
        `Hi ${profile.name}!\n\nI'm ${name}, and I just connected with you via your digital card.\n\nMy number: ${formattedPhone}`
      );
      
      if (ownerDigits) {
        setTimeout(() => {
          window.open(`https://wa.me/${ownerDigits}?text=${whatsappMessage}`, "_blank");
        }, 1000);
      }

    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error.message || "Failed to save your details. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card-gold p-6 mx-4"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <CheckCircle className="w-16 h-16 text-gold mx-auto" />
          </motion.div>
          <h3 className="text-xl font-semibold text-foreground">
            Connected, {name.split(" ")[0]}!
          </h3>
          <p className="text-sm text-muted-foreground">
            WhatsApp message is ready to send. My contact card has been downloaded.
          </p>
          <Button
            onClick={generateVCard}
            variant="outline"
            className="border-gold/50 text-gold hover:bg-gold/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Contact Again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card-gold p-6 mx-4"
    >
      <div className="text-center mb-5">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Let's Connect!
        </h3>
        <p className="text-xs text-muted-foreground">
          Share your details & I'll send you my complete profile on WhatsApp
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70" />
          <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10 bg-navy-light/50 border-border/50 focus:border-gold/50 placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70" />
          <Input
            type="tel"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={10}
            className="pl-10 bg-navy-light/50 border-border/50 focus:border-gold/50 placeholder:text-muted-foreground/50"
          />
        </div>

        <Button type="submit" className="gold-button w-full group">
          <span className="flex items-center justify-center gap-2">
            Connect Now
            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
      </form>
    </motion.div>
  );
};

export default LeadCaptureForm;
