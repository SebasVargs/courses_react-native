// app/user.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../hooks/useUser';
import { Colors } from '../../constants/Colors';

export default function UserScreen() {
  const { user, loading, error, logout } = useUser();

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error al cargar el perfil</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ 
              uri: user?.profileImage || 'https://img.freepik.com/vector-premium/icono-circulo-usuario-anonimo-ilustracion-vector-estilo-plano-sombra_520826-1931.jpg' 
            }} 
            style={styles.profileImage} 
          />
          <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'usuario@ejemplo.com'}</Text>
          <Text style={styles.userCredel}>{'Username: Test'}</Text>
          <Text style={styles.userCredel}>{'Password: 1234'}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary, 
    padding: 15,
    margin: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },  
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: Colors.text,
  },
  
  menuItemIcon: {
    marginLeft: 'auto',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
    marginTop: 20,
  },  
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 5,
    marginBottom: 6
  },
  userCredel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    marginTop: 1,
    paddingVertical: 15,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: Colors.border,
    alignSelf: 'center',
  },
  menuSection: {
    backgroundColor: Colors.background,
    marginTop: 20,
    paddingHorizontal: 15,
  }
})