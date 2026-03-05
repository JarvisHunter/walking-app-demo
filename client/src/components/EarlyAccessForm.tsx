import { useState } from "react";
import { useSubmitEarlyAccess } from "@/hooks/use-early-access";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

interface EarlyAccessFormProps {
  variant?: "primary" | "secondary";
  className?: string;
}

export function EarlyAccessForm({ variant = "primary", className = "" }: EarlyAccessFormProps) {
  const [email, setEmail] = useState("");
  const { mutate, isPending } = useSubmitEarlyAccess();
  const { toast } = useToast();

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#F97316', '#22C55E', '#FBBF24']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#F97316', '#22C55E', '#FBBF24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    mutate({ email }, {
      onSuccess: () => {
        setEmail("");
        triggerConfetti();
        toast({
          title: "🐾 You're on the list!",
          description: "Get ready to walk, grow, and connect. We'll be in touch soon!",
          duration: 5000,
        });
      },
      onError: (error) => {
        toast({
          title: "Ruh roh!",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const isPrimary = variant === "primary";

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative flex flex-col sm:flex-row items-center gap-3 ${className}`}
    >
      <div className="relative w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email for early access..."
          required
          disabled={isPending}
          className={`
            w-full px-6 py-4 rounded-full text-base lg:text-lg outline-none
            transition-all duration-300 font-body
            ${isPrimary 
              ? "bg-white border-2 border-border shadow-soft focus:border-primary focus:ring-4 focus:ring-primary/15 text-foreground placeholder:text-muted-foreground" 
              : "bg-white/10 border-2 border-white/20 text-white placeholder:text-white/60 focus:bg-white focus:text-foreground focus:border-white focus:ring-4 focus:ring-white/30 backdrop-blur-sm"}
            disabled:opacity-60 disabled:cursor-not-allowed
          `}
        />
      </div>
      
      <button
        type="submit"
        disabled={isPending || !email}
        className={`
          w-full sm:w-auto flex-shrink-0 px-8 py-4 rounded-full font-display font-semibold text-lg
          flex items-center justify-center gap-2 btn-bounce
          ${isPrimary
            ? "bg-primary text-white shadow-float hover:shadow-primary/30"
            : "bg-white text-primary shadow-lg hover:shadow-white/20"}
          disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
        `}
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Joining...</span>
          </>
        ) : (
          <>
            <span>Get Early Access</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
