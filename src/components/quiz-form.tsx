
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Lightbulb, Loader2 } from "lucide-react";
import { translations } from "@/lib/translations";

const formSchema = z.object({
  topic: z.string().min(2, { message: "Topic must be at least 2 characters." }).max(50),
  numberOfQuestions: z.coerce.number().min(1, { message: "You must request at least 1 question." }),
  timerDuration: z.coerce.number().min(0, { message: "Timer must be a positive number." }).max(120, { message: "Timer cannot exceed 120 minutes." }).nullable(),
});

type QuizFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
  language: "english" | "hindi";
};

export default function QuizForm({ onSubmit, isLoading, language }: QuizFormProps) {
  const t = translations[language];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      numberOfQuestions: 10,
      timerDuration: null,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">{t.quizOnWhat}</FormLabel>
              <FormControl>
                <Input placeholder={t.topicPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="numberOfQuestions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">{t.numQuestions}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="timerDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">{t.timerLabel}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={t.optional} {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : e.target.value)} />
                </FormControl>
                 <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t.generating}...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-5 w-5" />
              {t.generateQuiz}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
