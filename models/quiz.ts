import { QuizOption } from "./quizOption";

export interface Quiz {
    id: string;
    question: string;
    options: QuizOption[];
    correctOptionId: string;
    completed: boolean;
    selectedOptionId?: string;
  }