import { ResizeMode, Video } from 'expo-av';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

type Props = {
  onNext: () => void;
};

const WelcomeScreen: React.FC<Props> = ({ onNext }) => {
  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/video/fundoFerrari.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />

      <View style={styles.overlay}>
        <Text style={styles.title}>Bem-vindo ao ModelCar</Text>
        <TouchableOpacity onPress={onNext} style={styles.button}>
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  video: {
    width,
    height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#e05e00',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default WelcomeScreen;
