import { Module } from "./module";


export interface Course {
    id: string;
    title: string;
    description: string;
    image: string;
    modules: Module[];
    totalQuestions: number;
    completedQuestions: number;
  }