import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d84af7ebd303478ea3d8783b11d493b0',
  appName: 'MediFile',
  webDir: 'dist',
  server: {
    url: 'https://d84af7eb-d303-478e-a3d8-783b11d493b0.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
