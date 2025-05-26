// services/userService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal } from '../app/models/goal';
import { User } from '../app/models/user';

// Clave para almacenar datos del usuario en AsyncStorage
const USER_STORAGE_KEY = '@CoursesApp:User';

// Usuario predeterminado para desarrollo
const DEFAULT_USER: User = {
  id: 'user-1',
  name: 'Usuario Demo',
  email: 'usuario@demo.com',
  profileImage: 'https://placehold.co/300x300?text=User',
  goals: [
    {
      id: 'goal-1',
      title: 'Completar curso de React Native',
      target: 10,
      current: 2,
      type: 'lessons',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 días
    },
    {
      id: 'goal-2',
      title: 'Aprender TypeScript',
      target: 5,
      current: 1,
      type: 'lessons',
    }
  ],
  enrolledCourses: ['course-1', 'course-2']
};

// Obtener datos del usuario
export const getUserData = async (): Promise<User> => {
  try {
    const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
    
    if (userData) {
      // Parsear los datos almacenados
      const parsedUser = JSON.parse(userData);
      
      // Convertir las fechas de string a objetos Date
      if (parsedUser.goals) {
        parsedUser.goals = parsedUser.goals.map((goal: any) => ({
          ...goal,
          deadline: goal.deadline ? new Date(goal.deadline) : undefined
        }));
      }
      
      return parsedUser;
    }
    
    // Si no hay datos almacenados, usar el usuario predeterminado
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return DEFAULT_USER;
  }
};

// Actualizar datos del usuario
export const updateUserData = async (userData: User): Promise<User> => {
  try {
    // Almacenar los datos actualizados
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Error al actualizar datos del usuario:', error);
    throw error;
  }
};

// Cerrar sesión del usuario (eliminar datos)
export const logoutUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

// Actualizar el progreso de un curso para el usuario
export const updateCourseProgress = async (
  userId: string,
  courseId: string,
  progress: number
): Promise<User> => {
  try {
    const userData = await getUserData();
    
    // Verificar si el usuario coincide
    if (userData.id !== userId) {
      throw new Error('Usuario no coincide');
    }
    
    // Actualizar el progreso del curso (aquí podrías actualizar más datos)
    // En un caso real, actualizarías el progreso específico del curso
    
    return userData;
  } catch (error) {
    console.error('Error al actualizar progreso del curso:', error);
    throw error;
  }
};