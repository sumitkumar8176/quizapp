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

const GenerateQuizQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate quiz questions.'),
  numberOfQuestions: z.number().describe('The number of questions to generate.'),
});
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const GenerateQuizQuestionsOutputSchema = z.array(
  z.object({
    question: z.string().describe('The quiz question.'),
    options: z.array(z.string()).describe('The possible answers to the question.'),
    correctAnswer: z.string().describe('The correct answer to the question.'),
    explanation: z.string().describe('A detailed explanation of why the correct answer is right.'),
  })
).describe('An array of quiz questions with options and correct answers.');
export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;

export async function generateQuizQuestions(input: GenerateQuizQuestionsInput): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
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
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
