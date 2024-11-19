import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, createContext, useContext } from 'react';
import 'react-native-reanimated';
import { Provider as PaperProvider } from 'react-native-paper';
import { createThemes } from '@/constants/themes';
import { useColorScheme } from '@/hooks/useColorScheme';
import Toast from 'react-native-toast-message';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a context for the selected palette
const PaletteContext = createContext();

export const usePalette = () => useContext(PaletteContext);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [selectedPalette, setSelectedPalette] = useState('green');
  const [themes, setThemes] = useState(createThemes(selectedPalette));
  const { CustomPaperLightTheme, CustomPaperDarkTheme, CustomNavigationLightTheme, CustomNavigationDarkTheme } = themes;

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    setThemes(createThemes(selectedPalette));
  }, [selectedPalette]);

  if (!loaded) {
    return null;
  }

  return (
    <PaletteContext.Provider value={{ selectedPalette, setSelectedPalette }}>
      <PaperProvider theme={colorScheme === 'dark' ? CustomPaperDarkTheme : CustomPaperLightTheme}>
        <ThemeProvider value={colorScheme === 'dark' ? CustomNavigationDarkTheme : CustomNavigationLightTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <Toast />
        </ThemeProvider>
      </PaperProvider>
    </PaletteContext.Provider>
  );
}