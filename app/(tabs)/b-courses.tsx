import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { useCourses } from '../../hooks/useCourses';
import CourseCard from '../../components/own/CourseCard';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '@/models/course';

export default function CoursesScreen() {
  const { courses, loading, error, debugForceReload } = useCourses();
  const [activeFilter, setActiveFilter] = useState('all');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Cargando tus cursos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ff4d4f" />
        <Text style={styles.errorText}>No pudimos cargar los cursos</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Intentar nuevamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filters = [
    { id: 'all', name: 'Todos' },
    { id: 'in-progress', name: 'En progreso' },
    { id: 'completed', name: 'Completados' },
  ];

  // Filtrar cursos según la categoría seleccionada
  const filteredCourses = activeFilter === 'all'
    ? courses
    : activeFilter === 'completed'
      ? courses.filter((course: Course) => course.completedQuestions === course.totalQuestions)
      : courses.filter((course: Course) => course.completedQuestions < course.totalQuestions);

  const handleForceReload = async () => {
    const success = await debugForceReload();
    if (success) {
      alert("AsyncStorage limpiado y datos recargados desde JSON. Puede que necesites refrescar la app.");
    } else {
      alert("Error al forzar recarga.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Cursos</Text>
        <Text style={styles.headerSubtitle}>Continúa aprendiendo donde lo dejaste</Text>
      </View>

      {filteredCourses.length === 0 ? (
        <View style={styles.emptyCourses}>
          <Ionicons name="book-outline" size={48} color="#999" />
          <Text style={styles.emptyCoursesText}>No hay cursos en esta categoría</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CourseCard course={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeFilterButton: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  filterText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6fc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6fc',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyCourses: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyCoursesText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});