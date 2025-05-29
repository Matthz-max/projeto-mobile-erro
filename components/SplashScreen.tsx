import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Video from 'react-native-video';

type Props = {
  onFinish: () => void;
};

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    // Fecha splash após 4 segundos (tempo do vídeo ou seu tempo preferido)
    const timeout = setTimeout(() => {
      onFinish();
    }, 4000);
    return () => clearTimeout(timeout);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Video
        source={require('../../assets/ ')} // coloque seu vídeo aqui
        style={styles.video}
        resizeMode="cover"
        repeat={false}
        muted={true}
        onEnd={onFinish} // também termina ao acabar o vídeo
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Bem-vindo ao Driveasy</Text>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    width,
    height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', // para escurecer um pouco o vídeo
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SplashScreen;
