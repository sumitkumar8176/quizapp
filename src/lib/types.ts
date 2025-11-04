import { z } from "zod";

export const QuizQuestionSchema = z.object({
  question: z.string().describe("The quiz question."),
  options: z.array(z.string()).describe("The possible answers to the question."),
  correctAnswer: z.string().describe("The correct answer to the question."),
  explanation: z.string().describe("A detailed explanation of why the correct answer is right."),
});

export const QuizSchema = z.array(QuizQuestionSchema).describe("An array of quiz questions with options and correct answers.");

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type Quiz = z.infer<typeof QuizSchema>;
