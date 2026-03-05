import { motion } from "framer-motion";
import { EarlyAccessForm } from "./EarlyAccessForm";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Playful background blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/15 text-secondary font-semibold font-body mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
              </span>
              Coming Soon to iOS & Android
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6 text-balance">
              Don't Let Your Best Friend Down.<br/>
              <span className="text-primary">Walk.</span> <span className="text-secondary">Grow.</span> <span className="text-accent">Connect.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground font-body leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
              Turn your daily steps into health for your virtual furry friend. Get fit, earn treats, and join a thriving community of dog lovers!
            </p>

            <div id="early-access" className="scroll-mt-32 max-w-md mx-auto lg:mx-0">
              <EarlyAccessForm variant="primary" />
              <p className="mt-4 text-sm text-muted-foreground font-body">
                Join 5,000+ others already on the waitlist! 🎉
              </p>
            </div>
          </motion.div>

          {/* Right Content - Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            {/* abstract fun background shape behind mockup */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[3rem] transform rotate-3 scale-105 -z-10" />
            
            <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-card">
              {/* playful dog illustration or active lifestyle photo */}
              {/* healthy woman running with dog */}
              <img 
                src="https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop" 
                alt="App experience" 
                className="w-full h-auto aspect-[4/5] object-cover"
              />
              
              {/* Floating gamified UI element overlay */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center font-display font-bold text-xl">
                  +50
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">Steps Tracked!</p>
                  <p className="text-sm font-body text-muted-foreground">Buster is feeling energetic 🐕</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
