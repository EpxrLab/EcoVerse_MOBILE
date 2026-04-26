import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Gamepad2, FileQuestion, Gift } from "lucide-react-native";
import { FadeInView } from "./FadeInView";

const activityIcons = {
  game: Gamepad2,
  quiz: FileQuestion,
  reward: Gift,
};

const activityColors = {
  game: {
    bg: "rgba(52, 168, 83, 0.1)",
    icon: "#34A853",
  },
  quiz: {
    bg: "rgba(66, 133, 244, 0.1)",
    icon: "#4285F4",
  },
  reward: {
    bg: "rgba(245, 158, 11, 0.1)",
    icon: "#F59E0B",
  },
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Vừa xong";
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Hôm qua";
  return `${diffDays} ngày trước`;
};

export function ActivityItem({ activity }) {
  const Icon = activityIcons[activity.type];
  const colors = activityColors[activity.type];

  return (
    <FadeInView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 300 }}
      style={styles.container}
    >
      {/* Icon */}
      <View style={[styles.iconWrapper, { backgroundColor: colors.bg }]}>
        <Icon size={20} color={colors.icon} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {activity.title}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {activity.description}
        </Text>
      </View>

      {/* Coins + Time */}
      <View style={styles.right}>
        <Text
          style={[
            styles.coins,
            { color: activity.coins_earned >= 0 ? "#34A853" : "#9CA3AF" },
          ]}
        >
          {activity.coins_earned >= 0 ? "+" : ""}
          {activity.coins_earned} xu
        </Text>
        <Text style={styles.time}>{formatTime(activity.timestamp)}</Text>
      </View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    marginBottom: 8,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  description: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  right: {
    alignItems: "flex-end",
    flexShrink: 0,
  },
  coins: {
    fontSize: 14,
    fontWeight: "700",
  },
  time: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 2,
  },
});
