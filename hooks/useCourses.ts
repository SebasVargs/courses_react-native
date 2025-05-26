// hooks/useCourses.ts (Corregido)
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course } from '@/models/course';

// Clave para almacenar los cursos en AsyncStorage
const COURSES_STORAGE_KEY = 'fitness_courses_data';

// Importamos el JSON directamente
const coursesData = {
  "courses": [
    {
      "id": "course-fitness-1",
      "title": "Cuidado Personal",
      "description": "Aprende sobre hábitos saludables, rutinas de ejercicio, nutrición, descanso, salud mental y bienestar integral.",
      "image": "https://previews.123rf.com/images/winwinfolly/winwinfolly2205/winwinfolly220500068/186164470-conjunto-de-elementos-de-dise%C3%B1o-sobre-el-tema-del-cuidado-personal-chica-con-art%C3%ADculos-acogedores-es.jpg",
      "totalQuestions": 22,
      "completedQuestions": 0,
      "duration": "8 semanas",
      "category": "Salud y Bienestar",
      "modules": [
        {
          "id": "module-intro-fitness",
          "title": "Fundamentos del Ejercicio Físico",
          "lessons": [
            {
              "id": "lesson-intro-1",
              "title": "¿Por qué hacer ejercicio?",
              "content": "Conoce los beneficios físicos, mentales y sociales del ejercicio regular.",
              "completed": false,
              "video": "https://youtu.be/GImwhD8l4Ho?si=g572agtZMP0GN1_f",
              "quiz": {
                "id": "quiz-intro-1",
                "question": "¿Cuál de los siguientes NO es un beneficio del ejercicio?",
                "options": [
                  { "id": "option-1", "text": "Reduce el estrés" },
                  { "id": "option-2", "text": "Mejora la circulación" },
                  { "id": "option-3", "text": "Aumenta el colesterol malo" },
                  { "id": "option-4", "text": "Fortalece los músculos" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            },
            {
              "id": "lesson-intro-2",
              "title": "Tipos de ejercicio",
              "content": "Aprende la diferencia entre ejercicios aeróbicos, anaeróbicos, de flexibilidad y fuerza.",
              "completed": false,
              "video": "https://www.youtube.https://youtu.be/BEJLLywCggw?si=LhZ8UDvv7jhkBstK/watch?v=MLqGGefk2Fs",
              "quiz": {
                "id": "quiz-intro-2",
                "question": "¿Qué tipo de ejercicio es una caminata rápida?",
                "options": [
                  { "id": "option-1", "text": "Anaeróbico" },
                  { "id": "option-2", "text": "Flexibilidad" },
                  { "id": "option-3", "text": "Aeróbico" },
                  { "id": "option-4", "text": "Isométrico" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            },
            {
              "id": "lesson-fundamentals-3",
              "title": "Sistemas energéticos del cuerpo",
              "content": "El cuerpo utiliza tres sistemas energéticos: fosfágeno (ATP-PC), glucólisis anaeróbica y aeróbico. Cada uno se activa según la duración e intensidad del ejercicio.",
              "completed": false,
              "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/CoriCycle-es.svg/1200px-CoriCycle-es.svg.png",
              "quiz": {
                "id": "quiz-fundamentals-3",
                "question": "¿Cuál sistema energético se activa en ejercicios breves e intensos?",
                "options": [
                  { "id": "option-1", "text": "Sistema aeróbico" },
                  { "id": "option-2", "text": "Sistema glucolítico" },
                  { "id": "option-3", "text": "Sistema fosfágeno (ATP-PC)" },
                  { "id": "option-4", "text": "Sistema mitocondrial" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            },
            {
              "id": "lesson-fundamentals-4",
              "title": "Adaptaciones fisiológicas al ejercicio",
              "content": "Con el ejercicio regular, el cuerpo se adapta aumentando la eficiencia cardiovascular, la capacidad pulmonar, y la fuerza muscular.",
              "completed": false,
              "video": "https://youtu.be/SLDbPAXglY8?si=zoZ4XVXwKoFGeHoE",
              "quiz": {
                "id": "quiz-fundamentals-4",
                "question": "¿Qué cambio fisiológico ocurre con el ejercicio constante?",
                "options": [
                  { "id": "option-1", "text": "Reducción del volumen cardíaco" },
                  { "id": "option-2", "text": "Disminución de la capacidad pulmonar" },
                  { "id": "option-3", "text": "Incremento de la fuerza muscular" },
                  { "id": "option-4", "text": "Pérdida de masa ósea" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            },
            {
              "id": "lesson-fundamentals-5",
              "title": "Principios del entrenamiento físico",
              "content": "Los principios clave incluyen: especificidad, progresión, sobrecarga, reversibilidad e individualización. Aplicarlos asegura un progreso constante.",
              "completed": false,
              "video": "https://youtu.be/bRmmm8GtwEo?si=vDeFPSK1M88T06Ke",
              "quiz": {
                "id": "quiz-fundamentals-5",
                "question": "¿Cuál principio implica aumentar gradualmente la carga?",
                "options": [
                  { "id": "option-1", "text": "Especificidad" },
                  { "id": "option-2", "text": "Sobrecarga progresiva" },
                  { "id": "option-3", "text": "Reversibilidad" },
                  { "id": "option-4", "text": "Individualización" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-fundamentals-6",
              "title": "Componentes de la condición física",
              "content": "La condición física se divide en: fuerza, resistencia, flexibilidad, velocidad y coordinación. Entrenarlas mejora el rendimiento general.",
              "completed": false,
              "video": "https://youtu.be/Chaf0r4oIKk?si=EoZIvXSGz7xDj94y",
              "quiz": {
                "id": "quiz-fundamentals-6",
                "question": "¿Cuál NO es un componente de la condición física?",
                "options": [
                  { "id": "option-1", "text": "Fuerza" },
                  { "id": "option-2", "text": "Velocidad" },
                  { "id": "option-3", "text": "Memoria" },
                  { "id": "option-4", "text": "Resistencia" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            },
            {
              "id": "lesson-fundamentals-7",
              "title": "Importancia del calentamiento y enfriamiento",
              "content": "El calentamiento prepara al cuerpo para el esfuerzo, y el enfriamiento ayuda a evitar lesiones y mejora la recuperación.",
              "completed": false,
              "image": "https://runningvillarejo.es/wp-content/uploads/2023/11/tipos-de-calentamiento-en-educacion-fisica-1024x529.jpg",
              "quiz": {
                "id": "quiz-fundamentals-7",
                "question": "¿Por qué es importante el enfriamiento?",
                "options": [
                  { "id": "option-1", "text": "Para incrementar la fatiga" },
                  { "id": "option-2", "text": "Para ayudar en la recuperación" },
                  { "id": "option-3", "text": "Para ganar masa muscular" },
                  { "id": "option-4", "text": "No es necesario" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-fundamentals-8",
              "title": "Evaluación de la condición física",
              "content": "Medir la condición física permite conocer el punto de partida, ajustar entrenamientos y controlar el progreso.",
              "completed": false,
              "video": "https://youtu.be/3OCAUk6XYCI?si=EpEfbcppNrMKnlki",
              "quiz": {
                "id": "quiz-fundamentals-8",
                "question": "¿Cuál es el propósito de una evaluación física?",
                "options": [
                  { "id": "option-1", "text": "Cansar al deportista" },
                  { "id": "option-2", "text": "Evitar entrenar" },
                  { "id": "option-3", "text": "Controlar el progreso" },
                  { "id": "option-4", "text": "Reemplazar el entrenamiento" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            }

          ]
        },
        {
          "id": "module-nutrition",
          "title": "Nutrición para el Bienestar",
          "lessons": [
            {
              "id": "lesson-nutrition-1",
              "title": "Macronutrientes esenciales",
              "content": "Carbohidratos, proteínas y grasas: ¿qué son y para qué sirven?",
              "completed": false,
              "video": "https://youtu.be/ETIwmxTAxB4?si=FkTGOa_vY1EdO7wU",
              "quiz": {
                "id": "quiz-nutrition-1",
                "question": "¿Cuál es la principal función de las proteínas?",
                "options": [
                  { "id": "option-1", "text": "Aportar energía inmediata" },
                  { "id": "option-2", "text": "Reparar y construir tejidos" },
                  { "id": "option-3", "text": "Lubricar articulaciones" },
                  { "id": "option-4", "text": "Transportar oxígeno" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-nutrition-2",
              "title": "Hidratación y ejercicio",
              "content": "Importancia de mantenerse hidratado antes, durante y después del ejercicio.",
              "completed": false,
              "video": "https://youtu.be/1CTnNTJ23hA?si=4KJ_2pPn5cAKjQpD",
              "quiz": {
                "id": "quiz-nutrition-2",
                "question": "¿Cuánta agua se recomienda tomar al día para un adulto promedio?",
                "options": [
                  { "id": "option-1", "text": "1 litro" },
                  { "id": "option-2", "text": "2 litros" },
                  { "id": "option-3", "text": "4 litros" },
                  { "id": "option-4", "text": "5 litros" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            }
          ]
        },
        {
          "id": "module-routines",
          "title": "Rutinas de Ejercicio",
          "lessons": [
            {
              "id": "lesson-routines-1",
              "title": "Rutina para principiantes",
              "content": "Una guía para comenzar a entrenar de forma segura y efectiva.",
              "completed": false,
              "video": "https://youtu.be/xNHu5_acGIk?si=g881W1M3mFZhanIy",
              "quiz": {
                "id": "quiz-routines-1",
                "question": "¿Cuántos días a la semana se recomienda entrenar como principiante?",
                "options": [
                  { "id": "option-1", "text": "1 día" },
                  { "id": "option-2", "text": "3-4 días" },
                  { "id": "option-3", "text": "6 días" },
                  { "id": "option-4", "text": "Todos los días" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-routines-2",
              "title": "Entrenamiento de fuerza en casa",
              "content": "Ejercicios para fortalecer el cuerpo sin necesidad de ir al gimnasio.",
              "completed": false,
              "video": "https://youtu.be/jbM-gE1SVMM?si=XiPHpiC14ZtivOt6",
              "quiz": {
                "id": "quiz-routines-2",
                "question": "¿Cuál de estos ejercicios es ideal para fortalecer piernas?",
                "options": [
                  { "id": "option-1", "text": "Flexiones" },
                  { "id": "option-2", "text": "Sentadillas" },
                  { "id": "option-3", "text": "Plancha" },
                  { "id": "option-4", "text": "Abdominales" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-routines-3",
              "title": "Entrenamiento funcional para el hogar",
              "content": "El entrenamiento funcional mejora la fuerza, coordinación y movilidad usando movimientos naturales y peso corporal. Ideal para quienes entrenan en casa sin equipo.",
              "completed": false,
              "video": "https://youtu.be/wvyVTvIxtM0?si=CCwczuEZgSGeMgPB",
              "quiz": {
                "id": "quiz-exercise-6",
                "question": "¿Qué característica tiene el entrenamiento funcional?",
                "options": [
                  { "id": "option-1", "text": "Requiere máquinas de gimnasio" },
                  { "id": "option-2", "text": "Usa movimientos naturales y peso corporal" },
                  { "id": "option-3", "text": "Solo es para atletas profesionales" },
                  { "id": "option-4", "text": "Es poco efectivo sin pesas" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-routines-4",
              "title": "HIIT: Alta intensidad para quemar grasa",
              "content": "El entrenamiento HIIT combina ráfagas cortas de actividad intensa con períodos breves de descanso. Es eficaz para mejorar la resistencia cardiovascular y quemar grasa.",
              "completed": false,
              "video": "https://youtu.be/XCB8pgnt9no?si=Lzop_AM72zNfXBhz",
              "quiz": {
                "id": "quiz-exercise-7",
                "question": "¿Qué significa HIIT?",
                "options": [
                  { "id": "option-1", "text": "High Impact Internal Training" },
                  { "id": "option-2", "text": "High Intensity Interval Training" },
                  { "id": "option-3", "text": "Heavy Internal Isometric Technique" },
                  { "id": "option-4", "text": "Hyper Intense Integrated Training" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            }

          ]
        },
        {
          "id": "module-rest",
          "title": "Descanso y Recuperación",
          "lessons": [
            {
              "id": "lesson-rest-1",
              "title": "Importancia del sueño",
              "content": "El rol del sueño en la recuperación muscular, hormonal y mental es esencial. Un descanso adecuado mejora el rendimiento físico y cognitivo.",
              "completed": false,
              "video": "https://youtu.be/2gCRcMRTi5w?si=LK-MmCo9GK2wTH00",
              "quiz": {
                "id": "quiz-rest-1",
                "question": "¿Cuántas horas de sueño se recomiendan para un adulto?",
                "options": [
                  { "id": "option-1", "text": "4-5 horas" },
                  { "id": "option-2", "text": "6-7 horas" },
                  { "id": "option-3", "text": "7-9 horas" },
                  { "id": "option-4", "text": "10-12 horas" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            },
            {
              "id": "lesson-rest-2",
              "title": "Técnicas de respiración",
              "content": "La respiración profunda ayuda a reducir el ritmo cardíaco, relajar los músculos y mejorar la calidad del sueño.",
              "completed": false,
              "image": "https://www.sportlife.es/uploads/s1/11/49/94/18/respiracion-cuadrada.jpeg",
              "quiz": {
                "id": "quiz-rest-2",
                "question": "¿Cuál es una técnica efectiva de respiración para relajarse?",
                "options": [
                  { "id": "option-1", "text": "Respiración acelerada" },
                  { "id": "option-2", "text": "Hiperventilación" },
                  { "id": "option-3", "text": "Respiración diafragmática" },
                  { "id": "option-4", "text": "Aguantar la respiración" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            },
            {
              "id": "lesson-rest-3",
              "title": "Estiramientos antes de dormir",
              "content": "Hacer estiramientos suaves antes de dormir puede aliviar la tensión acumulada y mejorar el sueño profundo.",
              "completed": false,
              "image": "https://media.istockphoto.com/id/862564078/es/vector/un-conjunto-de-figuras-femeninas-de-yoga-posturas-de-yoga-de-8-infograf%C3%ADa-posa-para-ejercicio.jpg?s=612x612&w=0&k=20&c=6sraADehXQtNsIkkiaoeo1MDpgBa9IACGD_VLEQelVI=",
              "quiz": {
                "id": "quiz-rest-3",
                "question": "¿Cuál es un beneficio de los estiramientos nocturnos?",
                "options": [
                  { "id": "option-1", "text": "Aumentan la adrenalina" },
                  { "id": "option-2", "text": "Interrumpen el sueño" },
                  { "id": "option-3", "text": "Relajan el cuerpo y reducen el estrés" },
                  { "id": "option-4", "text": "Dificultan la respiración" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            },
            {
              "id": "lesson-rest-4",
              "title": "Rutina post-ejercicio para recuperación",
              "content": "Después de entrenar, realizar una rutina suave ayuda a reducir agujetas y favorecer la regeneración muscular.",
              "completed": false,
              "video": "https://youtu.be/JbY_CK5DC7k?si=hWlPV0migMb7TG8F",
              "quiz": {
                "id": "quiz-rest-4",
                "question": "¿Qué acción es ideal después de entrenar?",
                "options": [
                  { "id": "option-1", "text": "Dormir inmediatamente" },
                  { "id": "option-2", "text": "Ducha fría, estiramiento y descanso" },
                  { "id": "option-3", "text": "Seguir haciendo cardio" },
                  { "id": "option-4", "text": "Evitar hidratarse" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-rest-5",
              "title": "Mindfulness para relajar cuerpo y mente",
              "content": "El mindfulness ayuda a reducir el estrés acumulado, relajando el cuerpo y mejorando el estado mental antes de dormir.",
              "completed": false,
              "video": "https://youtu.be/Gq7jTUYtOz4?si=8qzRrlnRtlhimJtZ",
              "quiz": {
                "id": "quiz-rest-5",
                "question": "¿Qué se busca lograr con el mindfulness?",
                "options": [
                  { "id": "option-1", "text": "Mayor estrés" },
                  { "id": "option-2", "text": "Aceleración mental" },
                  { "id": "option-3", "text": "Concentración y relajación" },
                  { "id": "option-4", "text": "Fatiga muscular" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            }
          ]
        },
        {
          "id": "module-mind",
          "title": "Salud Mental y Bienestar",
          "lessons": [
            {
              "id": "lesson-mind-1",
              "title": "Manejo del estrés",
              "content": "Técnicas de respiración, meditación y mindfulness para relajarte.",
              "completed": false,
              "video": "https://youtu.be/wifsNMDztJg?si=aDZqvvB-kr_yegc6",
              "quiz": {
                "id": "quiz-mind-1",
                "question": "¿Qué práctica ayuda a reducir el estrés y aumentar la atención plena?",
                "options": [
                  { "id": "option-1", "text": "Multitarea" },
                  { "id": "option-2", "text": "Dormir poco" },
                  { "id": "option-3", "text": "Mindfulness" },
                  { "id": "option-4", "text": "Café en exceso" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            },
            {
              "id": "lesson-mind-2",
              "title": "Importancia del descanso en el bienestar general",
              "content": "Dormir bien es crucial para la recuperación física, la salud mental y el rendimiento diario. Se recomienda dormir entre 7 y 9 horas por noche.",
              "completed": false,
              "image": "https://scontent.fctg2-1.fna.fbcdn.net/v/t39.30808-6/490397705_1232862108847623_6752399146429252181_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=-3jSXj0UseIQ7kNvwGmXoRW&_nc_oc=AdkxdkfFF0mQQTAPnSzd3hRI2_kFKsfxy1LkuzSyQDgWrJYyeKxxup7SL9hEU6Z4k4BUrGh5sK8ikE9-CwSiLk7U&_nc_zt=23&_nc_ht=scontent.fctg2-1.fna&_nc_gid=ZaT92e4uvliEgjfoB8F3OQ&oh=00_AfLVbH9PXEfwN6fSWIMkJmhm67-EB4T98TYUxVmIfDnz9g&oe=68381D7A",
              "quiz": {
                "id": "quiz-health-wellness-4",
                "question": "¿Cuántas horas de sueño son recomendadas para un adulto promedio?",
                "options": [
                  { "id": "option-1", "text": "4-5 horas" },
                  { "id": "option-2", "text": "6-7 horas" },
                  { "id": "option-3", "text": "7-9 horas" },
                  { "id": "option-4", "text": "10-12 horas" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            },
            {
              "id": "lesson-mind-3",
              "title": "Manejo del estrés y la ansiedad",
              "content": "El estrés crónico puede afectar negativamente la salud. Técnicas como la respiración profunda, la meditación y la actividad física ayudan a reducirlo.",
              "completed": false,
              "video": "https://youtu.be/6gkZLHtMN_M?si=_MjFm-rrytET76na",
              "quiz": {
                "id": "quiz-health-wellness-5",
                "question": "¿Cuál de estas técnicas ayuda a reducir el estrés?",
                "options": [
                  { "id": "option-1", "text": "Comer en exceso" },
                  { "id": "option-2", "text": "Evitar el ejercicio" },
                  { "id": "option-3", "text": "Meditación" },
                  { "id": "option-4", "text": "Uso de redes sociales por horas" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            }

          ]
        }
      ]
    },
    {
      "id": "course-nutrition-1",
      title: "Descubre Colombia",
      description: "Explora la historia, geografía, cultura, biodiversidad y curiosidades de Colombia a través de lecciones interactivas.",
      image: "https://media.istockphoto.com/id/1358597932/es/vector/ilustraci%C3%B3n-de-garabatos-de-dibujos-animados-dibujados-a-mano-en-colombia-divertido-dise%C3%B1o.jpg?s=612x612&w=0&k=20&c=SmO10VwDYI2YykNfp5XJMhDVZFl_nNXPo7mNQnDvlko=",
      totalQuestions: 20,
      completedQuestions: 0,
      duration: "11 semanas",
      category: "Cultura General",
      modules: [
        {
          id: "module-history",
          title: "Historia de Colombia",
          lessons: [
            {
              id: "lesson-history-1",
              title: "Independencia de Colombia",
              content: "Conoce los eventos clave que llevaron a la independencia de Colombia el 20 de julio de 1810.",
              completed: false,
              video: "https://youtu.be/8DaNSJifI60?si=VrBdDez5aS45ufGM",
              quiz: {
                id: "quiz-history-1",
                question: "¿En qué fecha se celebra la independencia de Colombia?",
                options: [
                  { id: "option-1", text: "7 de agosto" },
                  { id: "option-2", text: "20 de julio" },
                  { id: "option-3", text: "12 de octubre" },
                  { id: "option-4", text: "15 de septiembre" }
                ],
                correctOptionId: "option-2",
                completed: false
              }
            },
            {
              id: "lesson-history-2",
              title: "Personajes históricos",
              content: "Aprende sobre figuras clave como Simón Bolívar y Policarpa Salavarrieta en la historia de Colombia.",
              completed: false,
              video: "https://youtu.be/80sWJWPfhms?si=U9r7JXMEU33SWH-p",
              quiz: {
                id: "quiz-history-2",
                question: "¿Quién es conocido como el Libertador de Colombia?",
                options: [
                  { id: "option-1", text: "Antonio Nariño" },
                  { id: "option-2", text: "Francisco de Paula Santander" },
                  { id: "option-3", text: "Simón Bolívar" },
                  { id: "option-4", text: "Camilo Torres" }
                ],
                correctOptionId: "option-3",
                completed: false
              }
            },
            {
              id: "lesson-history-3",
              title: "Constitución de 1991",
              content: "Descubre los cambios fundamentales introducidos por la Constitución Política de Colombia de 1991.",
              completed: false,
              video: "https://youtu.be/_sTI18pd5Vs?si=jWh64_tB-s43yg05",
              quiz: {
                id: "quiz-history-3",
                question: "¿En qué año se promulgó la actual Constitución Política de Colombia?",
                options: [
                  { id: "option-1", text: "1886" },
                  { id: "option-2", text: "1991" },
                  { id: "option-3", text: "1810" },
                  { id: "option-4", text: "2000" }
                ],
                correctOptionId: "option-2",
                completed: false
              }
            },
            {
              id: "lesson-history-4",
              title: "Personajes históricos",
              content: "Aprende sobre figuras clave como Simón Bolívar y Policarpa Salavarrieta en la historia de Colombia.",
              completed: false,
              video: "https://youtu.be/G8J4M4o3OAs?si=FNWqBHrDVW7yDomi",
              quiz: {
                id: "quiz-history-4",
                question: "¿Dónde nació Policarpa Salavarrieta?",
                options: [
                  { id: "option-1", text: "Bogotá" },
                  { id: "option-2", text: "Cartagena" },
                  { id: "option-3", text: "Guaduas" },
                  { id: "option-4", text: "Tunja" }
                ],
                correctOptionId: "option-3",
                completed: false
              }
            },
            {
              id: "lesson-history-5",
              title: "Personajes históricos",
              content: "Simón Bolívar fue una figura clave en la independencia de varios países.",
              completed: false,
              video: "https://youtu.be/n5VLimuOVaY?si=v33B19vamISeI-YR",
              quiz: {
                id: "quiz-history-5",
                question: "¿Qué país NO fue liberado por Simón Bolívar?",
                options: [
                  { id: "option-1", text: "Venezuela" },
                  { id: "option-2", text: "Chile" },
                  { id: "option-3", text: "Colombia" },
                  { id: "option-4", text: "Perú" }
                ],
                correctOptionId: "option-2",
                completed: false
              }
            },
          ]
        },
        {
          id: "module-geography",
          title: "Geografía de Colombia",
          lessons: [
            {
              id: "lesson-geography-1",
              title: "Regiones naturales",
              content: "Descubre las cinco regiones naturales de Colombia: Andina, Caribe, Pacífica, Orinoquía y Amazonía.",
              completed: false,
              video: "https://youtu.be/tWrXqFWrIb0?si=HPVlzn13-Rq7hNJW",
              quiz: {
                id: "quiz-geography-1",
                question: "¿Cuál de las siguientes NO es una región natural de Colombia?",
                options: [
                  { id: "option-1", text: "Región Andina" },
                  { id: "option-2", text: "Región Caribe" },
                  { id: "option-3", text: "Región Patagónica" },
                  { id: "option-4", text: "Región Pacífica" }
                ],
                correctOptionId: "option-3",
                completed: false
              }
            },
            {
              id: "lesson-geography-2",
              title: "Ríos y montañas",
              content: "Conoce los principales ríos y cordilleras que atraviesan el territorio colombiano.",
              completed: false,
              video: "https://youtu.be/c_wTgdEI_64?si=6dLs9DTg3tytpzdg",
              quiz: {
                id: "quiz-geography-2",
                question: "¿Cuál es el río más largo de Colombia?",
                options: [
                  { id: "option-1", text: "Río Magdalena" },
                  { id: "option-2", text: "Río Cauca" },
                  { id: "option-3", text: "Río Amazonas" },
                  { id: "option-4", text: "Río Putumayo" }
                ],
                correctOptionId: "option-1",
                completed: false
              }
            },
            {
              id: "lesson-geography-3",
              title: "Fronteras colombianas",
              content: "Aprende con qué países limita Colombia y la importancia de sus fronteras.",
              completed: false,
              video: "https://youtu.be/c8Y9_kH2zYg?si=Bb3rHcRgSo7JebxK",
              quiz: {
                id: "quiz-geography-3",
                question: "¿Con cuántos países limita Colombia?",
                options: [
                  { id: "option-1", text: "5" },
                  { id: "option-2", text: "6" },
                  { id: "option-3", text: "7" },
                  { id: "option-4", text: "8" }
                ],
                correctOptionId: "option-3",
                completed: false
              }
            }
          ]
        },
        {
          id: "module-culture",
          title: "Cultura y Tradiciones",
          lessons: [
            {
              id: "lesson-culture-1",
              title: "Festividades colombianas",
              content: "Explora las principales festividades como el Carnaval de Barranquilla y la Feria de las Flores.",
              completed: false,
              video: "https://youtu.be/MeefNpFQ9iI?si=PBQr-jlZokhX4vZp",
              quiz: {
                id: "quiz-culture-1",
                question: "¿Cuál es una de las festividades más reconocidas de Colombia?",
                options: [
                  { id: "option-1", text: "Carnaval de Río" },
                  { id: "option-2", text: "Carnaval de Barranquilla" },
                  { id: "option-3", text: "Feria de Sevilla" },
                  { id: "option-4", text: "Oktoberfest" }
                ],
                correctOptionId: "option-2",
                completed: false
              }
            },
            {
              id: "lesson-culture-2",
              title: "Gastronomía típica",
              content: "Conoce platos tradicionales como la bandeja paisa, el ajiaco y las arepas.",
              completed: false,
              video: "https://youtu.be/4eEbxUo7kAc?si=UuhovmGmjso4Ziy1",
              quiz: {
                id: "quiz-culture-2",
                question: "¿Qué plato es típico de la región andina colombiana?",
                options: [
                  { id: "option-1", text: "Ceviche" },
                  { id: "option-2", text: "Ajiaco" },
                  { id: "option-3", text: "Tacos" },
                  { id: "option-4", text: "Feijoada" }
                ],
                correctOptionId: "option-2",
                completed: false
              }
            },
            {
              id: "lesson-culture-3",
              title: "Música colombiana",
              content: "Explora los géneros musicales más representativos como el vallenato, la cumbia y la salsa.",
              completed: false,
              video: "https://youtu.be/K1jWcm4MjP0?si=SmIYCh0qE93IhnwV",
              quiz: {
                id: "quiz-culture-3",
                question: "¿Qué género musical es originario de la región Caribe de Colombia?",
                options: [
                  { id: "option-1", text: "Bambuco" },
                  { id: "option-2", text: "Vallenato" },
                  { id: "option-3", text: "Tango" },
                  { id: "option-4", text: "Samba" }
                ],
                correctOptionId: "option-2",
                completed: false
              }
            },
            {
              id: "lesson-culture-4",
              title: "Lenguas indígenas",
              content: "Conoce algunas de las lenguas indígenas que aún se hablan en Colombia.",
              completed: false,
              video: "https://youtu.be/WuzwAzNzTpM?si=Dzm7E7CqtAJ7neSM",
              quiz: {
                id: "quiz-culture-4",
                question: "¿Cuál de las siguientes es una lengua indígena hablada en Colombia?",
                options: [
                  { id: "option-1", text: "Náhuatl" },
                  { id: "option-2", text: "Guaraní" },
                  { id: "option-3", text: "Wayuunaiki" },
                  { id: "option-4", text: "Quechua" }
                ],
                correctOptionId: "option-3",
                completed: false
              }
            },
            {
              id: "lesson-culture-5",
              title: "Gastronomía típica",
              content: "Colombia tiene una rica tradición gastronómica que varía por región.",
              completed: false,
              video: "https://youtu.be/QMAvpRm-8po?si=IO9wWmbRou4Na-TM",
              quiz: {
                id: "quiz-culture-5",
                question: "¿Cuál de estos platos es típico colombiano?",
                options: [
                  { id: "option-1", text: "Arepas" },
                  { id: "option-2", text: "Ceviche" },
                  { id: "option-3", text: "Tamales" },
                  { id: "option-4", text: "Paella" }
                ],
                correctOptionId: "option-1",
                completed: false
              }
            },
            {
              id: "lesson-culture-6",
              title: "Música y danzas",
              content: "Cumbia, vallenato y salsa hacen parte del patrimonio musical colombiano.",
              completed: false,
              video: "https://youtu.be/TrcQaX5PQ2Q?si=2f_lz7Sw2Qx94eb_",
              quiz: {
                id: "quiz-culture-6",
                question: "¿Cuál de los siguientes géneros musicales es originario de Colombia?",
                options: [
                  { id: "option-1", text: "Tango" },
                  { id: "option-2", text: "Merengue" },
                  { id: "option-3", text: "Samba" },
                  { id: "option-4", text: "Cumbia" }
                ],
                correctOptionId: "option-4",
                completed: false
              }
            }

          ]
        },
        {
          id: "module-nature",
          title: "Fauna y Flora",
          lessons: [
            {
              id: "lesson-nature-1",
              title: "Biodiversidad colombiana",
              content: "Descubre la riqueza en especies animales y vegetales que hacen de Colombia uno de los países más biodiversos.",
              completed: false,
              video: "https://www.youtube.com/watch?v=g55HrxQNeec",
              quiz: {
                id: "quiz-nature-1",
                question: "¿Qué posición ocupa Colombia en biodiversidad a nivel mundial?",
                options: [
                  { id: "option-1", text: "Primero" },
                  { id: "option-2", text: "Segundo" },
                  { id: "option-3", text: "Tercero" },
                  { id: "option-4", text: "Cuarto" }
                ],
                correctOptionId: "option-2",
                completed: false
              }
            },
            {
              id: "lesson-nature-2",
              title: "Parques naturales",
              content: "Conoce algunos de los parques nacionales naturales más emblemáticos de Colombia.",
              completed: false,
              video: "https://www.youtube.com/watch?v=DBTtxpEGM4o",
              quiz: {
                id: "quiz-nature-2",
                question: "¿Cuál de estos es un parque nacional natural de Colombia?",
                options: [
                  { id: "option-1", text: "Parque Nacional Yellowstone" },
                  { id: "option-2", text: "Parque Nacional Natural Tayrona" },
                  { id: "option-3", text: "Parque Nacional Kruger" },
                  { id: "option-4", text: "Parque Nacional Banff" }
                ],
                correctOptionId: "option-2",
                completed: false
              }
            },
            {
              id: "lesson-nature-3",
              title: "Especies emblemáticas",
              content: "Aprende sobre animales representativos como el cóndor andino, la rana dardo dorada y el jaguar.",
              completed: false,
              video: "https://youtu.be/WvshMyhb71E?si=iMNVqzVCxdeLo9Sz",
              quiz: {
                id: "quiz-nature-3",
                question: "¿Qué animal es símbolo nacional de Colombia?",
                options: [
                  { id: "option-1", text: "Jaguar" },
                  { id: "option-2", text: "Cóndor" },
                  { id: "option-3", text: "Rana dorada" },
                  { id: "option-4", text: "Puma" }
                ],
                correctOptionId: "option-2",
                completed: false
              }
            }
          ]
        },
        {
          id: "module-sports",
          title: "Deportes y Logros",
          lessons: [
            {
              id: "lesson-sports-1",
              title: "Deportes populares",
              content: "Aprende sobre los deportes más practicados en Colombia como el fútbol, ciclismo y patinaje.",
              completed: false,
              video: "https://youtu.be/V2vYwUqN9Z0?si=cN0G6-A97PSP9hxC",
              quiz: {
                id: "quiz-sports-1",
                question: "¿Cuál es el deporte más popular en Colombia?",
                options: [
                  { id: "option-1", text: "Béisbol" },
                  { id: "option-2", text: "Baloncesto" },
                  { id: "option-3", text: "Fútbol" },
                  { id: "option-4", text: "Tenis" }
                ],
                correctOptionId: "option-3",
                completed: false
              }
            },
            {
              id: "lesson-sports-2",
              title: "Logros deportivos",
              content: "Conoce los principales logros de atletas colombianos en competencias internacionales.",
              completed: false,
              video: "https://www.youtube.com/watch?v=qpBOYSVquRk",
              quiz: {
                id: "quiz-sports-2",
                question: "¿Qué ciclista colombiano ganó el Giro de Italia en 2014?",
                options: [
                  { id: "option-1", text: "Rigoberto Urán" },
                  { id: "option-2", text: "Nairo Quintana" },
                  { id: "option-3", text: "Egan Bernal" },
                  { id: "option-4", text: "Esteban Chaves" }
                ],
                correctOptionId: "option-2",
                completed: false
              }
            },
            {
              id: "lesson-sports-3",
              title: "Atletas destacados",
              content: "Conoce a deportistas como Mariana Pajón, Caterine Ibargüen y James Rodríguez.",
              completed: false,
              video: "https://youtu.be/vGsWyHrhdew?si=4jcD9XqIKOpaQodw",
              quiz: {
                id: "quiz-sports-3",
                question: "¿Qué deportista colombiana ha ganado dos medallas de oro en BMX?",
                options: [
                  { id: "option-1", text: "Caterine Ibargüen" },
                  { id: "option-2", text: "Mariana Pajón" },
                  { id: "option-3", text: "Ingrid Valencia" },
                  { id: "option-4", text: "Yoreli Rincón" }
                ],
                correctOptionId: "option-2",
                completed: false
              }
            }
          ]
        }
      ]
    },
    {
      "id": "course-mental-1",
      "title": "Inglés para Todos los Niveles",
      "description": "Mejora tu inglés desde lo más básico hasta un nivel avanzado con lecciones dinámicas y ejercicios interactivos.",
      "image": "https://media.istockphoto.com/id/1678139897/es/vector/ingl%C3%A9s.jpg?s=612x612&w=0&k=20&c=Yw4MZ0KUw5ngcAenvlAX__LM_cR6o4IGL5wiYc0w2QQ=",
      "totalQuestions": 35,
      "completedQuestions": 0,
      "duration": "12 semanas",
      "category": "Idiomas",
      "modules": [
        {
          "id": "module-Basic",
          "title": "Nivel Básico (A1/A2)",
          "lessons": [
            {
              "id": "lesson-basic-1",
              "title": "Introducción al Inglés",
              "content": "Aprende los fundamentos del idioma inglés, incluyendo vocabulario básico y frases comunes.",
              "completed": false,
              video: "https://youtu.be/W4F_PRjkxbQ?si=F5lxZRqWEMSA1uKa",
              quiz: {
                id: "quiz-basic-1",
                question: "¿Cuál de estas frases significa 'Hola, ¿cómo estás?'?",
                options: [
                  { id: "option-1", text: "Goodbye" },
                  { id: "option-2", text: "How are you?" },
                  { id: "option-3", text: "See you later" },
                  { id: "option-4", text: "Thanks" }
                ],
                correctOptionId: "option-2",
                completed: false
              }
            },
            {
              id: "lesson-basic-2",
              title: "Los números y el alfabeto",
              content: "Conoce los números del 1 al 100 y el abecedario en inglés.",
              completed: false,
              video: "https://youtu.be/buRzyrkivEU?si=bzC9ZT_XQsRjVbt5",
              quiz: {
                id: "quiz-basic-2",
                question: "¿Cuál es el número 'trece' en inglés?",
                options: [
                  { id: "option-1", text: "Thirty" },
                  { id: "option-2", text: "Thirteen" },
                  { id: "option-3", text: "Three" },
                  { id: "option-4", text: "Thirty-three" }
                ],
                correctOptionId: "option-2",
                completed: false
              }
            },
            {
              id: "lesson-basic-3",
              title: "Colores y objetos comunes",
              content: "Aprende los nombres de colores y objetos del entorno diario.",
              completed: false,
              video: "https://youtu.be/2n7CXoRMsG4?si=fJKaBrIqDxlSytlr",
              quiz: {
                id: "quiz-basic-3",
                question: "¿Qué color es 'blue'?",
                options: [
                  { id: "option-1", text: "Rojo" },
                  { id: "option-2", text: "Verde" },
                  { id: "option-3", text: "Azul" },
                  { id: "option-4", text: "Amarillo" }
                ],
                correctOptionId: "option-3",
                completed: false
              }
            },
            {
              id: "lesson-basic-4",
              title: "Verbo To Be",
              content: "Domina el verbo 'to be' en presente afirmativo, negativo e interrogativo.",
              completed: false,
              video: "https://youtu.be/phP_PKBzrsg?si=RpFHaN2PIAsY6JCZ",
              quiz: {
                id: "quiz-basic-4",
                question: "¿Cuál es la forma correcta de 'Ella es doctora'?",
                options: [
                  { id: "option-1", text: "She be a doctor" },
                  { id: "option-2", text: "She is doctor" },
                  { id: "option-3", text: "She is a doctor" },
                  { id: "option-4", text: "She are a doctor" }
                ],
                correctOptionId: "option-3",
                completed: false
              }
            }
          ]
        },
        {
          "id": "module-daily",
          "title": "Inglés para la Vida Diaria",
          "lessons": [
            {
              "id": "lesson-daily-1",
              "title": "En el supermercado",
              "content": "Aprende frases comunes para hacer compras, preguntar precios y buscar productos.",
              "completed": false,
              "video": "https://youtu.be/x4IIEnZUtBo?si=TDrQN3hx0_3Mwzbz",
              "quiz": {
                "id": "quiz-daily-1",
                "question": "¿Cómo se dice '¿Cuánto cuesta esto?' en inglés?",
                "options": [
                  { "id": "option-1", "text": "How much is this?" },
                  { "id": "option-2", "text": "What cost is this?" },
                  { "id": "option-3", "text": "How many this cost?" },
                  { "id": "option-4", "text": "Is how much this?" }
                ],
                "correctOptionId": "option-1",
                "completed": false
              }
            },
            {
              "id": "lesson-daily-2",
              "title": "En el restaurante",
              "content": "Frases útiles para pedir comida, hacer reservaciones y expresar preferencias.",
              "completed": false,
              "video": "https://youtu.be/H01KY7gQUn8?si=TyL1KYkhwruV90E4",
              "quiz": {
                "id": "quiz-daily-2",
                "question": "¿Qué significa 'I’d like a table for two'?",
                "options": [
                  { "id": "option-1", "text": "Quiero una silla más" },
                  { "id": "option-2", "text": "Quiero una mesa para dos" },
                  { "id": "option-3", "text": "Reservar comida" },
                  { "id": "option-4", "text": "Dos comidas para llevar" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-daily-3",
              "title": "En el transporte público",
              "content": "Frases para comprar boletos, preguntar rutas y horarios.",
              "completed": false,
              "video": "https://youtu.be/ApiOWERj9WU?si=OkgjVL1NyOiL6WZd",
              "quiz": {
                "id": "quiz-daily-3",
                "question": "¿Cómo preguntas '¿Dónde está la estación de autobuses?' en inglés?",
                "options": [
                  { "id": "option-1", "text": "Where is the bus station?" },
                  { "id": "option-2", "text": "Where the bus station is?" },
                  { "id": "option-3", "text": "Where bus station?" },
                  { "id": "option-4", "text": "Bus station where is?" }
                ],
                "correctOptionId": "option-1",
                "completed": false
              }
            },
            {
              "id": "lesson-daily-4",
              "title": "En la farmacia",
              "content": "Frases para pedir medicamentos y describir síntomas.",
              "completed": false,
              "video": "https://youtu.be/iXIL-A5DVn4?si=mY3THPcjUpXpRePv",
              "quiz": {
                "id": "quiz-daily-4",
                "question": "¿Qué significa 'I need something for a headache'?",
                "options": [
                  { "id": "option-1", "text": "Necesito algo para un dolor de cabeza" },
                  { "id": "option-2", "text": "Quiero algo para la garganta" },
                  { "id": "option-3", "text": "Busco algo para la tos" },
                  { "id": "option-4", "text": "Necesito medicina para la gripe" }
                ],
                "correctOptionId": "option-1",
                "completed": false
              }
            },
            {
              "id": "lesson-daily-5",
              "title": "En el hotel",
              "content": "Frases para registrarse, pedir servicios y hacer preguntas sobre la estancia.",
              "completed": false,
              "video": "https://youtu.be/BqPLSRxuT8o?si=IFg_Sz0q2BPv7tNn",
              "quiz": {
                "id": "quiz-daily-5",
                "question": "¿Qué significa 'I have a reservation under the name Smith'?",
                "options": [
                  { "id": "option-1", "text": "Tengo una reservación a nombre de Smith" },
                  { "id": "option-2", "text": "Quiero reservar una habitación" },
                  { "id": "option-3", "text": "Busco el nombre Smith" },
                  { "id": "option-4", "text": "La habitación está reservada" }
                ],
                "correctOptionId": "option-1",
                "completed": false
              }
            }
          ]
        },
        {
          "id": "module-business",
          "title": "Inglés para Negocios",
          "lessons": [
            {
              "id": "lesson-biz-1",
              "title": "Vocabulario Corporativo",
              "content": "Aprende términos comunes en reuniones, correos electrónicos y negociaciones empresariales.",
              "completed": false,
              "image": "https://promova.com/content/vocabulario_para_negocios_f33e46c3a8.png",
              "quiz": {
                "id": "quiz-biz-1",
                "question": "¿Qué significa 'stakeholder' en el ámbito empresarial?",
                "options": [
                  { "id": "option-1", "text": "Empleado" },
                  { "id": "option-2", "text": "Persona con interés en la empresa" },
                  { "id": "option-3", "text": "Accionista" },
                  { "id": "option-4", "text": "Cliente" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-biz-2",
              "title": "Emails Profesionales",
              "content": "Domina la estructura de un correo formal en inglés: saludo, cuerpo, cierre y firma.",
              "completed": false,
              "image": "https://www.inesem.es/revistadigital/idiomas/files/2015/12/ejemplo-de-carta-informal-en-ingl%C3%A9s.jpg",
              "quiz": {
                "id": "quiz-biz-2",
                "question": "¿Cuál es una forma adecuada de comenzar un correo formal?",
                "options": [
                  { "id": "option-1", "text": "Hey there" },
                  { "id": "option-2", "text": "Hi dude" },
                  { "id": "option-3", "text": "Dear Mr. Smith" },
                  { "id": "option-4", "text": "Yo!" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            },
            {
              "id": "lesson-biz-3",
              "title": "Presentaciones Efectivas",
              "content": "Aprende a estructurar y presentar propuestas o proyectos ante una audiencia empresarial.",
              "completed": false,
              "video": "https://youtu.be/7nP-V55Om9I?si=sUm01cIojJ9tydi-",
              "quiz": {
                "id": "quiz-biz-3",
                "question": "¿Cuál es una frase útil para introducir un gráfico?",
                "options": [
                  { "id": "option-1", "text": "Let's draw" },
                  { "id": "option-2", "text": "Take a look at this picture" },
                  { "id": "option-3", "text": "As you can see in this chart" },
                  { "id": "option-4", "text": "This is some art" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            },
            {
              "id": "lesson-biz-4",
              "title": "Negociaciones en Inglés",
              "content": "Descubre frases útiles para hacer propuestas, aceptar condiciones o rechazar cortésmente.",
              "completed": false,
              "video": "https://youtu.be/nuxXfahk_jo?si=lfBJYChayrlmOwSP",
              "quiz": {
                "id": "quiz-biz-4",
                "question": "¿Qué frase es adecuada para rechazar una oferta cortésmente?",
                "options": [
                  { "id": "option-1", "text": "No way" },
                  { "id": "option-2", "text": "I’m afraid that’s not possible at the moment" },
                  { "id": "option-3", "text": "You must be kidding" },
                  { "id": "option-4", "text": "Forget it" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-biz-5",
              "title": "Reuniones Virtuales",
              "content": "Frases clave y etiqueta para participar profesionalmente en reuniones en línea.",
              "completed": false,
              "video": "https://youtu.be/6pPI2rZW2uU?si=efKngEPLjJsZiZT0",
              "quiz": {
                "id": "quiz-biz-5",
                "question": "¿Qué expresión usarías para pedir la palabra durante una reunión virtual?",
                "options": [
                  { "id": "option-1", "text": "I want to speak" },
                  { "id": "option-2", "text": "Give me the mic" },
                  { "id": "option-3", "text": "May I add something here?" },
                  { "id": "option-4", "text": "I'm speaking now" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            }
          ]
        },
        {
          "id": "module-travel",
          "title": "Inglés para Viajes",
          "lessons": [
            {
              "id": "lesson-travel-1",
              "title": "En el Aeropuerto",
              "content": "Frases comunes para check-in, seguridad, y abordar el avión.",
              "completed": false,
              "video": "https://youtu.be/NcPuoOFvGAI?si=jV5WLpSy0GL9wwF-",
              "quiz": {
                "id": "quiz-travel-1",
                "question": "¿Cómo pedirías tu tarjeta de embarque en inglés?",
                "options": [
                  { "id": "option-1", "text": "Can I have my boarding pass, please?" },
                  { "id": "option-2", "text": "Where is my luggage?" },
                  { "id": "option-3", "text": "I want to fly now." },
                  { "id": "option-4", "text": "Show me the airplane." }
                ],
                "correctOptionId": "option-1",
                "completed": false
              }
            },
            {
              "id": "lesson-travel-2",
              "title": "En el Hotel",
              "content": "Cómo hacer una reserva, registrarte y pedir servicios en el hotel.",
              "completed": false,
              "image": "https://www.aprenderinglesrapidoyfacil.com/wp-content/uploads/2023/12/vocabulario-de-viajes-en-ingles.png",
              "quiz": {
                "id": "quiz-travel-2",
                "question": "¿Qué frase usarías para preguntar si hay habitaciones disponibles?",
                "options": [
                  { "id": "option-1", "text": "Do you have any rooms available?" },
                  { "id": "option-2", "text": "Where is the bathroom?" },
                  { "id": "option-3", "text": "I need a taxi." },
                  { "id": "option-4", "text": "Is breakfast included?" }
                ],
                "correctOptionId": "option-1",
                "completed": false
              }
            },
            {
              "id": "lesson-travel-3",
              "title": "Pidiendo Direcciones",
              "content": "Expresiones para preguntar cómo llegar a un lugar y entender indicaciones.",
              "completed": false,
              "image": "https://inglesbasico.org/wp-content/uploads/direcciones-en-ingles.png",
              "quiz": {
                "id": "quiz-travel-3",
                "question": "¿Cómo preguntarías dónde está la estación de tren?",
                "options": [
                  { "id": "option-1", "text": "Where is the train station?" },
                  { "id": "option-2", "text": "What time is the train?" },
                  { "id": "option-3", "text": "How much is the ticket?" },
                  { "id": "option-4", "text": "Can I buy food here?" }
                ],
                "correctOptionId": "option-1",
                "completed": false
              }
            },
            {
              "id": "lesson-travel-4",
              "title": "En el Restaurante",
              "content": "Cómo hacer pedidos, pedir la cuenta y expresar preferencias o alergias.",
              "completed": false,
              "video": "https://youtu.be/PUljdQob0BI?si=JHI2fUj526waWmWB",
              "quiz": {
                "id": "quiz-travel-4",
                "question": "¿Qué frase usarías para pedir el menú?",
                "options": [
                  { "id": "option-1", "text": "Can I see the menu, please?" },
                  { "id": "option-2", "text": "Where is the restroom?" },
                  { "id": "option-3", "text": "I want water." },
                  { "id": "option-4", "text": "Is this spicy?" }
                ],
                "correctOptionId": "option-1",
                "completed": false
              }
            },
            {
              "id": "lesson-travel-5",
              "title": "Compras y Regateo",
              "content": "Frases útiles para comprar souvenirs y negociar precios.",
              "completed": false,
              "video": "https://youtu.be/wt_-h9BoYoQ?si=tSXtxfx53BTsWK4h",
              "quiz": {
                "id": "quiz-travel-5",
                "question": "¿Cómo preguntarías el precio de un artículo?",
                "options": [
                  { "id": "option-1", "text": "How much does this cost?" },
                  { "id": "option-2", "text": "Do you have this in another color?" },
                  { "id": "option-3", "text": "Can I pay with credit card?" },
                  { "id": "option-4", "text": "I want to return this." }
                ],
                "correctOptionId": "option-1",
                "completed": false
              }
            },
            {
              "id": "lesson-travel-6",
              "title": "Emergencias y Salud",
              "content": "Cómo pedir ayuda médica y explicar síntomas básicos.",
              "completed": false,
              "video": "https://youtu.be/9G1eqo8n2Xc?si=4uzD-ixDP-_SbO-i",
              "quiz": {
                "id": "quiz-travel-6",
                "question": "¿Cuál frase usarías para pedir ayuda en caso de emergencia?",
                "options": [
                  { "id": "option-1", "text": "I need help, please." },
                  { "id": "option-2", "text": "Where is the museum?" },
                  { "id": "option-3", "text": "Can I have a map?" },
                  { "id": "option-4", "text": "I lost my phone." }
                ],
                "correctOptionId": "option-1",
                "completed": false
              }
            },
            {
              "id": "lesson-travel-7",
              "title": "Transporte Público",
              "content": "Frases para comprar boletos, consultar horarios y usar buses o taxis.",
              "completed": false,
              "image": "https://www.openenglish.com/blog/es/wp-content/uploads/sites/2/2015/12/LAT-01-05-17-blog1.png",
              "quiz": {
                "id": "quiz-travel-7",
                "question": "¿Cómo preguntarías a qué hora sale el próximo autobús?",
                "options": [
                  { "id": "option-1", "text": "What time is the next bus?" },
                  { "id": "option-2", "text": "Where is the bus station?" },
                  { "id": "option-3", "text": "How much is a ticket?" },
                  { "id": "option-4", "text": "Can I have a seat by the window?" }
                ],
                "correctOptionId": "option-1",
                "completed": false
              }
            }
          ]
        },
        {
          "id": "module-intermediate",
          "title": "Nivel Intermedio (B1/B2)",
          "lessons": [
            {
              "id": "lesson-inter-1",
              "title": "Pasado simple",
              "content": "Aprende a hablar sobre eventos que ocurrieron en el pasado.",
              "completed": false,
              "video": "https://www.youtube.com/watch?v=44brYSuVuVA",
              "quiz": {
                "id": "quiz-inter-1",
                "question": "¿Cuál es la forma pasada de 'go'?",
                "options": [
                  { "id": "option-1", "text": "Goed" },
                  { "id": "option-2", "text": "Go" },
                  { "id": "option-3", "text": "Went" },
                  { "id": "option-4", "text": "Goes" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            },
            {
              "id": "lesson-inter-2",
              "title": "Futuro con 'will' y 'going to'",
              "content": "Aprende a expresar intenciones y predicciones.",
              "completed": false,
              "video": "https://youtu.be/BB4cQ3HBxW4?si=I7ckCXkMbTlFdBgh",
              "quiz": {
                "id": "quiz-inter-2",
                "question": "¿Qué estructura se usa para una decisión espontánea?",
                "options": [
                  { "id": "option-1", "text": "Going to" },
                  { "id": "option-2", "text": "Will" },
                  { "id": "option-3", "text": "Used to" },
                  { "id": "option-4", "text": "Can" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-inter-3",
              "title": "Comparativos y superlativos",
              "content": "Aprende a comparar personas, objetos y lugares.",
              "completed": false,
              "video": "https://youtu.be/3C49nBmsVbI?si=jkHmXkJjkJLXX6Of",
              "quiz": {
                "id": "quiz-inter-3",
                "question": "¿Cuál es la forma superlativa de 'fast'?",
                "options": [
                  { "id": "option-1", "text": "Faster" },
                  { "id": "option-2", "text": "More fast" },
                  { "id": "option-3", "text": "The fastest" },
                  { "id": "option-4", "text": "Fastest than" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            },
            {
              "id": "lesson-inter-4",
              "title": "Condicional tipo 1",
              "content": "Explora cómo usar el primer condicional para hablar de posibilidades reales.",
              "completed": false,
              "video": "https://youtu.be/rvmcGCDYhvQ?si=ikC68hRvQwQjxjAC",
              "quiz": {
                "id": "quiz-inter-4",
                "question": "¿Cuál es la estructura del primer condicional?",
                "options": [
                  { "id": "option-1", "text": "If + past, would + verb" },
                  { "id": "option-2", "text": "If + present, will + verb" },
                  { "id": "option-3", "text": "If + will, will + verb" },
                  { "id": "option-4", "text": "If + past perfect, would have + verb" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-inter-5",
              "title": "Presente perfecto",
              "content": "Aprende a hablar sobre experiencias y acciones que aún tienen relevancia en el presente.",
              "completed": false,
              "video": "https://youtu.be/7aw7bQtPYCE?si=4ZCBifTFNwUJi1S8",
              "quiz": {
                "id": "quiz-inter-5",
                "question": "¿Cuál es la forma correcta del presente perfecto de 'to eat'?",
                "options": [
                  { "id": "option-1", "text": "Eat" },
                  { "id": "option-2", "text": "Eated" },
                  { "id": "option-3", "text": "Have eaten" },
                  { "id": "option-4", "text": "Has eat" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            },
            {
              "id": "lesson-inter-6",
              "title": "Voz pasiva",
              "content": "Aprende a construir oraciones en voz pasiva para enfocarte en la acción o el objeto.",
              "completed": false,
              "video": "https://youtu.be/080leytixWE?si=CqWybDx_3UzPvCx7",
              "quiz": {
                "id": "quiz-inter-6",
                "question": "¿Cómo se forma la voz pasiva en presente simple?",
                "options": [
                  { "id": "option-1", "text": "Subject + verb + object" },
                  { "id": "option-2", "text": "Subject + am/is/are + past participle" },
                  { "id": "option-3", "text": "Subject + was/were + verb" },
                  { "id": "option-4", "text": "Subject + will + verb" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-inter-7",
              "title": "Reported speech (Estilo indirecto)",
              "content": "Aprende a contar lo que otra persona dijo usando el estilo indirecto.",
              "completed": false,
              "video": "https://youtu.be/Sg5lg5ohzMc?si=-8Io94K6yzqkL_qm",
              "quiz": {
                "id": "quiz-inter-7",
                "question": "¿Cuál es la forma correcta de reportar: She said, 'I am tired'?",
                "options": [
                  { "id": "option-1", "text": "She said she is tired." },
                  { "id": "option-2", "text": "She said she was tired." },
                  { "id": "option-3", "text": "She said I am tired." },
                  { "id": "option-4", "text": "She says she is tired." }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-inter-8",
              "title": "Modal verbs para consejo y obligación",
              "content": "Aprende a usar 'should', 'must', y 'have to' para dar consejos y expresar obligaciones.",
              "completed": false,
              "video": "https://youtu.be/2LhuE7BnL4g?si=untqHVO28JfJupjN",
              "quiz": {
                "id": "quiz-inter-8",
                "question": "¿Cuál frase indica obligación fuerte?",
                "options": [
                  { "id": "option-1", "text": "You should study more." },
                  { "id": "option-2", "text": "You must wear a helmet." },
                  { "id": "option-3", "text": "You have to think about it." },
                  { "id": "option-4", "text": "You might want to try." }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-inter-9",
              "title": "Gerundios e infinitivos",
              "content": "Diferencias y usos de gerundios e infinitivos en inglés.",
              "completed": false,
              "video": "https://youtu.be/-s1gu725tA4?si=eXs8goXqTTU75C-l",
              "quiz": {
                "id": "quiz-inter-9",
                "question": "¿Cuál es correcto? 'I enjoy ___ music.'",
                "options": [
                  { "id": "option-1", "text": "to listen" },
                  { "id": "option-2", "text": "listening" },
                  { "id": "option-3", "text": "listen" },
                  { "id": "option-4", "text": "listened" }
                ],
                "correctOptionId": "option-2",
                "completed": false
              }
            },
            {
              "id": "lesson-inter-10",
              "title": "Conectores y frases para expresar causa y consecuencia",
              "content": "Aprende a usar conectores como 'because', 'so', 'therefore' para conectar ideas.",
              "completed": false,
              "video": "https://youtu.be/Vs7vlKeTT_A?si=aR-wtVcWA40nkj9k",
              "quiz": {
                "id": "quiz-inter-10",
                "question": "¿Cuál conecta correctamente la causa y la consecuencia? 'I was tired, ___ I went to bed early.'",
                "options": [
                  { "id": "option-1", "text": "because" },
                  { "id": "option-2", "text": "but" },
                  { "id": "option-3", "text": "so" },
                  { "id": "option-4", "text": "although" }
                ],
                "correctOptionId": "option-3",
                "completed": false
              }
            }
          ]
        },
        {
          id: "module-advanced",
          title: "Nivel Avanzado (C1/C2)",
          lessons: [
            {
              id: "lesson-adv-1",
              title: "Vocabulario avanzado",
              content: "Amplía tu vocabulario con términos y expresiones complejas.",
              completed: false,
              video: "https://www.youtube.com/watch?v=OchqIRE1g0M",
              quiz: {
                id: "quiz-adv-1",
                question: "¿Qué significa 'ubiquitous'?",
                options: [
                  { id: "option-1", text: "Raro" },
                  { id: "option-2", text: "Común" },
                  { id: "option-3", text: "Inusual" },
                  { id: "option-4", text: "Poco frecuente" }
                ],
                correctOptionId: "option-2",
                completed: false
              }
            },
            {
              id: "lesson-adv-2",
              title: "Phrasal verbs avanzados",
              content: "Expande tu vocabulario con phrasal verbs complejos y su uso en contexto.",
              completed: false,
              video: "https://youtu.be/Py7C0ztQ6fQ?si=k-SBF20aeR64Vbxd",
              quiz: {
                id: "quiz-adv-2",
                question: "¿Qué significa 'to run into someone'?",
                options: [
                  { id: "option-1", text: "Chocar con alguien" },
                  { id: "option-2", text: "Conocer a alguien nuevo" },
                  { id: "option-3", text: "Encontrarse con alguien por casualidad" },
                  { id: "option-4", text: "Huir de alguien" }
                ],
                correctOptionId: "option-3",
                completed: false
              }
            },
            {
              id: "lesson-adv-3",
              title: "Inversiones gramaticales",
              content: "Domina estructuras inversas para lograr un inglés más avanzado y formal.",
              completed: false,
              video: "https://youtu.be/ZfkKD1pUHiU?si=2E6gGdB1DA43O2t2",
              quiz: {
                id: "quiz-adv-3",
                question: "¿Cuál es un ejemplo correcto de inversión gramatical?",
                options: [
                  { id: "option-1", text: "Never I have seen such a thing" },
                  { id: "option-2", text: "Never have I seen such a thing" },
                  { id: "option-3", text: "Have I never seen such a thing" },
                  { id: "option-4", text: "Never seen I have such a thing" }
                ],
                correctOptionId: "option-2",
                completed: false
              }
            },
            {
              id: "lesson-adv-4",
              title: "Discursos y debates",
              content: "Practica expresarte con fluidez y argumentar tus ideas de forma lógica.",
              completed: false,
              video: "https://youtu.be/WJuMUkZqFkg?si=WhEbq5amlZ13XE78",
              quiz: {
                id: "quiz-adv-4",
                question: "¿Qué expresión es útil para introducir una opinión fuerte?",
                options: [
                  { id: "option-1", text: "In my opinion" },
                  { id: "option-2", text: "I think so" },
                  { id: "option-3", text: "It is clear to me that" },
                  { id: "option-4", text: "Maybe" }
                ],
                correctOptionId: "option-3",
                completed: false
              }
            }
          ]
        }
      ]
    },
  ]
};

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const storedCourses = await AsyncStorage.getItem(COURSES_STORAGE_KEY);

        if (storedCourses) {
          const parsedCourses = JSON.parse(storedCourses);

          let datosCorrectos = true;
          // ... (tu lógica de verificación de datosCorrectos) ...
          // (Los console.log dentro de esta lógica son útiles)

          if (datosCorrectos) {
            setCourses(parsedCourses);
          } else {
            setCourses(coursesData.courses); // <-- Verifica que coursesData.courses tenga múltiples items
            await AsyncStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(coursesData.courses));
          }
        } else {
          setCourses(coursesData.courses); // <-- Verifica que coursesData.courses tenga múltiples items
          await AsyncStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(coursesData.courses));
        }
      } catch (e: any) { // Tipar el error para acceder a message
        setError(e.message || 'No se pudieron cargar los cursos');
        setCourses(coursesData.courses); // Fallback a los datos por defecto
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);



  // Función para actualizar un curso específico
  const updateCourse = async (updatedCourse: Course) => {
    try {
      // Verificar que el curso actualizado tenga todos los módulos y lecciones
      let completo = true;
      updatedCourse.modules.forEach(module => {
        if (module.id === "module-intro" && module.lessons.length !== 3) {
          completo = false;
        }
      });

      if (!completo) {
        const originalCourse = coursesData.courses.find(c => c.id === updatedCourse.id);

        if (originalCourse) {
          // Mantener solo el progreso del usuario
          const mergedCourse = {
            ...originalCourse,
            completedQuestions: updatedCourse.completedQuestions
          };

          // Actualizar solo ese curso
          const updatedCourses = courses.map(course =>
            course.id === updatedCourse.id ? mergedCourse : course
          );

          setCourses(updatedCourses);
          await AsyncStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updatedCourses));
          return;
        }
      }

      // Si todo está bien, actualizamos normalmente
      const updatedCourses = courses.map(course =>
        course.id === updatedCourse.id ? updatedCourse : course
      );

      setCourses(updatedCourses);
      await AsyncStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updatedCourses));

      console.log(`Curso actualizado: ${updatedCourse.id}`);
    } catch (e) {
      console.error('Error al actualizar el curso:', e);
      setError('No se pudo actualizar el curso');
    }
  };

  // Función para reiniciar el progreso de un curso
  const resetCourseProgress = async (courseId: string) => {
    try {
      // Buscar el curso original en el JSON
      const originalCourse = coursesData.courses.find(c => c.id === courseId);

      if (!originalCourse) {
        console.log(`No se encontró el curso con ID: ${courseId} en los datos originales`);
        return;
      }

      // Reiniciar el progreso manteniendo la estructura original
      const resetCourse = {
        ...originalCourse,
        completedQuestions: 0,
        modules: originalCourse.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson => ({
            ...lesson,
            quiz: {
              ...lesson.quiz,
              completed: false
            }
          }))
        }))
      };

      const updatedCourses = courses.map(course =>
        course.id === courseId ? resetCourse : course
      );

      setCourses(updatedCourses);
      await AsyncStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updatedCourses));

      console.log(`Progreso del curso ${courseId} reiniciado`);
    } catch (e) {
      console.error('Error al reiniciar el progreso del curso:', e);
      setError('No se pudo reiniciar el progreso');
    }
  };

  const resetAllCoursesData = async () => {
    try {
      setCourses(coursesData.courses);
      await AsyncStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(coursesData.courses));

      console.log("Todos los cursos han sido restablecidos a valores iniciales");
    } catch (e) {
      console.error('Error al restablecer todos los cursos:', e);
      setError('No se pudieron restablecer los cursos');
    }
  };

  const debugForceReload = async () => {
    try {
      await AsyncStorage.removeItem(COURSES_STORAGE_KEY);
      setCourses(coursesData.courses); // ¡Importante! Actualiza el estado
      return true;
    } catch (e) {
      console.error("[useCourses] DEBUG: Error al forzar recarga:", e);
      setError('Error al forzar recarga de datos.');
      return false;
    }
  };

  useEffect(() => {
    console.log('[useCourses] Estado de "courses" actualizado. Número de cursos:', courses.length);
    if (courses.length > 0) {
      console.log('[useCourses] Primer curso en estado actual:', courses[0].id);
    }
  }, [courses]);

  return {
    courses,
    loading,
    error,
    updateCourse,
    resetCourseProgress,
    resetAllCoursesData,
    debugForceReload,
  };
};