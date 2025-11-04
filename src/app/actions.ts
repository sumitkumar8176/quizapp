"use server";

import { generateQuizQuestions } from "@/ai/flows/generate-quiz-questions";
import { generateQuizFromContent } from "@/ai/flows/generate-quiz-from-content";
import { generateQuizFromPyq } from "@/ai/flows/generate-quiz-from-pyq";
import { z } from "zod";

const QuizTopicSchema = z.object({
  topic: z.string().min(2, { message: "Topic must be at least 2 characters long." }).max(50, { message: "Topic must be at most 50 characters long." }),
  numberOfQuestions: z.coerce.number().min(1, { message: "You must request at least 1 question." }),
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
  numberOfQuestions: z.coerce.number().min(1, { message: "You must request at least 1 question." }),
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

const QuizPyqSchema = z.object({
  exam: z.string().min(1, { message: "Please select an exam." }),
  subject: z.string().min(1, { message: "Please select a subject." }),
  topic: z.string().min(2, { message: "Topic must be at least 2 characters." }).max(50),
  numberOfQuestions: z.coerce.number().min(1, { message: "You must request at least 1 question." }),
  language: z.string(),
});

export async function createQuizFromPyq(formData: FormData) {
  const validatedFields = QuizPyqSchema.safeParse({
    exam: formData.get("exam"),
    subject: formData.get("subject"),
    topic: formData.get("topic"),
    numberOfQuestions: formData.get("numberOfQuestions"),
    language: formData.get("language"),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten();
    const examError = errorMessages.fieldErrors.exam?.join(", ");
    const subjectError = errorMessages.fieldErrors.subject?.join(", ");
    const topicError = errorMessages.fieldErrors.topic?.join(", ");
    const questionsError = errorMessages.fieldErrors.numberOfQuestions?.join(", ");
    return {
      error: examError || subjectError || topicError || questionsError || "Invalid input.",
    };
  }

  try {
    const questions = await generateQuizFromPyq({
      exam: validatedFields.data.exam,
      subject: validatedFields.data.subject,
      topic: validatedFields.data.topic,
      numberOfQuestions: validatedFields.data.numberOfQuestions,
      language: validatedFields.data.language,
    });
    if (!questions || questions.length === 0) {
      return { error: "Could not generate a PYQ quiz for this combination. Please try another one." };
    }
    return { data: questions };
  } catch (e) {
    console.error(e);
    return { error: "An unexpected error occurred while generating the quiz. Please try again." };
  }
}
