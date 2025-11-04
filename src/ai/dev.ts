'use server';

import {config} from 'dotenv';
config();

import '@/ai/flows/generate-quiz-questions.ts';
import '@/ai/flows/generate-quiz-from-content.ts';
import '@/ai/flows/generate-quiz-from-pyq.ts';
