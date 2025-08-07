import Constants from 'expo-constants';

import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Authorities } from "./src/Authorities";
import { AppQueryClientProvider } from "./src/AppQueryClientProvider";
import * as Sentry from "@sentry/react-native";
import { CrashTests } from './src/CrashTests';

Sentry.init({
  dsn: Constants.expoConfig?.extra?.SENTRY_DSN,

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AppQueryClientProvider>
        <>          
          <CrashTests />
          <Authorities />
        </>
      </AppQueryClientProvider>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
