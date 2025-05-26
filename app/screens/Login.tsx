import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';

const defaultUser = {
  username: 'Test',
  password: '1234',
};

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('Test');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (username === defaultUser.username && password === defaultUser.password) {
      router.replace('/(tabs)/b-courses');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Iniciar Sesión',
          headerStyle: { backgroundColor: '#000000' },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            color: '#4f46e5',
          },
        }}
      />
<View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Learnify 📚</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#aaa"
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

    </View>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6fc', // Fondo suave
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2, // Para Android
    },
    button: {
        backgroundColor: '#4f46e5', // Azul bonito
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    error: {
        color: '#ff4d4f',
        marginBottom: 10,
        textAlign: 'center',
    },
});
