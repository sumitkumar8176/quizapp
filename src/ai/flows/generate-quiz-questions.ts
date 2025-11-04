'use server';

/**
 * @fileOverview A quiz question generator AI agent.
 *
 * - generateQuizQuestions - A function that handles the quiz generation process.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {Quiz, QuizSchema} from '@/lib/types';
import {z} from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate quiz questions.'),
  numberOfQuestions: z.number().describe('The number of questions to generate.'),
});
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

export type GenerateQuizQuestionsOutput = Quiz;

export async function generateQuizQuestions(input: GenerateQuizQuestionsInput): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: QuizSchema},
  prompt: `You are an expert at creating educational quizzes. Your task is to generate {{{numberOfQuestions}}} important and relevant questions on the given topic.

Topic: {{{topic}}}

For each question, provide:
1.  A clear and concise question.
2.  4 multiple-choice options.
3.  The correct answer.
4.  A detailed explanation for the correct answer to help with understanding.`,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: QuizSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
