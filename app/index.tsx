// app/index.tsx
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import ContainerRoute from '@/src/routes';

export default function Index() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Esto asegura que el layout se haya montado
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Solo navega si el layout se ha montado
      router.replace('/screens/Login'); // Reemplaza con la ruta deseada
    }
  }, [isMounted, router]);

  return null; // O puedes retornar un componente de carga mientras se redirige
}
