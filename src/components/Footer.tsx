import { motion } from "framer-motion";
import { Sparkles, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/profile";

const Footer = () => {
  const formUrl = profile.form_url || "https://docs.google.com/forms/d/e/1FAIpQLSeZb5deaIEFoEDX_yYjzmBTGzPGepwA-FxJn_158RBzSuY1Wg/viewform";

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="mt-8 pb-10 px-4 space-y-6"
    >
      {/* Bottom CTA Button — Fill Form / Open Google Form */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full"
      >
        <a
          href={formUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <Button className="w-full py-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 text-white font-bold text-base shadow-xl rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <FileText className="w-5 h-5 text-emerald-200" />
            <span>Create Profile QR Code </span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
          </Button>
        </a>
      </motion.div>

      <div className="text-center space-y-3">
        {/* Powered by accountsNtax */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-light/60 border border-gold/20 backdrop-blur-sm shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-semibold text-foreground/90">
            Powered by <span className="font-bold tracking-tight text-[#653374]">accounts<span className="text-orange-500 font-extrabold text-sm">N</span>tax</span>
          </span>
        </div>

        {/* Tagline */}
        <p className="text-xs text-muted-foreground italic">
          "Automate the routine, reclaim your time"
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
