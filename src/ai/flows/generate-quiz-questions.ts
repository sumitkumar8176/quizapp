'use server';

/**
 * @fileOverview A quiz question generator AI agent.
 *
 * - generateQuizQuestions - A function that handles the quiz generation process.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsInputSchema = z.string().describe('The topic for which to generate quiz questions.');
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const GenerateQuizQuestionsOutputSchema = z.array(
  z.object({
    question: z.string().describe('The quiz question.'),
    options: z.array(z.string()).describe('The possible answers to the question.'),
    correctAnswer: z.string().describe('The correct answer to the question.'),
  })
).describe('An array of quiz questions with options and correct answers.');
export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;

export async function generateQuizQuestions(topic: GenerateQuizQuestionsInput): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(topic);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
  prompt: `Generate 50 quiz questions about {{{$input}}}. For each question, provide 4 multiple-choice options and identify the correct answer.`,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async topic => {
    const {output} = await prompt(topic);
    return output!;
  }
);
