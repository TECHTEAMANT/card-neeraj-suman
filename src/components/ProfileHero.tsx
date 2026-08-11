import { motion } from "framer-motion";
import { Briefcase, Sparkles, MapPin, Quote, Building2 } from "lucide-react";
import { profile } from "@/lib/profile";

const ProfileHero = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 pt-8 pb-6 px-4"
    >
      {/* Profile Photo */}
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          {/* Glow ring */}
          <div className="absolute -inset-2 bg-gradient-to-r from-gold via-gold-light to-gold rounded-full blur-md opacity-50 pulse-gold" />
          
          {/* Photo container */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden gold-border p-1">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img 
                src={profile.photo} 
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* AI Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -bottom-1 -right-1 bg-gradient-to-r from-gold to-gold-light rounded-full p-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-navy" />
          </motion.div>
        </motion.div>
      </div>

      {/* Name & Title */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center space-y-2"
      >
        <h1 className="font-display text-3xl font-bold gold-gradient-text">
          {profile.name}
        </h1>
        
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Briefcase className="w-4 h-4 text-gold" />
          <p className="text-sm font-medium text-foreground/90">{profile.title}</p>
        </div>

        {profile.company && (
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
            <Building2 className="w-3.5 h-3.5 text-gold/80" />
            <p className="text-xs font-semibold text-gold/90">{profile.company}</p>
          </div>
        )}
      </motion.div>

      {/* Custom Note / Bio */}
      {profile.note && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 p-3.5 rounded-xl bg-navy-light/60 border border-gold/20 backdrop-blur-md text-center shadow-md relative"
        >
          <Quote className="w-4 h-4 text-gold/40 absolute top-2 left-2" />
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic px-3">
            "{profile.note}"
          </p>
        </motion.div>
      )}

      {/* Office Address & Location Card */}
      {(profile.address || profile.location_url) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-4 p-3.5 rounded-xl bg-navy-light/40 border border-border/50 backdrop-blur-sm flex items-start gap-3 text-left"
        >
          <div className="p-2 rounded-lg bg-gold/10 border border-gold/20 shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-gold" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gold uppercase tracking-wider">Office Address</p>
            {profile.address && (
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                {profile.address.replace(/;/g, ', ')}
              </p>
            )}
            {profile.location_url && (
              <a
                href={profile.location_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-gold hover:underline mt-1.5 font-medium"
              >
                Open in Google Maps ↗
              </a>
            )}
          </div>
        </motion.div>
      )}

      {/* Expertise Tags */}
      {profile.tags && profile.tags.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mt-5"
        >
          {profile.tags.map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="px-3 py-1 text-xs rounded-full bg-navy-light/80 text-gold border border-gold/20 backdrop-blur-sm"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
};

export default ProfileHero;
