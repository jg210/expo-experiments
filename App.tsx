import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Authorities } from "./src/Authorities";
import { AppQueryClientProvider } from "./src/AppQueryClientProvider";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AppQueryClientProvider>
        <View>
          <Text testID="testing2">testing2</Text>
          <Authorities />
        </View>
      </AppQueryClientProvider>
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
