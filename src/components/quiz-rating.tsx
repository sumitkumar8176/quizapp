
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { translations } from '@/lib/translations';

const ratings = [
  { value: '1', label: 'Poor', emoji: '😕' },
  { value: '2', label: 'Fair', emoji: '🙂' },
  { value: '3', label: 'Good', emoji: '👍' },
  { value: '4', label: 'Very Good', emoji: '🤩' },
  { value: '5', label: 'Excellent', emoji: '🔥' },
];

export default function QuizRating({ language }: { language: "english" | "hindi" }) {
  const t = translations[language];
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalRatings, setTotalRatings] = useState<number | null>(null);

  useEffect(() => {
    if (isSubmitted) {
      // Simulate fetching a total number of ratings
      setTotalRatings(Math.floor(Math.random() * (1500 - 300 + 1)) + 300);
    }
  }, [isSubmitted]);


  const handleSubmit = () => {
    if (selectedRating) {
      setIsSubmitted(true);
    }
  };

  const getRatingEmoji = (value: string | null) => {
    if (!value) return '';
    return ratings.find(r => r.value === value)?.emoji || '';
  }

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
              <h2 className="text-2xl font-bold">{t.ratingTitle}</h2>
              <p className="text-muted-foreground">{t.ratingDescription}</p>
              
              <div className="space-y-2 pt-4">
                <p className="font-semibold">{t.ratingPrompt}</p>
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

              <p className="text-sm text-muted-foreground pt-2">{t.ratingFeedback}</p>

              <Button onClick={handleSubmit} disabled={!selectedRating} size="lg" className="w-full">
                <Star className="mr-2 h-4 w-4" />
                {t.giveRating}
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
              <h2 className="text-2xl font-bold">{t.thankYou}</h2>
              <div className="flex items-center justify-center gap-2">
                <p className="text-muted-foreground">{t.youRated}</p>
                <div className="flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-accent-foreground">
                   <span className="text-xl">{getRatingEmoji(selectedRating)}</span>
                   <span className="font-semibold">{selectedRating}/5</span>
                </div>
              </div>

              {totalRatings !== null && (
                 <p className="text-sm text-muted-foreground pt-4">
                    {t.joinOthers(totalRatings)}
                </p>
              )}

              <p className="text-muted-foreground max-w-sm mx-auto pt-2">
                {t.thankYouCommunity}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
