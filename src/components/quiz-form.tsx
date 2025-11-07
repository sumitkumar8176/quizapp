
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Lightbulb, Loader2 } from "lucide-react";
import { translations } from "@/lib/translations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { indianLanguages } from "@/lib/languages";

const formSchema = z.object({
  topic: z.string().min(2, { message: "Topic must be at least 2 characters." }).max(50),
  numberOfQuestions: z.coerce.number().min(1, { message: "You must request at least 1 question." }),
  language: z.string().min(1, { message: "Please select a language." }),
  difficulty: z.string().min(1, { message: "Please select a difficulty." }),
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
      language: "English",
      difficulty: "Medium",
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
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">{t.quizLanguage}</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectLanguage} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {indianLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">{t.difficulty}</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectDifficulty} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Easy">{t.easy}</SelectItem>
                  <SelectItem value="Medium">{t.medium}</SelectItem>
                  <SelectItem value="Hard">{t.hard}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
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
