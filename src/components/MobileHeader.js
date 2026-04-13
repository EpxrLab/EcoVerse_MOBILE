import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, Leaf } from "lucide-react-native";
import { useNotifications } from "../context/NotificationContext";
import { useNavigation } from "@react-navigation/native";

export function MobileHeader({ title }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { unreadCount } = useNotifications();

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
          <TouchableOpacity
            style={styles.bellButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("ParentNotifications")}
          >
            <Bell size={20} color="#6B7280" />
            {unreadCount > 0 && (
              <View style={styles.badgeDot}>
                {unreadCount < 100 ? (
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                ) : (
                  <Text style={styles.badgeText}>99+</Text>
                )}
              </View>
            )}
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
    top: -2,
    right: -2,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
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
