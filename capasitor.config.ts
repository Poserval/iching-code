import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iching.codeiching',
  appName: 'Код Ицзин',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'code_iching.jks',
      keystoreAlias: 'code_iching',
      releaseType: 'AAB' // Или APK - как предпочтёшь
    }
  }
};

export default config;
