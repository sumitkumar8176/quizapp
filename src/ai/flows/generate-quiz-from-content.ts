'use server';
/**
 * @fileOverview A quiz question generator AI agent that uses content from a file or image.
 *
 * - generateQuizFromContent - A function that handles the quiz generation process from content.
 * - GenerateQuizFromContentInput - The input type for the generateQuizFromContent function.
 * - GenerateQuizFromContentOutput - The return type for the generateQuizFromContent function.
 */

import {ai} from '@/ai/genkit';
import {Quiz, QuizSchema} from '@/lib/types';
import {z} from 'genkit';

const GenerateQuizFromContentInputSchema = z.object({
  contentDataUri: z
    .string()
    .describe(
      "The content to generate the quiz from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  numberOfQuestions: z.number().describe('The number of questions to generate.'),
});
export type GenerateQuizFromContentInput = z.infer<typeof GenerateQuizFromContentInputSchema>;

export type GenerateQuizFromContentOutput = Quiz;

export async function generateQuizFromContent(input: GenerateQuizFromContentInput): Promise<GenerateQuizFromContentOutput> {
  return generateQuizFromContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromContentPrompt',
  input: {schema: GenerateQuizFromContentInputSchema},
  output: {schema: QuizSchema},
  prompt: `You are an expert at creating educational quizzes from provided content. Your task is to analyze the following content and generate {{{numberOfQuestions}}} important and relevant questions.

Content:
{{media url=contentDataUri}}

For each question, provide:
1.  A clear and concise question based on the content.
2.  4 multiple-choice options.
3.  The correct answer.
4.  A detailed explanation for the correct answer to help with understanding, referencing the provided content.`,
});

const generateQuizFromContentFlow = ai.defineFlow(
  {
    name: 'generateQuizFromContentFlow',
    inputSchema: GenerateQuizFromContentInputSchema,
    outputSchema: QuizSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
