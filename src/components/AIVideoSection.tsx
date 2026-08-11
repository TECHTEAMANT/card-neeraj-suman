import { motion } from "framer-motion";
import { Play, Sparkles, Bot, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { profile } from "@/lib/profile";

const AIVideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // YouTube video ID extracted from the shared link
  const videoId = "uF9CU2WqGmk";
  const videoEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  // Autoplay when section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isPlaying) {
            // Auto-play when 50% of the section is visible
            setIsPlaying(true);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mx-4 mt-6"
    >
      <div className="glass-card p-4 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-gold/20 to-gold-light/20">
            <Bot className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1">
              AI Digital Twin
              <Sparkles className="w-3 h-3 text-gold" />
            </h3>
            {/* <p className="text-[10px] text-muted-foreground">Powered by AI Avatar Technology</p> */}
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-navy-light to-navy">
          {!isPlaying ? (
            <>
              {/* Static preview with avatar effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-gold/30 via-gold-light/30 to-gold/30 rounded-full blur-xl animate-pulse" />
                  <img 
                    src={profile.photo}
                    alt={`${profile.name} AI Avatar`}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gold/50 relative z-10"
                  />
                </div>
              </div>
              
              {/* Play button overlay */}
              <div 
                 className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-navy-light to-navy cursor-pointer group"
                  onClick={() => setIsPlaying(!isPlaying)}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-gold to-gold-light flex items-center justify-center shadow-lg"
                >
                  <Play className="w-6 h-6 text-navy ml-1" />
                </motion.div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-navy/80 text-xs text-gold">
                0:56
              </div>
            </>
          ) : (
            /* YouTube Video Embed */
            <div className="absolute inset-0">
              <iframe
                src={videoEmbedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="AI Digital Twin Video"
              />
              
              {/* Close button */}
              <button 
                onClick={() => setIsPlaying(false)}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-navy/80 hover:bg-navy text-gold/70 hover:text-gold transition-colors"
                aria-label="Close video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-3">
          {isPlaying ? 'Close to return' : 'Tap to watch my AI introduction'}
        </p>
      </div>
    </motion.section>
  );
};

export default AIVideoSection;
