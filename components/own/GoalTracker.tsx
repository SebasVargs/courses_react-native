// components/GoalTracker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressBar from './ProgressBar';
import { Colors } from '../../constants/Colors';
import { Goal } from '@/models/goal';

interface GoalTrackerProps {
  goal: Goal;
}

const GoalTracker = ({ goal }: GoalTrackerProps) => {
  const progress = goal.target > 0 ? goal.current / goal.target : 0;
  
  const formatDeadline = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  const getGoalTypeLabel = (type: Goal['type']) => {
    switch (type) {
      case 'courses': return 'Cursos';
      case 'lessons': return 'Lecciones';
      case 'daily': return 'Diaria';
      default: return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{goal.title}</Text>
        <Text style={styles.type}>{getGoalTypeLabel(goal.type)}</Text>
      </View>
      
      <ProgressBar 
        progress={progress} 
        height={8}
        color={progress >= 1 ? Colors.success : Colors.primary}
      />
      
      <View style={styles.details}>
        <Text style={styles.progress}>
          {goal.current} de {goal.target} {goal.type === 'courses' ? 'cursos' : 'lecciones'}
        </Text>
        {goal.deadline && (
          <Text style={styles.deadline}>
            Fecha límite: {formatDeadline(goal.deadline)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  type: {
    fontSize: 12,
    color: Colors.textSecondary,
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progress: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  deadline: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});

export default GoalTracker;