// app/courses/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated, ActivityIndicator, Module, Linking } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCourses } from '../../hooks/useCourses';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Lesson } from '@/models/lesson';
import { Course } from '@/models/course';
import { Video, ResizeMode } from 'expo-av';

// Componente Tab para navegar entre contenido y quiz
const LessonTabs = ({ activeTab, setActiveTab }: any) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'content' && styles.activeTab]}
        onPress={() => setActiveTab('content')}
      >
        <Text style={[styles.tabText, activeTab === 'content' && styles.activeTabText]}>Contenido</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'quiz' && styles.activeTab]}
        onPress={() => setActiveTab('quiz')}
      >
        <Text style={[styles.tabText, activeTab === 'quiz' && styles.activeTabText]}>Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

const LessonContent = ({ lesson }: any) => {
  const handleVideoPress = () => {
    if (lesson.video) {
      // Redirigir a YouTube si el video es una URL de YouTube
      Linking.openURL(lesson.video);
    }
  };

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.lessonContent}>{lesson.content}</Text>

      {lesson.image && (
        <Image
          source={{ uri: lesson.image }}
          style={styles.lessonImage}
          resizeMode="cover"
        />
      )}

      {lesson.video && (
        <TouchableOpacity onPress={handleVideoPress}>
          <View style={styles.videoContainer}>
            <AntDesign name="youtube" size={24} color="red" style={styles.icons} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Componente para mostrar y gestionar el quiz
const LessonQuiz = ({ lesson, onCompleteQuiz, isCompleted }: any) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Reset state when lesson changes
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [lesson.id]);

  const handleSubmit = () => {
    if (!selectedOption) return;

    const correct = selectedOption === lesson.quiz.correctOptionId;
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct && !isCompleted) {
      // Solo marcamos como completado si es correcto y no estaba completado previamente
      onCompleteQuiz(lesson.id);
    }
  };

  return (
    <View style={styles.quizContainer}>
      <Text style={styles.quizQuestion}>{lesson.quiz.question}</Text>

      {lesson.quiz.options.map((option: any) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.quizOption,
            selectedOption === option.id && styles.selectedOption,
            isSubmitted && option.id === lesson.quiz.correctOptionId && styles.correctOption,
            isSubmitted && selectedOption === option.id && option.id !== lesson.quiz.correctOptionId && styles.incorrectOption
          ]}
          onPress={() => !isSubmitted && setSelectedOption(option.id)}
          disabled={isSubmitted}
        >
          <Text style={[
            styles.optionText,
            selectedOption === option.id && styles.selectedOptionText,
            isSubmitted && option.id === lesson.quiz.correctOptionId && styles.correctOptionText,
            isSubmitted && selectedOption === option.id && option.id !== lesson.quiz.correctOptionId && styles.incorrectOptionText
          ]}>
            {option.text}
          </Text>

          {isSubmitted && option.id === lesson.quiz.correctOptionId && (
            <AntDesign name="checkcircle" size={18} color="#22c55e" style={styles.icon} />
          )}

          {isSubmitted && selectedOption === option.id && option.id !== lesson.quiz.correctOptionId && (
            <AntDesign name="closecircle" size={18} color="#ef4444" style={styles.icon} />
          )}
        </TouchableOpacity>
      ))}

      {!isSubmitted ? (
        <TouchableOpacity
          style={[styles.submitButton, !selectedOption && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!selectedOption}
        >
          <Text style={styles.submitButtonText}>Verificar Respuesta</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.feedbackContainer}>
          {isCorrect ? (
            <>
              <Text style={styles.correctFeedback}>¡Correcto! 🎉</Text>
              {!isCompleted && (
                <Text style={styles.completedMessage}>Has completado esta lección</Text>
              )}
            </>
          ) : (
            <Text style={styles.incorrectFeedback}>Incorrecto. Intenta nuevamente 🤔</Text>
          )}

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSelectedOption(null);
              setIsSubmitted(false);
            }}
          >
            <Text style={styles.resetButtonText}>Intentar de nuevo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const ModuleItem = ({ module, onCompleteQuiz, expandedLesson, setExpandedLesson }: any) => {
  const [isModuleExpanded, setIsModuleExpanded] = useState(false);

  // Calcular el progreso del módulo
  const totalLessons = module.lessons.length;
  const completedLessons = module.lessons.filter((lesson: Lesson) => lesson.quiz.completed).length;

  return (
    <View style={styles.moduleContainer}>
      <TouchableOpacity
        style={styles.moduleHeader}
        onPress={() => setIsModuleExpanded(!isModuleExpanded)}
      >
        <View style={styles.moduleTitleContainer}>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.moduleProgress}>{completedLessons}/{totalLessons}</Text>
        </View>
        <AntDesign name={isModuleExpanded ? "minus" : "plus"} size={20} color="#4f46e5" />
      </TouchableOpacity>

      {isModuleExpanded && (
        <View style={styles.moduleContent}>
          {module.lessons.map((lesson: Lesson) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              onCompleteQuiz={onCompleteQuiz}
              expandedLesson={expandedLesson}
              setExpandedLesson={setExpandedLesson}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// Componente LessonItem corregido - Elimina el console.log problemático
const LessonItem = ({ lesson, onCompleteQuiz, expandedLesson, setExpandedLesson }: any) => {
  const [activeTab, setActiveTab] = useState('content');
  const isExpanded = expandedLesson === lesson.id;

  // Eliminamos el console.log que estaba causando problemas

  return (
    <View style={styles.lessonContainer}>
      <TouchableOpacity
        style={[styles.lessonHeader, isExpanded && styles.lessonHeaderActive]}
        onPress={() => setExpandedLesson(isExpanded ? null : lesson.id)}
      >
        <View style={styles.lessonTitleContainer}>
          <View style={[styles.lessonStatus, lesson.quiz.completed && styles.lessonCompleted]}>
            {lesson.quiz.completed ? (
              <AntDesign name="check" size={12} color="#fff" />
            ) : null}
          </View>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
        </View>
        <AntDesign name={isExpanded ? "up" : "down"} size={16} color="#666" />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.lessonExpandedContent}>
          <LessonTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'content' ? (
            <LessonContent lesson={lesson} />
          ) : (
            <LessonQuiz
              lesson={lesson}
              onCompleteQuiz={onCompleteQuiz}
              isCompleted={lesson.quiz.completed}
            />
          )}
        </View>
      )}
    </View>
  );
};

// Actualización del CourseDetailScreen con botón de depuración
export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const { courses, updateCourse, debugForceReload } = useCourses();
  const [course, setCourse] = useState<Course | null>(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Añadimos logs para verificar la carga correcta
    console.log("Buscando curso con ID:", id);
    console.log("Cursos disponibles:", courses.length);

    const foundCourse = courses.find((c) => c.id === id);
    if (foundCourse) {
      console.log("Curso encontrado:", foundCourse.title);
      console.log("Módulos:", foundCourse.modules.length);

      // Verifica y muestra información de módulos y lecciones
      foundCourse.modules.forEach((module, idx) => {
        console.log(`Módulo ${idx + 1}: ${module.id} - ${module.title}`);
        console.log(`  Lecciones: ${module.lessons ? module.lessons.length : 0}`);
      });

      setCourse(foundCourse);
    } else {
      console.log("Curso no encontrado");
    }
    setIsLoading(false);
  }, [id, courses]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Cargando curso...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Curso no encontrado</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calcular el progreso total del curso
  const totalQuizzes = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedQuizzes = course.modules.reduce((acc, module) => {
    const completedInModule = module.lessons.filter(lesson => lesson.quiz.completed).length;
    return acc + completedInModule;
  }, 0);

  // Función para marcar un quiz como completado
  const handleCompleteQuiz = (lessonId: any) => {
    // Copia profunda del curso
    const updatedCourse = JSON.parse(JSON.stringify(course));

    // Recorrer los módulos y lecciones para encontrar el quiz
    updatedCourse.modules.forEach((module: any) => {
      module.lessons.forEach((lesson: Lesson) => {
        if (lesson.id === lessonId) {
          lesson.quiz.completed = true;
        }
      });
    });

    // Actualizar el número total de preguntas completadas
    updatedCourse.completedQuestions = completedQuizzes + 1;

    // Actualizar el estado local y los datos globales
    setCourse(updatedCourse);
    updateCourse(updatedCourse);
  };

  return (

    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: `${course.title}`,
          headerStyle: { backgroundColor: '#000000' },
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            color: '#4f46e5',
          },
        }}
      />
      <Text style={styles.description}>{course.description}</Text>


      <View style={styles.modulesContainer}>
        {course.modules.map((module: any) => (
          <ModuleItem
            key={module.id}
            module={module}
            onCompleteQuiz={handleCompleteQuiz}
            expandedLesson={expandedLesson}
            setExpandedLesson={setExpandedLesson}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fc',
  },
  lessonImage: {
    height: 350,
    marginBottom: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    padding: 20,
    backgroundColor: '#f4f6fc',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    lineHeight: 22,
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  modulesContainer: {
    marginBottom: 20,
  },
  moduleContainer: {
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  moduleHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleTitleContainer: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  moduleProgress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  moduleContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  lessonContainer: {
    backgroundColor: '#f9fafb',
    marginBottom: 8,
    borderRadius: 6,
    overflow: 'hidden',
  },
  lessonHeader: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#transparent',
  },
  lessonHeaderActive: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  lessonTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonStatus: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonCompleted: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b5563',
    flex: 1,
  },
  lessonExpandedContent: {
    padding: 12,
  },
  videoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginTop: 16,
  },
  icon: {
    marginRight: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  activeTab: {
    backgroundColor: '#4f46e5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  activeTabText: {
    color: '#fff',
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  lessonContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4b5563',
  },
  quizContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quizQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  quizOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: '#4f46e5',
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
  },
  correctOption: {
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
  },
  incorrectOption: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  optionText: {
    fontSize: 15,
    color: '#4b5563',
    flex: 1,
  },
  selectedOptionText: {
    color: '#4f46e5',
    fontWeight: '500',
  },
  correctOptionText: {
    color: '#22c55e',
    fontWeight: '500',
  },
  incorrectOptionText: {
    color: '#ef4444',
    fontWeight: '500',
  },
  icons: {
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#a5b4fc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  feedbackContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  correctFeedback: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22c55e',
    marginBottom: 4,
  },
  incorrectFeedback: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 4,
  },
  completedMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4f46e5',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '500',
  },
});