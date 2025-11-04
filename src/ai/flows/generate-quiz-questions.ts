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
  prompt: `You are a quiz generator. Generate the 50 most important and relevant questions on the following topic: {{{$input}}}. The questions should cover all key concepts, definitions, short answers, and understanding-based points related to that topic. For each question, provide 4 options and a correct answer. Return a JSON array of objects, where each object has a question, options, and correctAnswer field. Make sure the correct answer is one of the options.

For example:

[
  {
    "question": "What is the capital of France?",
    "options": ["London", "Paris", "Berlin", "Rome"],
    "correctAnswer": "Paris"
  },
  {
    "question": "What is the highest mountain in the world?",
    "options": ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"],
    "correctAnswer": "Mount Everest"
  }
]
`,
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
