'use server';

/**
 * @fileOverview A quiz question generator AI agent for Previous Year Questions (PYQs).
 *
 * - generateQuizFromPyq - A function that handles the PYQ quiz generation process.
 * - GenerateQuizFromPyqInput - The input type for the generateQuizFromPyq function.
 * - GenerateQuizFromPyqOutput - The return type for the generateQuizFromPyq function.
 */

import {ai} from '@/ai/genkit';
import {Quiz, QuizSchema} from '@/lib/types';
import {z} from 'genkit';

const GenerateQuizFromPyqInputSchema = z.object({
  exam: z.string().describe('The Indian competitive exam for which to generate PYQ-based quiz questions.'),
  numberOfQuestions: z.number().describe('The number of questions to generate.'),
  language: z.string().describe('The language for the quiz (e.g., "English", "Hindi").'),
});
export type GenerateQuizFromPyqInput = z.infer<typeof GenerateQuizFromPyqInputSchema>;

export type GenerateQuizFromPyqOutput = Quiz;

export async function generateQuizFromPyq(input: GenerateQuizFromPyqInput): Promise<GenerateQuizFromPyqOutput> {
  return generateQuizFromPyqFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromPyqPrompt',
  input: {schema: GenerateQuizFromPyqInputSchema},
  output: {schema: QuizSchema},
  prompt: `You are an expert at creating educational quizzes based on Previous Year Questions (PYQs) for major Indian competitive exams. Your task is to generate {{{numberOfQuestions}}} important and relevant questions in {{{language}}} based on the patterns and topics from past papers for the specified exam.

Exam: {{{exam}}}

For each question, provide:
1.  A clear and concise question, in {{{language}}}, that reflects the style and difficulty of the exam.
2.  4 multiple-choice options, in {{{language}}}.
3.  The correct answer, in {{{language}}}.
4.  A detailed explanation for the correct answer to help with understanding, in {{{language}}}.

IMPORTANT: For any mathematical equations or values, present them in standard mathematical notation. DO NOT wrap mathematical expressions in dollar signs (e.g., use "x^2 + y^2 = r^2" instead of "$x^2 + y^2 = r^2$").`,
});

const generateQuizFromPyqFlow = ai.defineFlow(
  {
    name: 'generateQuizFromPyqFlow',
    inputSchema: GenerateQuizFromPyqInputSchema,
    outputSchema: QuizSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
