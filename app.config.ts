import { ExpoConfig } from 'expo/config';

const config : { expo: ExpoConfig } = {
  expo: {
    "name": "expo-experiments",
    "slug": "expo-experiments",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "uk.me.jeremygreen.expoexperiments",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "uk.me.jeremygreen.expoexperiments"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "9980ae3b-7d5d-4df7-9b14-31ef911db1b7"
      }
    },
    "owner": "jgreen210",
    "plugins": [
      [
        "@sentry/react-native/expo",
        {
          "url": "https://sentry.io/",
          "project": "expo-experiments",
          "organization": "jeremy-green"
        }
      ]
    ]
  }
};

export default config;