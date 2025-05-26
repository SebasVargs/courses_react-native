import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definir tipos/interfaces
interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  category: string;
  createdAt: string;
  deadline?: string;
}

// Colores del tema
const Colors = {
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  secondary: '#6B7280',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  background: '#FFFFFF',
  backgroundLight: '#F9FAFB',
  backgroundDark: '#F3F4F6',
  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  inactive: '#D1D5DB'
};

// Hook personalizado para manejar las metas con AsyncStorage
const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar metas del AsyncStorage al iniciar
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const savedGoals = await AsyncStorage.getItem('goals');
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);
        setGoals(parsedGoals);
      }
    } catch (error) {
      console.error('Error loading goals from AsyncStorage:', error);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const saveGoals = async (newGoals: Goal[]) => {
    try {
      await AsyncStorage.setItem('goals', JSON.stringify(newGoals));
    } catch (error) {
      console.error('Error saving goals to AsyncStorage:', error);
    }
  };

  const addGoal = async (newGoal: Omit<Goal, 'id' | 'createdAt'>) => {
    try {
      const goal: Goal = {
        ...newGoal,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updatedGoals = [...goals, goal];
      setGoals(updatedGoals);
      await saveGoals(updatedGoals);
      return { success: true };
    } catch (error) {
      console.error('Error adding goal:', error);
      return { success: false, error };
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      const updatedGoals = goals.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      );
      setGoals(updatedGoals);
      await saveGoals(updatedGoals);
      return { success: true };
    } catch (error) {
      console.error('Error updating goal:', error);
      return { success: false, error };
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedGoals);
      await saveGoals(updatedGoals);
      return { success: true };
    } catch (error) {
      console.error('Error deleting goal:', error);
      return { success: false, error };
    }
  };

  const getOverallProgress = () => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((acc, goal) => {
      const goalProgress = goal.target > 0 ? Math.min(goal.current / goal.target, 1) : 0;
      return acc + goalProgress;
    }, 0);
    return (totalProgress / goals.length) * 100;
  };

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    getOverallProgress
  };
};

