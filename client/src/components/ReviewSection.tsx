import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function StarRating({ rating, onRate, interactive = false }: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`transition-colors ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              star <= (hover || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewSection() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { rating: number; comment: string }) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit review");
      }
      return res.json();
    },
    onSuccess: () => {
      setRating(0);
      setComment("");
      toast({
        title: "Thank you!",
        description: "Your review has been submitted successfully.",
        duration: 4000,
      });
    },
    onError: (error) => {
      toast({
        title: "Oops!",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment) {
      toast({
        title: "Missing fields",
        description: "Please fill in your rating and comment.",
        variant: "destructive",
      });
      return;
    }
    mutate({ rating, comment });
  };

  return (
    <section id="reviews" className="py-24 bg-muted/30 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Share Your Feedback
          </h2>
          <p className="text-lg text-muted-foreground">
            Your anonymous feedback helps us build the best walking experience!
          </p>
        </motion.div>

        {/* Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border max-w-2xl mx-auto"
        >
          <h3 className="text-xl font-semibold mb-6">Leave Anonymous Feedback</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Rating
              </label>
              <div className="flex items-center gap-3">
                <StarRating rating={rating} onRate={setRating} interactive />
                {rating > 0 && (
                  <span className="text-sm text-muted-foreground font-medium">
                    {rating}/10
                  </span>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="review-comment" className="block text-sm font-medium mb-2">
                Your Recommendation
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you think about the app, or suggest improvements..."
                rows={4}
                maxLength={1000}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {comment.length}/1000
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Submitting..." : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Review
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
