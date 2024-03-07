import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Authorities } from "./src/Authorities";

const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <Authorities />
      </QueryClientProvider>
    </SafeAreaView>
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