// Componente del formulario para crear/editar metas
const GoalForm = ({ 
  visible, 
  goal, 
  onSave, 
  onCancel 
}: {
  visible: boolean;
  goal?: Goal | null;
  onSave: (goalData: Omit<Goal, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: goal?.title || '',
    description: goal?.description || '',
    target: goal?.target?.toString() || '0',
    current: goal?.current?.toString() || '0',
    unit: goal?.unit || '',
    category: goal?.category || 'personal',
    deadline: goal?.deadline || ''
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description,
        target: goal.target.toString(),
        current: goal.current.toString(),
        unit: goal.unit,
        category: goal.category,
        deadline: goal.deadline || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        target: '0',
        current: '0',
        unit: '',
        category: 'personal',
        deadline: ''
      });
    }
  }, [goal, visible]);

  const handleSubmit = async () => {
    if (!formData.title.trim() || parseFloat(formData.target) <= 0) {
      // En React Native, usar Alert en lugar de alert del navegador
      // Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      console.warn('Por favor completa todos los campos requeridos');
      return;
    }

    const goalData = {
      title: formData.title,
      description: formData.description,
      target: parseFloat(formData.target),
      current: parseFloat(formData.current),
      unit: formData.unit,
      category: formData.category,
      deadline: formData.deadline
    };

    await onSave(goalData);
  };

  const categories = [
    { value: 'personal', label: 'Personal' },
    { value: 'salud', label: 'Salud' },
    { value: 'trabajo', label: 'Trabajo' },
    { value: 'educacion', label: 'Educación' },
    { value: 'finanzas', label: 'Finanzas' },
    { value: 'hobbies', label: 'Hobbies' }
  ];

  if (!visible) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContainer}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {goal ? 'Editar Meta' : 'Nueva Meta'}
          </h2>
          <button onClick={onCancel} style={styles.closeButton}>
            ✕
          </button>
        </div>

        <div style={styles.modalContent}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ej: Correr 5km diarios"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe tu meta en detalle..."
              style={styles.textArea}
            />
          </div>

          <div style={styles.rowContainer}>
            <div style={{ ...styles.formGroup, ...styles.halfWidth }}>
              <label style={styles.label}>Meta *</label>
              <input
                type="number"
                value={formData.target}
                onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                placeholder="100"
                style={styles.input}
              />
            </div>
            <div style={{ ...styles.formGroup, ...styles.halfWidth }}>
              <label style={styles.label}>Progreso Actual</label>
              <input
                type="number"
                value={formData.current}
                onChange={(e) => setFormData(prev => ({ ...prev, current: e.target.value }))}
                placeholder="0"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Unidad</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              placeholder="Ej: km, libros, horas"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Categoría</label>
            <div style={styles.categoryContainer}>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                  style={{
                    ...styles.categoryButton,
                    ...(formData.category === cat.value ? styles.categoryButtonActive : {})
                  }}
                >
                  <span style={{
                    ...styles.categoryText,
                    ...(formData.category === cat.value ? styles.categoryTextActive : {})
                  }}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Fecha límite (opcional)</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.modalFooter}>
          <button onClick={onCancel} style={styles.buttonSecondary}>
            <span style={styles.buttonSecondaryText}>Cancelar</span>
          </button>
          <button onClick={handleSubmit} style={styles.buttonPrimary}>
            <span style={styles.buttonPrimaryText}>
              {goal ? 'Actualizar' : 'Crear Meta'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar una meta individual
const GoalCard = ({ 
  goal, 
  onEdit, 
  onDelete, 
  onUpdateProgress 
}: {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onUpdateProgress: (goalId: string, updates: Partial<Goal>) => void;
}) => {
  const progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
  const isCompleted = goal.current >= goal.target;
  
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      personal: '#8B5CF6',
      salud: '#10B981',
      trabajo: '#3B82F6',
      educacion: '#F59E0B',
      finanzas: '#EF4444',
      hobbies: '#EC4899'
    };
    return colors[category] || Colors.secondary;
  };

  const handleProgressUpdate = async (increment: number) => {
    const newProgress = Math.max(0, goal.current + increment);
    await onUpdateProgress(goal.id, { current: newProgress });
  };

  const handleDelete = async () => {
    // En React Native usar Alert.alert en lugar de window.confirm
    // Alert.alert(
    //   'Confirmar eliminación',
    //   '¿Estás seguro de que quieres eliminar esta meta?',
    //   [
    //     { text: 'Cancelar', style: 'cancel' },
    //     { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(goal.id) }
    //   ]
    // );
    
    // Por ahora, eliminar directamente (puedes descomentar el Alert.alert arriba)
    await onDelete(goal.id);
  };

  return (
    <div style={styles.goalCard}>
      <div style={styles.goalHeader}>
        <div style={styles.goalTitleContainer}>
          <div style={styles.goalTitleRow}>
            <h3 style={styles.goalTitle}>{goal.title}</h3>
            {isCompleted && (
              <span style={styles.completedIcon}>✓</span>
            )}
          </div>
          <div style={{
            ...styles.categoryBadge,
            backgroundColor: getCategoryColor(goal.category) + '20'
          }}>
            <span style={{
              ...styles.categoryBadgeText,
              color: getCategoryColor(goal.category)
            }}>
              {goal.category}
            </span>
          </div>
        </div>
        <div style={styles.goalActions}>
          <button onClick={() => onEdit(goal)} style={styles.actionButton}>
            ✏️
          </button>
          <button onClick={handleDelete} style={styles.actionButton}>
            🗑️
          </button>
        </div>
      </div>

      {goal.description && (
        <p style={styles.goalDescription}>{goal.description}</p>
      )}

      <div style={styles.progressContainer}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Progreso</span>
          <span style={styles.progressText}>
            {goal.current}{goal.unit && ` ${goal.unit}`} / {goal.target}{goal.unit && ` ${goal.unit}`}
          </span>
        </div>
        <div style={styles.progressBarContainer}>
          <div 
            style={{
              ...styles.progressBar,
              width: `${progress}%`,
              backgroundColor: isCompleted ? Colors.success : Colors.primary
            }}
          />
        </div>
        <div style={styles.progressPercentageContainer}>
          <span style={styles.progressPercentage}>{progress.toFixed(1)}%</span>
        </div>
      </div>

      <div style={styles.goalFooter}>
        <div style={styles.progressButtons}>
          <button 
            onClick={() => handleProgressUpdate(-1)} 
            style={styles.progressButtonMinus}
          >
            <span style={styles.progressButtonText}>-1</span>
          </button>
          <button 
            onClick={() => handleProgressUpdate(1)} 
            style={styles.progressButtonPlus}
          >
            <span style={styles.progressButtonText}>+1</span>
          </button>
        </div>
        {goal.deadline && (
          <span style={styles.deadlineText}>
            Límite: {new Date(goal.deadline).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

// Componente principal
export default function GoalsManager() {
  const { goals, loading, addGoal, updateGoal, deleteGoal, getOverallProgress } = useGoals();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const handleSaveGoal = async (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, goalData);
    } else {
      await addGoal(goalData);
    }
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDeleteGoal = async (goalId: string) => {
    await deleteGoal(goalId);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  // Mostrar loading mientras se cargan las metas
  if (loading) {
    return (
      <div style={{...styles.container, ...styles.loadingContainer}}>
        <div style={styles.loadingText}>Cargando metas...</div>
      </div>
    );
  }

  const overallProgress = getOverallProgress();
  const completedGoals = goals.filter(goal => goal.current >= goal.target).length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.headerTitle}>
            <span style={styles.flagIcon}>🏁</span>
            <h1 style={styles.title}>Mis Metas</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            style={styles.addButton}
          >
            <span style={styles.addIcon}>➕</span>
            <span style={styles.addButtonText}>Nueva Meta</span>
          </button>
        </div>

        {/* Estadísticas */}
        {goals.length > 0 && (
          <div style={styles.statsContainer}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>{goals.length}</div>
              <div style={styles.statLabel}>Total</div>
            </div>
            <div style={styles.statItem}>
              <div style={{...styles.statNumber, color: Colors.success}}>{completedGoals}</div>
              <div style={styles.statLabel}>Completadas</div>
            </div>
            <div style={styles.statItem}>
              <div style={{...styles.statNumber, color: Colors.warning}}>{overallProgress.toFixed(1)}%</div>
              <div style={styles.statLabel}>Progreso</div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de metas */}
      <div style={styles.listContent}>
        {goals.length === 0 ? (
          <div style={styles.emptyContainer}>
            <div style={styles.emptyIcon}>🏁</div>
            <h3 style={styles.emptyTitle}>No tienes metas establecidas</h3>
            <p style={styles.emptySubtitle}>
              Establece metas para mantener tu motivación
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={styles.emptyButton}
            >
              <span style={styles.emptyButtonIcon}>➕</span>
              <span style={styles.emptyButtonText}>Crear primera meta</span>
            </button>
          </div>
        ) : (
          <div>
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onUpdateProgress={updateGoal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Formulario modal */}
      <GoalForm
        visible={showForm}
        goal={editingGoal}
        onSave={handleSaveGoal}
        onCancel={handleCancelForm}
      />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: Colors.backgroundLight,
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: '16px',
    color: Colors.textSecondary,
  },
  header: {
    backgroundColor: Colors.background,
    padding: '24px 22px',
    borderBottom: `1px solid ${Colors.border}`,
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  flagIcon: {
    fontSize: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: Colors.text,
    margin: 0,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
  },
  addIcon: {
    fontSize: '16px',
  },
  addButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: '14px',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  statItem: {
    textAlign: 'center' as const,
  },
  statNumber: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: '12px',
    color: Colors.textSecondary,
    marginTop: '2px',
  },
  listContent: {
    padding: '16px',
  },
  goalCard: {
    backgroundColor: Colors.background,
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  goalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  goalTitleContainer: {
    flex: 1,
  },
  goalTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  goalTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    margin: 0,
  },
  completedIcon: {
    color: Colors.success,
    fontSize: '18px',
    fontWeight: 'bold',
  },
  categoryBadge: {
    display: 'inline-block',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '12px',
  },
  categoryBadgeText: {
    fontSize: '11px',
    fontWeight: '500',
    textTransform: 'capitalize' as const,
  },
  goalActions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '8px',
    borderRadius: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  goalDescription: {
    fontSize: '14px',
    color: Colors.textSecondary,
    marginBottom: '16px',
    lineHeight: 1.4,
    margin: '0 0 16px 0',
  },
  progressContainer: {
    marginBottom: '16px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  progressLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: Colors.text,
  },
  progressText: {
    fontSize: '12px',
    color: Colors.textSecondary,
  },
  progressBarContainer: {
    height: '6px',
    backgroundColor: Colors.borderLight,
    borderRadius: '3px',
    marginBottom: '4px',
  },
  progressBar: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  progressPercentageContainer: {
    textAlign: 'right' as const,
  },
  progressPercentage: {
    fontSize: '11px',
    color: Colors.textLight,
  },
  goalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressButtons: {
    display: 'flex',
    gap: '8px',
  },
  progressButtonMinus: {
    padding: '6px 12px',
    borderRadius: '8px',
    backgroundColor: Colors.error + '20',
    border: 'none',
    cursor: 'pointer',
  },
  progressButtonPlus: {
    padding: '6px 12px',
    borderRadius: '8px',
    backgroundColor: Colors.success + '20',
    border: 'none',
    cursor: 'pointer',
  },
  progressButtonText: {
    fontSize: '12px',
    fontWeight: '600',
    color: Colors.text,
  },
  deadlineText: {
    fontSize: '11px',
    color: Colors.textLight,
  },
  emptyContainer: {
    textAlign: 'center' as const,
    padding: '64px 32px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: Colors.text,
    margin: '0 0 8px 0',
  },
  emptySubtitle: {
    fontSize: '14px',
    color: Colors.textSecondary,
    marginBottom: '24px',
    margin: '0 0 24px 0',
  },
  emptyButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: Colors.primary,
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  emptyButtonIcon: {
    fontSize: '16px',
  },
  emptyButtonText: {
    color: Colors.background,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 500,
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderRadius: '12px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '72vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: `1px solid ${Colors.border}`,
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: Colors.text,
    margin: 0,
  },
  closeButton: {
    padding: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    color: Colors.textSecondary,
  },
  modalContent: {
    padding: '16px',
  },
  modalFooter: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    borderTop: `1px solid ${Colors.border}`,
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: Colors.text,
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    border: `1px solid ${Colors.border}`,
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    color: Colors.text,
    backgroundColor: Colors.background,
    boxSizing: 'border-box' as const,
  },
  textArea: {
    width: '100%',
    border: `1px solid ${Colors.border}`,
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    color: Colors.text,
    backgroundColor: Colors.background,
    height: '80px',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  },
  rowContainer: {
    display: 'flex',
    gap: '12px',
  },
  halfWidth: {
    flex: 1,
  },
  categoryContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  categoryButton: {
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: Colors.backgroundDark,
    border: 'none',
    cursor: 'pointer',
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: '12px',
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: Colors.background,
  },
  buttonPrimary: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: Colors.primary,
    border: 'none',
    cursor: 'pointer',
  },
  buttonSecondary: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: Colors.backgroundDark,
    border: `1px solid ${Colors.border}`,
    cursor: 'pointer',
  },
  buttonPrimaryText: {
    color: Colors.background,
    fontWeight: '600',
    fontSize: '14px',
  },
  buttonSecondaryText: {
    color: Colors.text,
    fontWeight: '500',
    fontSize: '14px',
  },
};