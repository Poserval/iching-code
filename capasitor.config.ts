import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iching.codeiching',
  appName: 'Код Ицзин',
  webDir: '.', // ← ТОЧКА! Берем файлы из корня
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'code_iching.jks',
      keystoreAlias: 'code_iching'
    }
  }
};

export default config;
