// components/ui/ProgressBar.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/Colors';

interface ProgressBarProps {
  progress: number; // Valor entre 0 y 1
  height?: number;
  showPercentage?: boolean;
  color?: string;
}

const ProgressBar = ({ 
  progress, 
  height = 10, 
  showPercentage = false,
  color = Colors.primary 
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max(progress, 0), 1) * 100;
  
  return (
    <View style={styles.container}>
      <View style={[styles.progressBackground, { height }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${percentage}%`,
              height,
              backgroundColor: color
            }
          ]} 
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 5,
  },
  progressBackground: {
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 5,
  },
  percentageText: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
    textAlign: 'right',
  },
});

export default ProgressBar;