import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const isDev = process.env.NODE_ENV === 'development';

const config: CapacitorConfig = {
  appId: 'com.template.app',
  appName: 'MyApp',
  webDir: 'out',
  ...(isDev && {
    server: {
      url: `http://${process.env.DEV_HOST ?? 'localhost'}:3000`,
      cleartext: true,
    },
  }),
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
    Keyboard: {
      resize: KeyboardResize.Body,
      resizeOnFullScreen: true,
    },
    StatusBar: {
      style: 'default',
    },
  },
};

export default config;
