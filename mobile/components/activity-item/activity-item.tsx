import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Activity } from "../../types/activity";
import { getTimeSince } from "../../utils/time";

interface ActivityItemProps {
  activity: Activity;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Maintenance":
        return "#fef3c7";
      case "Feature":
        return "#d1fae5";
      case "Update":
        return "#dbeafe";
      default:
        return "#f3f4f6";
    }
  };

  const getCategoryTextColor = (category: string) => {
    switch (category) {
      case "Maintenance":
        return "#92400e";
      case "Feature":
        return "#065f46";
      case "Update":
        return "#1e40af";
      default:
        return "#374151";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{activity.title}</Text>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(activity.category) },
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              { color: getCategoryTextColor(activity.category) },
            ]}
          >
            {activity.category}
          </Text>
        </View>
      </View>

      <Text style={styles.message}>{activity.message}</Text>

      <View style={styles.footer}>
        <Text style={styles.time}>{getTimeSince(activity.createdAt)}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: activity.isActive ? "#d1fae5" : "#fee2e2" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: activity.isActive ? "#065f46" : "#dc2626" },
            ]}
          >
            {activity.isActive ? "Active" : "Expired"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
  },
  message: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    fontSize: 12,
    color: "#9ca3af",
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
  },
});
