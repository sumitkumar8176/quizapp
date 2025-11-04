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
  language: z.string().describe('The language for the quiz (e.g., "English", "Hindi").'),
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
  prompt: `You are an expert at creating educational quizzes in multiple languages from provided content. Your task is to analyze the following content and generate {{{numberOfQuestions}}} important and relevant questions in {{{language}}}.

Content:
{{media url=contentDataUri}}

For each question, provide:
1.  A clear and concise question based on the content, in {{{language}}}.
2.  4 multiple-choice options, in {{{language}}}.
3.  The correct answer, in {{{language}}}.
4.  A detailed explanation for the correct answer to help with understanding, referencing the provided content, in {{{language}}}.

IMPORTANT: For any mathematical equations or values, present them in standard mathematical notation. DO NOT wrap mathematical expressions in dollar signs (e.g., use "x^2 + y^2 = r^2" instead of "$x^2 + y^2 = r^2$").`,
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
