"use server";

import { generateQuizQuestions } from "@/ai/flows/generate-quiz-questions";
import { z } from "zod";

const QuizTopicSchema = z.object({
  topic: z.string().min(2, { message: "Topic must be at least 2 characters long." }).max(50, { message: "Topic must be at most 50 characters long." }),
});

export async function createQuiz(formData: FormData) {
  const validatedFields = QuizTopicSchema.safeParse({
    topic: formData.get("topic"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.topic?.join(", "),
    };
  }

  try {
    const questions = await generateQuizQuestions(validatedFields.data.topic);
    if (!questions || questions.length === 0) {
      return { error: "Could not generate a quiz for this topic. Please try another one." };
    }
    return { data: questions };
  } catch (e) {
    console.error(e);
    return { error: "An unexpected error occurred while generating the quiz. Please try again." };
  }
}
