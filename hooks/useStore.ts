// store/index.ts
import { create } from 'zustand';
import coursesData from '../data/courses.json';
import { User } from '@/models/user';
import { Course } from '@/models/course';

// Definir la interfaz del estado global
interface StoreState {
  // Estado del usuario
  userState: User | null;
  setUserState: (user: User) => void;
  clearUserState: () => void;
  
  // Estado de los cursos
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  updateCourseProgress: (courseId: string, completedQuestions: number) => void;
  
  // Otros estados globales
  isFirstLaunch: boolean;
  setFirstLaunch: (value: boolean) => void;
  
  // Estado de tema (claro/oscuro)
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Crear el store con Zustand
export const useStore = create<StoreState>(set => ({
  // Estado inicial del usuario
  userState: null,
  setUserState: (user: User) => set({ userState: user }),
  clearUserState: () => set({ userState: null }),
  
  // Estado inicial de cursos (cargados desde el JSON de datos)
  courses: coursesData.courses,
  setCourses: (courses: any) => set({ courses }),
  updateCourseProgress: (courseId: any, completedQuestions: any) => 
    set((state: any) => ({
      courses: state.courses.map((course: Course) => 
        course.id === courseId 
          ? { ...course, completedQuestions } 
          : course
      )
    })),
  
  // Otros estados iniciales
  isFirstLaunch: true,
  setFirstLaunch: (value: any) => set({ isFirstLaunch: value }),
  
  // Estado de tema
  isDarkMode: false,
  toggleDarkMode: () => set((state: any) => ({ isDarkMode: !state.isDarkMode })),
}));

// Selector para obtener el usuario actual
export const useUserSelector = () => useStore((state: any) => state.userState);

// Selector para obtener los cursos
export const useCoursesSelector = () => useStore((state: any) => state.courses);

// Selector para el tema
export const useDarkModeSelector = () => useStore((state: any) => state.isDarkMode);