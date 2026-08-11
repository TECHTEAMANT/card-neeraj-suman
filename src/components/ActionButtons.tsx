import { motion } from "framer-motion";
import { MessageCircle, Linkedin, Instagram, Globe, Phone, Mail, Github, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile, whatsappUrl, telUrl, mailtoUrl } from "@/lib/profile";

export const downloadVCard = () => {
  const vcardLines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${profile.name};;;`,
    `FN:${profile.name}`,
  ];
  if (profile.company) vcardLines.push(`ORG:${profile.company}`);
  if (profile.title) vcardLines.push(`TITLE:${profile.title}`);
  if (profile.mobile) vcardLines.push(`TEL;CELL:${profile.mobile}`);
  if (profile.whatsapp) vcardLines.push(`TEL;TYPE=WHATSAPP:${profile.whatsapp}`);
  if (profile.email) vcardLines.push(`EMAIL;WORK;INTERNET:${profile.email}`);
  vcardLines.push(`URL:${window.location.href.split('?')[0]}`);
  const addr = profile.office_address || profile.address;
  if (addr) vcardLines.push(`ADR;WORK:;;${addr};;;;`);
  if (profile.note) vcardLines.push(`NOTE:${profile.note}`);
  vcardLines.push("END:VCARD");

  const vcardString = vcardLines.join("\r\n");
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // Data URI scheme triggers native Add Contact / Download on mobile browsers
    const dataUri = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcardString)}`;
    window.location.href = dataUri;
  } else {
    // Desktop blob download
    const blob = new Blob([vcardString], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
};

const ActionButtons = () => {
  const actions = [
    {
      icon: UserPlus,
      label: "Save Contact / Add to Phonebook",
      onClick: downloadVCard,
      color: "bg-gradient-to-r from-amber-500 to-yellow-500",
      hoverColor: "hover:opacity-90",
      isPrimary: true,
    },
    profile.whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      href: whatsappUrl(profile.whatsapp, profile.whatsapp_prefill),
      color: "bg-[#25D366]",
      hoverColor: "hover:bg-[#20BD5A]",
    },
    profile.linkedin && {
      icon: Linkedin,
      label: "LinkedIn",
      href: profile.linkedin,
      color: "bg-[#0A66C2]",
      hoverColor: "hover:bg-[#094D92]",
    },
    profile.instagram && {
      icon: Instagram,
      label: "Instagram",
      href: profile.instagram,
      color: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040]",
      hoverColor: "hover:opacity-90",
    },
    profile.github && {
      icon: Github,
      label: "GitHub",
      href: profile.github,
      color: "bg-[#24292F]",
      hoverColor: "hover:bg-[#1b1f23]",
    },
    profile.website && {
      icon: Globe,
      label: profile.website_label || "Website",
      href: profile.website,
      color: "bg-gradient-to-r from-gold to-gold-light",
      hoverColor: "hover:opacity-90",
      isGold: true,
    },
  ].filter(Boolean) as Array<{
    icon: typeof MessageCircle;
    label: string;
    href?: string;
    onClick?: () => void;
    color: string;
    hoverColor: string;
    isGold?: boolean;
    isPrimary?: boolean;
  }>;

  const quickActions = [
    profile.mobile && {
      icon: Phone,
      label: "Call",
      href: telUrl(profile.mobile),
    },
    profile.email && {
      icon: Mail,
      label: "Email",
      href: mailtoUrl(profile.email),
    },
  ].filter(Boolean) as Array<{
    icon: typeof Phone;
    label: string;
    href: string;
  }>;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mx-4 mt-6 space-y-4"
    >
      {/* Main Action Buttons */}
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => {
          if (action.onClick) {
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={action.onClick}
                  className={`w-full py-6 ${action.color} ${action.hoverColor} text-white font-semibold text-base transition-all shadow-lg cursor-pointer`}
                >
                  <action.icon className="w-5 h-5 mr-2" />
                  {action.label}
                </Button>
              </motion.div>
            );
          }
          return (
            <motion.a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className={`w-full py-6 ${action.color} ${action.hoverColor} ${
                  action.isGold ? 'text-navy font-semibold' : 'text-white'
                } transition-all shadow-lg`}
              >
                <action.icon className="w-5 h-5 mr-2" />
                {action.label.toLowerCase().includes("accounts") && action.label.toLowerCase().includes("tax") ? (
                  <span className="text-[#653374] font-bold">accounts<span className="text-orange-500 font-extrabold text-lg">N</span>tax</span>
                ) : (
                  action.label
                )}
              </Button>
            </motion.a>
          );
        })}
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="flex gap-3">
          {quickActions.map((action) => (
            <motion.a
              key={action.label}
              href={action.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1"
            >
              <Button
                variant="outline"
                className="w-full border-border/50 hover:border-gold/50 hover:bg-gold/5"
              >
                <action.icon className="w-4 h-4 mr-2 text-gold" />
                {action.label}
              </Button>
            </motion.a>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default ActionButtons;
