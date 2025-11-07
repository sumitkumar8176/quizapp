
"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookCopy, Loader2 } from "lucide-react";
import { translations } from "@/lib/translations";
import { indianLanguages } from "@/lib/languages";

const formSchema = z.object({
  exam: z.string().min(1, { message: "Please select an exam." }),
  subject: z.string().min(1, { message: "Please select a subject." }),
  topic: z.string().min(2, { message: "Topic must be at least 2 characters." }),
  numberOfQuestions: z.coerce.number().min(1, { message: "You must request at least 1 question." }),
  language: z.string().min(1, { message: "Please select a language." }),
  difficulty: z.string().min(1, { message: "Please select a difficulty." }),
});

type ExamData = {
  [key: string]: string[];
};

const examSubjects: ExamData = {
  "UPSC Civil Services": ["History", "Geography", "Polity & Governance", "Economy", "Environment & Ecology", "Science & Technology", "Current Affairs"],
  "SSC CGL": ["Quantitative Aptitude", "General Intelligence & Reasoning", "English Language", "General Awareness"],
  "IBPS PO": ["Reasoning Ability", "Quantitative Aptitude", "English Language", "General Awareness", "Computer Aptitude"],
  "SBI PO": ["Reasoning Ability", "Quantitative Aptitude", "English Language", "General/Economy/Banking Awareness", "Computer Aptitude"],
  "RRB NTPC": ["Mathematics", "General Intelligence and Reasoning", "General Awareness"],
  "NEET": ["Physics", "Chemistry", "Biology"],
  "JEE Main": ["Physics", "Chemistry", "Mathematics"],
  "JEE Advanced": ["Physics", "Chemistry", "Mathematics"],
  "CAT": ["Verbal Ability & Reading Comprehension", "Data Interpretation & Logical Reasoning", "Quantitative Ability"],
  "GATE": ["Aerospace Engineering", "Chemical Engineering", "Civil Engineering", "Computer Science & Information Technology", "Electrical Engineering", "Electronics & Communication Engineering", "Mechanical Engineering"],
  "CLAT": ["English Language", "Current Affairs, including General Knowledge", "Legal Reasoning", "Logical Reasoning", "Quantitative Techniques"],
  "NDA": ["Mathematics", "General Ability Test"],
  "CDS": ["English", "General Knowledge", "Elementary Mathematics"],
};

const indianExams = Object.keys(examSubjects);

type QuizPyqFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
  selectedExam?: string | null;
  language: "english" | "hindi";
};

export default function QuizPyqForm({ onSubmit, isLoading, selectedExam, language }: QuizPyqFormProps) {
  const t = translations[language];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exam: selectedExam || "",
      subject: "",
      topic: "",
      numberOfQuestions: 10,
      language: "English",
      difficulty: "Medium",
    },
  });

  const watchedExam = useWatch({
    control: form.control,
    name: 'exam',
  });

  useEffect(() => {
    if (selectedExam) {
      form.setValue('exam', selectedExam);
      form.resetField('subject');
      form.resetField('topic');
    }
  }, [selectedExam, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="exam"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">{t.selectExam}</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                form.resetField('subject');
                form.resetField('topic');
              }} value={field.value} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectExamPlaceholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {indianExams.map(exam => (
                    <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {watchedExam && (
          <>
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">{t.selectSubject}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectSubjectPlaceholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {examSubjects[watchedExam]?.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          
             <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">{t.enterTopic}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.pyqTopicPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}


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
              <BookCopy className="mr-2 h-5 w-5" />
              {t.generatePYQQuiz}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
