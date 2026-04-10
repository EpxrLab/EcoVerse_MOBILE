import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Coins, Cake } from "lucide-react-native";
import { FadeInView } from "./FadeInView";

export function ChildCard({ child, onSelect }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <FadeInView
      from={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "timing", duration: 300 }}
    >
      <TouchableOpacity
        onPress={() => onSelect(child)}
        activeOpacity={0.95}
        style={styles.card}
      >
        {/* Header: Avatar + Info */}
        <View style={styles.header}>
          {/* Name + School + Level */}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {child.studentFullName}
            </Text>
            <Text style={styles.school} numberOfLines={1}>
              Lớp {child.gradeLevel}{child.className} {child.school_name ? `• ${child.school_name}` : ""}
            </Text>

            <View style={styles.dobContainer}>
              <Cake size={14} color="#6B7280" />
              <Text style={styles.dobText}>
                Ngày sinh: {formatDate(child.dob)}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statBox,
              { backgroundColor: "rgba(245,158,11,0.1)" },
            ]}
          >
            <Coins size={20} color="#F59E0B" />
            <Text style={styles.statValue}>{child.totalCoin}</Text>
            <Text style={styles.statLabel}>Xu</Text>
          </View>
        </View>
      </TouchableOpacity>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "rgba(52,168,83,0.3)",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(52,168,83,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: "700",
    color: "#34A853",
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  school: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  dobContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  dobText: {
    fontSize: 12,
    color: "#6B7280",
  },
  badgeWrapper: {
    marginTop: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "rgba(52,168,83,0.1)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(52,168,83,0.3)",
  },
  badge: {
    fontSize: 11,
    fontWeight: "600",
    color: "#34A853",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  statLabel: {
    fontSize: 10,
    color: "#9CA3AF",
  },
});
