import { Dog, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-white py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Dog className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Paws<span className="text-primary">&</span>Paces
            </span>
          </div>
          
          <p className="font-body text-white/60 text-sm text-center md:text-left flex items-center gap-2">
            Built with <Heart className="w-4 h-4 text-primary" /> for humans and their virtual best friends.
          </p>
          
          <div className="flex gap-6 font-body text-sm font-semibold">
            <a href="#" className="text-white/60 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">Contact</a>
          </div>

        </div>
      </div>
    </footer>
  );
}
