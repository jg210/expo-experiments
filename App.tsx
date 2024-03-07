import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Authorities } from "./src/Authorities";

const queryClient = new QueryClient();

const Fallback = () => <Text>global fallback</Text>;

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={styles.container}>
          <Authorities />
        </SafeAreaView>
      </QueryClientProvider>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
