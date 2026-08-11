import { motion } from "framer-motion";
import { MessageCircle, Phone, MapPin, Linkedin, Instagram, Globe, Mail, Github } from "lucide-react";
import { profile, whatsappUrl, telUrl, mailtoUrl } from "@/lib/profile";

const Header = () => {
  const iconButtons = [
    profile.whatsapp && {
      icon: MessageCircle,
      href: whatsappUrl(profile.whatsapp, profile.whatsapp_prefill),
      label: "WhatsApp",
      color: "text-[#25D366]",
    },
    profile.instagram && {
      icon: Instagram,
      href: profile.instagram,
      label: "Instagram",
      color: "text-[#E4405F]",
    },
    profile.mobile && {
      icon: Phone,
      href: telUrl(profile.mobile),
      label: "Call",
      color: "text-gold",
    },
    profile.location_url && {
      icon: MapPin,
      href: profile.location_url,
      label: "Location",
      color: "text-red-400",
    },
    profile.linkedin && {
      icon: Linkedin,
      href: profile.linkedin,
      label: "LinkedIn",
      color: "text-[#0A66C2]",
    },
    profile.github && {
      icon: Github,
      href: profile.github,
      label: "GitHub",
      color: "text-foreground",
    },
    profile.website && {
      icon: Globe,
      href: profile.website,
      label: profile.website_label || "Website",
      color: "text-gold",
    },
    profile.email && {
      icon: Mail,
      href: mailtoUrl(profile.email),
      label: "Email",
      color: "text-gold-light",
    },
  ].filter(Boolean) as Array<{
    icon: typeof MessageCircle;
    href: string;
    label: string;
    color: string;
  }>;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {iconButtons.map((button, index) => (
            <motion.a
              key={button.label}
              href={button.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-full bg-navy-light/80 border border-border/50 hover:border-gold/50 hover:bg-navy-lighter transition-all"
              title={button.label}
            >
              <button.icon className={`w-5 h-5 ${button.color}`} />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
