import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, Leaf } from "lucide-react-native";

export function MobileHeader({ title }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        {/* Left: Logo + Title */}
        <View style={styles.left}>
          <View style={styles.logoBox}>
            <Leaf size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Right: Bell + Avatar */}
        <View style={styles.right}>
          <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
            <Bell size={20} color="#6B7280" />
            <View style={styles.badgeDot} />
          </TouchableOpacity>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>P</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#34A853",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bellButton: {
    position: "relative",
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  badgeDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(52,168,83,0.3)",
    backgroundColor: "rgba(52,168,83,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#34A853",
  },
});
