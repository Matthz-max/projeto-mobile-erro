import React, { useState } from 'react';
import { NativeBaseProvider, extendTheme, useColorMode } from 'native-base';
import HomeScreen from '../../screens/HomeScreen';
import WelcomeScreen from '../../screens/WelcomeScreen';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';

const AppContent = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const { isDarkMode } = useTheme();
 
  const customTheme = extendTheme({
    config: {
      initialColorMode: isDarkMode ? 'dark' : 'light',
    },
    colors: {
      primary: {
        50: '#ffe5d0',
        100: '#ffc49e',
        200: '#ffa26c',
        300: '#ff8040',
        400: '#ff661a', // Laranja
        500: '#e65c17',
        600: '#b34711',
        700: '#802f0c',
        800: '#4d1a06',
        900: '#1f0500',
      },
      background: isDarkMode ? '#121212' : '#f9f9f9',
    },
  });

  return (
    <NativeBaseProvider theme={customTheme}>
      {showWelcome ? (
        <WelcomeScreen onNext={() => setShowWelcome(false)} />
      ) : (
        <HomeScreen />
      )}
    </NativeBaseProvider>
  );
};

export default function Index() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
