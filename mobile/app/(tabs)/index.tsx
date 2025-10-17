// import { apolloClient } from "@/lib/apollo-client";
// import { ApolloProvider } from "@apollo/client/react";
import { ActivityList } from "@/components/activity-list";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    // <ApolloProvider client={apolloClient}>
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ActivityList />
    </View>
    // </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
});
