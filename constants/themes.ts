import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import {
  DefaultTheme as PaperDefaultTheme,
  MD3DarkTheme,
  MD3Theme,
} from 'react-native-paper';


  /**
   * Obtained from https://uicolors.app/browse/tailwind-colors
   */
  // Define your color palettes
  export const ColorPalettes = {
    teal: {
      '50': '#f0fdfa',
      '100': '#ccfbf1',
      '200': '#99f6e4',
      '300': '#5eead4',
      '400': '#2dd4bf',
      '500': '#14b8a6',
      '600': '#0d9488',
      '700': '#0f766e',
      '800': '#115e59',
      '900': '#134e4a',
      '950': '#042f2e',
    },
    pink: {
      '50': '#fdf2f8',
      '100': '#fce7f3',
      '200': '#fbcfe8',
      '300': '#f9a8d4',
      '400': '#f472b6',
      '500': '#ec4899',
      '600': '#db2777',
      '700': '#be185d',
      '800': '#9d174d',
      '900': '#831843',
      '950': '#500724',
  },
  slate: {
        '50': '#f8fafc',
        '100': '#f1f5f9',
        '200': '#e2e8f0',
        '300': '#cbd5e1',
        '400': '#94a3b8',
        '500': '#64748b',
        '600': '#475569',
        '700': '#334155',
        '800': '#1e293b',
        '900': '#0f172a',
        '950': '#020617',
    },
    amber: {
        '50': '#fffbeb',
        '100': '#fef3c7',
        '200': '#fde68a',
        '300': '#fcd34d',
        '400': '#fbbf24',
        '500': '#f59e0b',
        '600': '#d97706',
        '700': '#b45309',
        '800': '#92400e',
        '900': '#78350f',
        '950': '#451a03',
    },    
    green: {
      '50': '#f6faeb',
      '100': '#e9f4d3',
      '200': '#d5eaac',
      '300': '#b7db7b',
      '400': '#9ac94f',
      '500': '#7daf33',
      '600': '#608b25',
      '700': '#4a6b20',
      '800': '#3d551f',
      '900': '#35491e',
      '950': '#1a270c',
    },
  };
  
  /*
  Here is where you can change the color palette for the app.
  choose one the the colors defined above.
  e.g. pink, teal, slate, amber, green
  */

// Selected color palette
export const SelectedPalette = ColorPalettes.green;

// Light Theme for React Native Paper
export const CustomPaperLightTheme: MD3Theme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,

    primary: SelectedPalette['600'],
    onPrimary: SelectedPalette['50'],
    secondary: SelectedPalette['700'],
    onSecondary: SelectedPalette['50'],
    background: SelectedPalette['50'],
    onBackground: SelectedPalette['900'],
    surface: SelectedPalette['100'],
    onSurface: SelectedPalette['900'],
    error: '#B00020',
    onError: '#FFFFFF',
    outline: SelectedPalette['300'],
    surfaceVariant: SelectedPalette['200'],
    onSurfaceVariant: SelectedPalette['800'],
    inverseSurface: SelectedPalette['900'],
    inverseOnSurface: SelectedPalette['50'],
    primaryContainer: SelectedPalette['300'],
    onPrimaryContainer: SelectedPalette['900'],
    secondaryContainer: SelectedPalette['100'],
    onSecondaryContainer: SelectedPalette['900'],
    tertiary: SelectedPalette['400'],
    onTertiary: SelectedPalette['50'],
  },
};

// Dark Theme for React Native Paper
export const CustomPaperDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,

    primary: SelectedPalette['600'],
    onPrimary: SelectedPalette['50'],
    secondary: SelectedPalette['700'],
    onSecondary: SelectedPalette['50'],
    background: SelectedPalette['50'],
    onBackground: SelectedPalette['900'],
    surface: SelectedPalette['100'],
    onSurface: SelectedPalette['900'],
    error: '#B00020',
    onError: '#FFFFFF',
    outline: SelectedPalette['400'],
    surfaceVariant: SelectedPalette['200'],
    onSurfaceVariant: SelectedPalette['800'],
    inverseSurface: SelectedPalette['900'],
    inverseOnSurface: SelectedPalette['50'],
    primaryContainer: SelectedPalette['300'],
    onPrimaryContainer: SelectedPalette['900'],
    secondaryContainer: SelectedPalette['100'],
    onSecondaryContainer: SelectedPalette['900'],
    tertiary: SelectedPalette['400'],
    onTertiary: SelectedPalette['50'],
  },
};

// Light Theme for React Navigation
export const CustomNavigationLightTheme: NavigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: SelectedPalette['500'],
    background: SelectedPalette['50'],
    card: SelectedPalette['100'],
    text: SelectedPalette['900'],
    border: SelectedPalette['400'],
    notification: SelectedPalette['400'],
  },
};

// Dark Theme for React Navigation
export const CustomNavigationDarkTheme: NavigationTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: SelectedPalette['500'],
    background: SelectedPalette['50'],
    card: SelectedPalette['100'],
    text: SelectedPalette['900'],
    border: SelectedPalette['400'],
    notification: SelectedPalette['400'],
  },
};