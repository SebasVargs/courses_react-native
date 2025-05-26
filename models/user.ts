import { Goal } from "./goal";

export interface User {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    goals: Goal[];
    enrolledCourses: string[]; // IDs de cursos inscritos
  }