"use server";

import { generateQuizQuestions } from "@/ai/flows/generate-quiz-questions";
import { generateQuizFromContent } from "@/ai/flows/generate-quiz-from-content";
import { z } from "zod";

const QuizTopicSchema = z.object({
  topic: z.string().min(2, { message: "Topic must be at least 2 characters long." }).max(50, { message: "Topic must be at most 50 characters long." }),
  numberOfQuestions: z.coerce.number().min(1, { message: "You must request at least 1 question." }).max(50, { message: "You can request a maximum of 50 questions." }),
  language: z.string(),
});

export async function createQuiz(formData: FormData) {
  const validatedFields = QuizTopicSchema.safeParse({
    topic: formData.get("topic"),
    numberOfQuestions: formData.get("numberOfQuestions"),
    language: formData.get("language"),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten();
    const topicError = errorMessages.fieldErrors.topic?.join(", ");
    const questionsError = errorMessages.fieldErrors.numberOfQuestions?.join(", ");
    return {
      error: topicError || questionsError || "Invalid input.",
    };
  }

  try {
    const questions = await generateQuizQuestions({ 
      topic: validatedFields.data.topic, 
      numberOfQuestions: validatedFields.data.numberOfQuestions,
      language: validatedFields.data.language,
    });
    if (!questions || questions.length === 0) {
      return { error: "Could not generate a quiz for this topic. Please try another one." };
    }
    return { data: questions };
  } catch (e) {
    console.error(e);
    return { error: "An unexpected error occurred while generating the quiz. Please try again." };
  }
}

const QuizContentSchema = z.object({
  contentDataUri: z.string().min(1, { message: "File content is missing." }),
  numberOfQuestions: z.coerce.number().min(1, { message: "You must request at least 1 question." }).max(50, { message: "You can request a maximum of 50 questions." }),
  language: z.string(),
});

export async function createQuizFromContent(formData: FormData) {
  const validatedFields = QuizContentSchema.safeParse({
    contentDataUri: formData.get("contentDataUri"),
    numberOfQuestions: formData.get("numberOfQuestions"),
    language: formData.get("language"),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten();
    const contentError = errorMessages.fieldErrors.contentDataUri?.join(", ");
    const questionsError = errorMessages.fieldErrors.numberOfQuestions?.join(", ");
    return {
      error: contentError || questionsError || "Invalid input.",
    };
  }

  try {
    const questions = await generateQuizFromContent({
      contentDataUri: validatedFields.data.contentDataUri,
      numberOfQuestions: validatedFields.data.numberOfQuestions,
      language: validatedFields.data.language,
    });
    if (!questions || questions.length === 0) {
      return { error: "Could not generate a quiz from the provided content. Please try another file/image." };
    }
    return { data: questions };
  } catch (e) {
    console.error(e);
    return { error: "An unexpected error occurred while generating the quiz. Please try again." };
  }
}
