import React from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useActivities } from "../../hooks/useActivities";
import { ActivityItem } from "../activity-item";

export const ActivityList: React.FC = () => {
  const { activities, loading, error, refetch } = useActivities();

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading activities</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
      </View>
    );
  }

  if (activities.length === 0 && !loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No activities found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Latest Updates</Text>
        <Text style={styles.headerSubtitle}>
          Auto-refreshes every 10 seconds
        </Text>
      </View>

      <FlatList
        data={activities}
        renderItem={({ item }) => <ActivityItem activity={item} />}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            colors={["#3b82f6"]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  listContent: {
    paddingVertical: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#6b7280",
    textAlign: "center",
  },
});
