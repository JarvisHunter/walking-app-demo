import { Dog } from "lucide-react";

export function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20 rotate-3">
              <Dog className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground tracking-tight">
              Paws<span className="text-primary">&</span>Paces
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('how-it-works')} className="font-body font-semibold text-foreground/80 hover:text-primary transition-colors">
              How it Works
            </button>
            <button onClick={() => scrollTo('features')} className="font-body font-semibold text-foreground/80 hover:text-primary transition-colors">
              Features
            </button>
            <button onClick={() => scrollTo('community')} className="font-body font-semibold text-foreground/80 hover:text-primary transition-colors">
              Community
            </button>
          </div>

          {/* CTA */}
          <div className="flex items-center">
            <button 
              onClick={() => scrollTo('early-access')}
              className="bg-secondary/10 text-secondary hover:bg-secondary hover:text-white px-5 py-2.5 rounded-full font-display font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              Join Waitlist
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  );
}
