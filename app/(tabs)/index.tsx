import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">¡Bienvenido {user?.displayName || 'Usuario'}!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">¡Bienvenido al Diario Estoico!</ThemedText>
        <ThemedText>
          Estás autenticado como: <ThemedText type="defaultSemiBold">{user?.email}</ThemedText>
        </ThemedText>
        <ThemedText>
          Aquí podrás reflexionar sobre las enseñanzas estoicas y llevar un registro de tu crecimiento personal.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Funcionalidades</ThemedText>
        <ThemedText>
          • Escribe reflexiones diarias inspiradas en la filosofía estoica
        </ThemedText>
        <ThemedText>
          • Lee citas de grandes filósofos como Marco Aurelio, Epicteto y Séneca
        </ThemedText>
        <ThemedText>
          • Haz un seguimiento de tu progreso en la práctica estoica
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Configuración de cuenta</ThemedText>
        <ThemedText>
          Ve a la pestaña <ThemedText type="defaultSemiBold">Explore</ThemedText> para ver tu información de usuario y gestionar tu sesión.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
