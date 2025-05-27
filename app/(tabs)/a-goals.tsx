import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet } from 'react-native';

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
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
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

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {goal ? 'Editar Meta' : 'Nueva Meta'}
            </Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Título *</Text>
              <TextInput
                value={formData.title}
                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                placeholder="Ej: Correr 5km diarios"
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Describe tu meta en detalle..."
                style={styles.textArea}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.label}>Meta *</Text>
                <TextInput
                  value={formData.target}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, target: text }))}
                  placeholder="100"
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.label}>Progreso Actual</Text>
                <TextInput
                  value={formData.current}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, current: text }))}
                  placeholder="0"
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Unidad</Text>
              <TextInput
                value={formData.unit}
                onChangeText={(text) => setFormData(prev => ({ ...prev, unit: text }))}
                placeholder="Ej: km, libros, horas"
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Categoría</Text>
              <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    onPress={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                    style={[
                      styles.categoryButton,
                      formData.category === cat.value && styles.categoryButtonActive
                    ]}
                  >
                    <Text style={[
                      styles.categoryText,
                      formData.category === cat.value && styles.categoryTextActive
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Fecha límite (opcional)</Text>
              <TextInput
                value={formData.deadline}
                onChangeText={(text) => setFormData(prev => ({ ...prev, deadline: text }))}
                placeholder="YYYY-MM-DD"
                style={styles.input}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={onCancel} style={styles.buttonSecondary}>
              <Text style={styles.buttonSecondaryText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.buttonPrimary}>
              <Text style={styles.buttonPrimaryText}>
                {goal ? 'Actualizar' : 'Crear Meta'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta meta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(goal.id) }
      ]
    );
  };

  return (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <View style={styles.goalTitleContainer}>
          <View style={styles.goalTitleRow}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            {isCompleted && (
              <Text style={styles.completedIcon}>✓</Text>
            )}
          </View>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(goal.category) + '20' }
          ]}>
            <Text style={[
              styles.categoryBadgeText,
              { color: getCategoryColor(goal.category) }
            ]}>
              {goal.category}
            </Text>
          </View>
        </View>
        <View style={styles.goalActions}>
          <TouchableOpacity onPress={() => onEdit(goal)} style={styles.actionButton}>
            <Text>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
            <Text>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {goal.description ? (
        <Text style={styles.goalDescription}>{goal.description}</Text>
      ) : null}

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progreso</Text>
          <Text style={styles.progressText}>
            {goal.current}{goal.unit ? ` ${goal.unit}` : ''} / {goal.target}{goal.unit ? ` ${goal.unit}` : ''}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar,
              { 
                width: `${progress}%`,
                backgroundColor: isCompleted ? Colors.success : Colors.primary
              }
            ]}
          />
        </View>
        <View style={styles.progressPercentageContainer}>
          <Text style={styles.progressPercentage}>{progress.toFixed(1)}%</Text>
        </View>
      </View>

      <View style={styles.goalFooter}>
        <View style={styles.progressButtons}>
          <TouchableOpacity 
            onPress={() => handleProgressUpdate(-1)} 
            style={styles.progressButtonMinus}
          >
            <Text style={styles.progressButtonText}>-1</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleProgressUpdate(1)} 
            style={styles.progressButtonPlus}
          >
            <Text style={styles.progressButtonText}>+1</Text>
          </TouchableOpacity>
        </View>
        {goal.deadline ? (
          <Text style={styles.deadlineText}>
            Límite: {new Date(goal.deadline).toLocaleDateString()}
          </Text>
        ) : null}
      </View>
    </View>
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
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando metas...</Text>
      </View>
    );
  }

  const overallProgress = getOverallProgress();
  const completedGoals = goals.filter(goal => goal.current >= goal.target).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitle}>
            <Text style={styles.flagIcon}>🏁</Text>
            <Text style={styles.title}>Mis Metas</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowForm(true)}
            style={styles.addButton}
          >
            <Text style={styles.addIcon}>➕</Text>
            <Text style={styles.addButtonText}>Nueva Meta</Text>
          </TouchableOpacity>
        </View>

        {/* Estadísticas */}
        {goals.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{goals.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {color: Colors.success}]}>{completedGoals}</Text>
              <Text style={styles.statLabel}>Completadas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {color: Colors.warning}]}>{overallProgress.toFixed(1)}%</Text>
              <Text style={styles.statLabel}>Progreso</Text>
            </View>
          </View>
        )}
      </View>

      {/* Lista de metas */}
      <ScrollView style={styles.listContent}>
        {goals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏁</Text>
            <Text style={styles.emptyTitle}>No tienes metas establecidas</Text>
            <Text style={styles.emptySubtitle}>
              Establece metas para mantener tu motivación
            </Text>
            <TouchableOpacity
              onPress={() => setShowForm(true)}
              style={styles.emptyButton}
            >
              <Text style={styles.emptyButtonIcon}>➕</Text>
              <Text style={styles.emptyButtonText}>Crear primera meta</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onUpdateProgress={updateGoal}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Formulario modal */}
      <GoalForm
        visible={showForm}
        goal={editingGoal}
        onSave={handleSaveGoal}
        onCancel={handleCancelForm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    backgroundColor: Colors.backgroundLight,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    backgroundColor: Colors.background,
    padding: 24,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  addButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    padding: 16,
  },
  goalCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalTitleContainer: {
    flex: 1,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  completedIcon: {
    color: Colors.success,
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  goalActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  goalDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercentageContainer: {
    alignItems: 'flex-end',
  },
  progressPercentage: {
    fontSize: 11,
    color: Colors.textLight,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressButtons: {
    flexDirection: 'row',
  },
  progressButtonMinus: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.error + '20',
    marginRight: 8,
  },
  progressButtonPlus: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.success + '20',
  },
  progressButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  deadlineText: {
    fontSize: 11,
    color: Colors.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  emptyButtonText: {
    color: Colors.background,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    maxWidth: 500,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
  modalContent: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.background,
    height: 80,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  halfWidth: {
    flex: 1,
    marginRight: 6,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.backgroundDark,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: Colors.background,
  },
  buttonPrimary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    marginLeft: 6,
  },
  buttonSecondary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.backgroundDark,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginRight: 6,
  },
  buttonPrimaryText: {
    color: Colors.background,
    fontWeight: '600',
    fontSize: 14,
  },
  buttonSecondaryText: {
    color: Colors.text,
    fontWeight: '500',
    fontSize: 14,
  },
});