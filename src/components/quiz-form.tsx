"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Loader2 } from "lucide-react";

const formSchema = z.object({
  topic: z.string().min(2, { message: "Topic must be at least 2 characters." }).max(50),
  numberOfQuestions: z.coerce.number().min(1, { message: "You must request at least 1 question." }).max(50, { message: "You can request a maximum of 50 questions." }),
  language: z.string(),
});

type QuizFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
};

export default function QuizForm({ onSubmit, isLoading }: QuizFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      numberOfQuestions: 10,
      language: "english",
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
              <FormLabel className="text-lg">What do you want a quiz on?</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Roman Empire, Quantum Physics, Taylor Swift" {...field} />
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
              <FormLabel className="text-lg">Enter the number of questions you want in your quiz:</FormLabel>
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
              <FormLabel className="text-lg">Select Quiz Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
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
              Generating...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-5 w-5" />
              Generate Quiz
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
