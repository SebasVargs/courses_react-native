import { useStore } from './useStore';
import { useState, useEffect } from 'react';
import { getUserData, updateUserData, logoutUser } from '../services/userService';
import { router } from 'expo-router';
import { User } from '@/models/user';
import { Goal } from '@/models/goal';


export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Conectar con el estado global si es necesario
  const { setUserState, clearUserState } = useStore();

  useEffect(() => {
    // Cargar datos del usuario al iniciar
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener datos del usuario desde el servicio
      const userData = await getUserData();
      
      if (userData) {
        setUser(userData);
        setUserState(userData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos del usuario');
      console.error('Error en useUser:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updatedData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Actualizar datos del usuario
      const updatedUser = await updateUserData({
        ...user,
        ...updatedData
      } as User);
      
      setUser(updatedUser);
      setUserState(updatedUser);
      
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el usuario');
      console.error('Error al actualizar usuario:', err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      clearUserState();
      router.replace('/screens/Login');
      return { success: true };
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      return { success: false, error: err };
    }
  };

  // Métodos adicionales específicos para el usuario
  const enrollInCourse = async (courseId: string) => {
    if (!user) return { success: false, error: 'Usuario no autenticado' };
    
    try {
      // Verificar si el usuario ya está inscrito
      if (user.enrolledCourses.includes(courseId)) {
        return { success: true, message: 'Ya estás inscrito en este curso' };
      }
      
      // Agregar el curso a los cursos inscritos
      const updatedEnrollments = [...user.enrolledCourses, courseId];
      
      return await updateUser({
        enrolledCourses: updatedEnrollments
      });
    } catch (err) {
      console.error('Error al inscribirse en el curso:', err);
      return { success: false, error: err };
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    if (!user) return { success: false, error: 'Usuario no autenticado' };
    
    try {
      // Crear un nuevo objetivo con ID único
      const newGoal = {
        ...goal,
        id: `goal-${Date.now()}`
      };
      
      // Agregar el objetivo a los objetivos del usuario
      const updatedGoals = [...user.goals, newGoal];
      
      return await updateUser({
        goals: updatedGoals
      });
    } catch (err) {
      console.error('Error al agregar objetivo:', err);
      return { success: false, error: err };
    }
  };

  const updateGoal = async (goalId: string, progress: number) => {
    if (!user) return { success: false, error: 'Usuario no autenticado' };
    
    try {
      // Actualizar el progreso del objetivo
      const updatedGoals = user.goals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            current: progress
          };
        }
        return goal;
      });
      
      return await updateUser({
        goals: updatedGoals
      });
    } catch (err) {
      console.error('Error al actualizar progreso del objetivo:', err);
      return { success: false, error: err };
    }
  };

  return {
    user,
    loading,
    error,
    loadUserData,
    updateUser,
    logout,
    enrollInCourse,
    addGoal,
    updateGoal
  };
};