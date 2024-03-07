import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";

import { Authorities } from "./src/Authorities";
import { Suspense } from "react";

const queryClient = new QueryClient();

const Fallback = () => <Text>global fallback</Text>;

export default function App() {
  return (
    <Suspense fallback={<Fallback/>}>
      <QueryClientProvider client={queryClient}>
        <View style={styles.container}>
          <Authorities />
        </View>
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
