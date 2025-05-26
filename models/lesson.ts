import { Quiz } from "./quiz";

export interface Lesson {
    id: string;
    title: string;
    content: string;
    quiz: Quiz;
    completed: boolean;
  }