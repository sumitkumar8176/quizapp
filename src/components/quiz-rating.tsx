"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ratings = [
  { value: '1', label: 'Poor', emoji: '😕' },
  { value: '2', label: 'Fair', emoji: '🙂' },
  { value: '3', label: 'Good', emoji: '👍' },
  { value: '4', label: 'Very Good', emoji: '🤩' },
  { value: '5', label: 'Excellent', emoji: '🔥' },
];

export default function QuizRating() {
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedRating) {
      setIsSubmitted(true);
    }
  };

  return (
    <Card className="text-center">
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="rating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold">🎯 Quiz Completed!</h2>
              <p className="text-muted-foreground">Great job — you’ve finished your quiz on Smart Quick App 🚀</p>
              
              <div className="space-y-2 pt-4">
                <p className="font-semibold">⭐ Please rate your quiz experience:</p>
                <RadioGroup 
                  onValueChange={setSelectedRating}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-2"
                >
                  {ratings.map((rating) => (
                    <Label
                      key={rating.value}
                      htmlFor={`rating-${rating.value}`}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 rounded-md border p-4 cursor-pointer transition-colors hover:bg-accent/10",
                        selectedRating === rating.value && "bg-accent text-accent-foreground border-accent-foreground/50"
                      )}
                    >
                      <RadioGroupItem value={rating.value} id={`rating-${rating.value}`} className="sr-only" />
                      <span className="text-2xl">{rating.emoji}</span>
                      <span className="font-normal">{rating.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <p className="text-sm text-muted-foreground pt-2">💡 Your feedback helps us improve and add more exciting quiz features!</p>

              <Button onClick={handleSubmit} disabled={!selectedRating} size="lg" className="w-full">
                <Star className="mr-2 h-4 w-4" />
                Give Rating
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="thank-you"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="space-y-3 py-8"
            >
              <div className="text-5xl">💖</div>
              <h2 className="text-2xl font-bold">Thank You!</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Thank you for being part of our growing quiz community! Your feedback has been submitted.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
