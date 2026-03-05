import { motion } from "framer-motion";
import { Footprints, Bone, Users } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Adopt & Track",
    description: "Choose your virtual pup and link your health data. Every real-world step you take translates to energy for your pet.",
    icon: Footprints,
    color: "bg-primary",
    lightColor: "bg-primary/10",
    textColor: "text-primary"
  },
  {
    id: 2,
    title: "Feed & Grow",
    description: "Hit your daily step goals to earn 'treats'. Use them to feed, play with, and customize your dog as it levels up.",
    icon: Bone,
    color: "bg-secondary",
    lightColor: "bg-secondary/10",
    textColor: "text-secondary"
  },
  {
    id: 3,
    title: "Flex & Connect",
    description: "Join weekly challenges, climb the leaderboards, and share your pup's progress with a friendly community.",
    icon: Users,
    color: "bg-accent",
    lightColor: "bg-accent/20",
    textColor: "text-accent-foreground"
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-display font-semibold tracking-wider uppercase text-sm mb-3">How it works</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Gamify your fitness journey
          </h3>
          <p className="text-lg text-muted-foreground font-body">
            Getting healthy is easier when you have a virtual best friend counting on you. Here is how Paws & Paces makes walking fun.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (hidden on mobile) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border/60 -z-10 border-t-2 border-dashed border-border" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative bg-background rounded-[2rem] p-8 shadow-soft border border-border/50 text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className={`w-20 h-20 mx-auto rounded-2xl ${step.color} shadow-lg shadow-${step.color}/30 flex items-center justify-center text-white mb-6 -mt-14 rotate-3 border-4 border-white`}>
                <step.icon className="w-8 h-8" strokeWidth={2.5} />
              </div>
              
              <h4 className="text-2xl font-display font-bold text-foreground mb-4">
                {step.title}
              </h4>
              <p className="text-muted-foreground font-body leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
