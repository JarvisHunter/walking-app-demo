import { motion } from "framer-motion";
import { EarlyAccessForm } from "./EarlyAccessForm";

export function Community() {
  return (
    <section id="community" className="py-24 bg-background scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[3rem] overflow-hidden bg-primary px-6 py-16 sm:p-20 text-center text-white shadow-2xl shadow-primary/20"
        >
          {/* Decorative background circles */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-2xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-balance">
              Ready to walk the walk?
            </h2>
            <p className="text-lg md:text-xl font-body text-white/90 mb-10 text-balance">
              Join the pack before we launch. Early access members get exclusive starting treats and a special "Founding Friend" badge for their pup!
            </p>
            
            <EarlyAccessForm variant="secondary" className="max-w-lg mx-auto" />
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-center border-t border-white/20 pt-8">
              <div>
                <p className="text-3xl font-display font-bold">5K+</p>
                <p className="font-body text-white/80 mt-1">Waitlist Members</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold">10M+</p>
                <p className="font-body text-white/80 mt-1">Steps Pledged</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold">Infinite</p>
                <p className="font-body text-white/80 mt-1">Tail Wags</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
