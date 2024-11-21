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
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a context for the selected palette
const PaletteContext = createContext<{
  selectedPalette: 'green' | 'teal' | 'pink' | 'purple' | 'amber';
  setSelectedPalette: React.Dispatch<React.SetStateAction<'green' | 'teal' | 'pink' | 'purple' | 'amber'>>;
}>({
  selectedPalette: 'green',
  setSelectedPalette: () => {}
});

export const usePalette = () => useContext(PaletteContext);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [selectedPalette, setSelectedPalette] = useState<'green' | 'teal' | 'pink' | 'purple' | 'amber'>('green');
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
    const loadPalette = async () => {
      try {
        const savedPalette = await AsyncStorage.getItem('selectedPalette');
        if (savedPalette) {
          setSelectedPalette(savedPalette as 'green' | 'teal' | 'pink' | 'purple' | 'amber');
        }
      } catch (error) {
        console.error('Failed to load palette from storage', error);
      }
    };

    loadPalette();
  }, []);

  useEffect(() => {
    setThemes(createThemes(selectedPalette));
    const savePalette = async () => {
      try {
        await AsyncStorage.setItem('selectedPalette', selectedPalette);
      } catch (error) {
        console.error('Failed to save palette to storage', error);
      }
    };

    savePalette();
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