import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function CourseCard({ course }: { course: any }) {
  const router = useRouter();

  // Calcular el porcentaje de progreso
  const progressPercentage = Math.round((course.completedQuestions / course.totalQuestions) * 100);

  return (
    <TouchableOpacity 
      onPress={() => router.push(`/courses/${course.id}`)} 
      style={styles.card}
      activeOpacity={0.9}
    >
      <Image source={{ uri: course.image }} style={styles.image} />
      
      <View style={styles.tagContainer}>
        <Text style={styles.tag}>{course.category || 'Curso'}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{course.description}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {progressPercentage}% completado ({course.completedQuestions}/{course.totalQuestions})
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{course.duration || '4h'}</Text>
            <Text style={styles.infoLabel}>Duración</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  tagContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  tag: {
    backgroundColor: 'rgba(79, 70, 229, 0.9)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  statsContainer: {
    marginTop: 8,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4f46e5',
    marginRight: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  }
});