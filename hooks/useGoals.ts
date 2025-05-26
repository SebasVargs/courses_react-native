import { Goal } from '@/models/goal';
import { useState, useEffect } from 'react';
import { useStore } from './useStore';
import { useUser } from './useUser';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Obtener el usuario actual para acceder a sus metas
  const { user } = useUser();
  
  // Conectar con el estado global
  const { userState } = useStore();

  useEffect(() => {
    loadGoals();
  }, [user, userState]);

  const loadGoals = () => {
    try {
      setLoading(true);
      setError(null);
      
      // Si tenemos un usuario, obtener sus metas
      if (user && user.goals) {
        setGoals(user.goals);
      } else if (userState && userState.goals) {
        // Alternativamente, obtener las metas del estado global
        setGoals(userState.goals);
      } else {
        // No hay metas disponibles
        setGoals([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las metas');
      console.error('Error en useGoals:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar una nueva meta
  const addGoal = async (newGoal: Omit<Goal, 'id'>) => {
    const { addGoal } = useUser();
    const result = await addGoal(newGoal);
    
    if (result.success) {
      // Recargar las metas después de agregar una nueva
      loadGoals();
    }
    
    return result;
  };

  // Función para actualizar el progreso de una meta
  const updateGoalProgress = async (goalId: string, progress: number) => {
    const { updateGoal } = useUser();
    const result = await updateGoal(goalId, progress);
    
    if (result.success) {
      // Recargar las metas después de actualizar
      loadGoals();
    }
    
    return result;
  };

  // Función para eliminar una meta
  const deleteGoal = async (goalId: string) => {
    try {
      setLoading(true);
      
      // Filtrar las metas para eliminar la meta específica
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      
      // Actualizar el usuario con las metas actualizadas
      const { updateUser } = useUser();
      const result = await updateUser({ goals: updatedGoals });
      
      if (result.success) {
        setGoals(updatedGoals);
      }
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la meta');
      console.error('Error al eliminar meta:', err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el progreso general de todas las metas
  const getOverallProgress = () => {
    if (goals.length === 0) return 0;
    
    // Calcular el progreso de cada meta y promediar
    const totalProgress = goals.reduce((acc, goal) => {
      const goalProgress = goal.target > 0 ? goal.current / goal.target : 0;
      return acc + goalProgress;
    }, 0);
    
    return totalProgress / goals.length;
  };

  // Función para obtener metas completadas
  const getCompletedGoals = () => {
    return goals.filter(goal => goal.current >= goal.target);
  };

  // Función para obtener metas en progreso
  const getInProgressGoals = () => {
    return goals.filter(goal => goal.current < goal.target);
  };

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    getOverallProgress,
    getCompletedGoals,
    getInProgressGoals
  };
};