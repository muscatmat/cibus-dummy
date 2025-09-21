import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.recipeapp.mobile',
  appName: 'Recipe App',
  // Mode B: Point to packaged web assets from ../web/dist
  webDir: '../web/dist',
  server: {
    // No live reload for production Mode B builds
    androidScheme: 'https'
  },
  plugins: {
    Preferences: {
      // Use secure storage for sensitive data like auth tokens
      group: 'recipe-app'
    }
  },
  android: {
    buildOptions: {
      keystorePath: undefined, // Set in CI via environment
      keystorePassword: undefined, // Set in CI via environment
      keystoreAlias: undefined, // Set in CI via environment
      keystoreAliasPassword: undefined, // Set in CI via environment
      releaseType: 'AAB' // Android App Bundle for Play Store
    }
  },
  ios: {
    scheme: 'Recipe App'
  }
};

export default config;
