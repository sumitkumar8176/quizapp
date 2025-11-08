
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

const examSubjects: { [key: string]: string[] } = {
  // National Level
  "UPSC Civil Services": ["History", "Geography", "Polity & Governance", "Economy", "Environment & Ecology", "Science & Technology", "Current Affairs"],
  "SSC CGL": ["Quantitative Aptitude", "General Intelligence & Reasoning", "English Language", "General Awareness"],
  "SSC CHSL": ["English Language", "Quantitative Aptitude", "General Intelligence", "General Awareness"],
  "SSC MTS": ["Numerical and Mathematical Ability", "Reasoning Ability and Problem Solving", "General Awareness", "English Language"],
  "SSC CPO": ["General Intelligence and Reasoning", "General Knowledge and General Awareness", "Quantitative Aptitude", "English Comprehension"],
  "SSC GD Constable": ["General Intelligence & Reasoning", "General Knowledge & General Awareness", "Elementary Mathematics", "English/Hindi"],
  "IBPS PO": ["Reasoning Ability", "Quantitative Aptitude", "English Language", "General Awareness", "Computer Aptitude"],
  "SBI PO": ["Reasoning Ability", "Quantitative Aptitude", "English Language", "General/Economy/Banking Awareness", "Computer Aptitude"],
  "RRB NTPC": ["Mathematics", "General Intelligence and Reasoning", "General Awareness"],
  "RRB ALP": ["Mathematics", "General Intelligence and Reasoning", "General Science", "General Awareness on Current Affairs"],
  "RRB JE": ["Mathematics", "General Intelligence & Reasoning", "General Awareness", "General Science"],
  "RRB Group D": ["General Science", "Mathematics", "General Intelligence & Reasoning", "General Awareness & Current Affairs"],
  "NEET": ["Physics", "Chemistry", "Biology"],
  "JEE Main": ["Physics", "Chemistry", "Mathematics"],
  "JEE Advanced": ["Physics", "Chemistry", "Mathematics"],
  "CAT": ["Verbal Ability & Reading Comprehension", "Data Interpretation & Logical Reasoning", "Quantitative Ability"],
  "GATE": ["Aerospace Engineering", "Chemical Engineering", "Civil Engineering", "Computer Science & Information Technology", "Electrical Engineering", "Electronics & Communication Engineering", "Mechanical Engineering"],
  "CLAT": ["English Language", "Current Affairs, including General Knowledge", "Legal Reasoning", "Logical Reasoning", "Quantitative Techniques"],
  "NDA": ["Mathematics", "General Ability Test"],
  "CDS": ["English", "General Knowledge", "Elementary Mathematics"],

  // State Level
  "APPSC": ["General Studies", "Concerned Subject"],
  "EAMCET": ["Physics", "Chemistry", "Mathematics/Biology"],
  "AP-PGECET": ["Concerned Engineering Subject"],
  "UPPSC": ["General Studies", "CSAT", "Optional Subject"],
  "UPTET": ["Child Development", "Language I", "Language II", "Mathematics", "Environmental Studies"],
  "UPSEE": ["Physics", "Chemistry", "Mathematics"],
  "MPSC": ["Marathi", "English", "General Studies"],
  "MHT-CET": ["Physics", "Chemistry", "Mathematics/Biology"],
  "MAH-CET": ["Logical Reasoning", "Abstract Reasoning", "Quantitative Aptitude", "Verbal Ability"],
  "BPSC": ["General Studies", "Optional Subject"],
  "BTET": ["Child Development", "Language I", "Language II", "Mathematics", "Environmental Studies"],
  "BCECE": ["Physics", "Chemistry", "Mathematics/Biology"],
  "WBPSC": ["General Studies", "Concerned Subject"],
  "WBJEE": ["Physics", "Chemistry", "Mathematics"],
  "WB-SET": ["General Paper", "Concerned Subject"],
  "TNPSC": ["General Studies", "Aptitude", "General Tamil/English"],
  "TANCET": ["Concerned Subject"],
  "TNEA": ["Mathematics", "Physics", "Chemistry"],
  "MPPSC": ["General Studies", "CSAT", "Optional Subject"],
  "MP-PAT": ["Agriculture Science"],
  "MP-TET": ["Child Development", "Language I", "Language II", "Mathematics", "Environmental Studies"],
  "RPSC": ["General Knowledge", "Concerned Subject"],
  "REET": ["Child Development", "Language I", "Language II", "Mathematics", "Environmental Studies"],
  "RPET": ["Physics", "Chemistry", "Mathematics"],
  "KPSC": ["General Studies", "Concerned Subject"],
  "KCET": ["Physics", "Chemistry", "Mathematics/Biology"],
  "K-SET": ["General Paper", "Concerned Subject"],
  "GPSC": ["General Studies", "Optional Subject"],
  "GUJCET": ["Physics", "Chemistry", "Mathematics/Biology"],
  "G-SET": ["General Paper", "Concerned Subject"],
  "Kerala PSC": ["General Knowledge", "Current Affairs", "Concerned Subject"],
  "KEAM": ["Physics", "Chemistry", "Mathematics"],
  "K-TET": ["Child Development", "Language I", "Language II", "Mathematics", "Science"],
};

const allExams = Object.keys(examSubjects);

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
                  {allExams.map(exam => (
                    <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {watchedExam && examSubjects[watchedExam] && (
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

        <Button type="submit" className="w-full" size="lg" disabled={isLoading || !watchedExam || !examSubjects[watchedExam]}>
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

    