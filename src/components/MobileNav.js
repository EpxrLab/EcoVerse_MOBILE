import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Trophy, Settings, Flag, Gift } from "lucide-react-native";

const navItems = [
  { icon: Home, label: "Trang chủ", route: "ParentHome" },
  { icon: Gift, label: "Quà tặng", route: "ParentRewards" },
  { icon: Flag, label: "Chiến dịch", route: "ParentCampaigns" },
  { icon: Trophy, label: "Xếp hạng", route: "ParentStats" },
  { icon: Settings, label: "Cài đặt", route: "ParentSettings" },
];

export function MobileNav({ currentRoute, onNavigate }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.nav, { paddingBottom: insets.bottom + 4 }]}>
      <View style={styles.row}>
        {navItems.map((item) => {
          const isActive = currentRoute === item.route;
          const Icon = item.icon;

          return (
            <TouchableOpacity
              key={item.route}
              onPress={() => onNavigate(item.route)}
              activeOpacity={0.7}
              style={styles.navItem}
            >
              <Icon
                size={24}
                color={isActive ? "#34A853" : "#9CA3AF"}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <Text
                style={[
                  styles.label,
                  isActive ? styles.labelActive : styles.labelInactive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: "rgba(255,255,255,0.97)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    minWidth: 64,
  },
  label: {
    fontSize: 10,
  },
  labelActive: {
    fontWeight: "600",
    color: "#34A853",
  },
  labelInactive: {
    fontWeight: "400",
    color: "#9CA3AF",
  },
});
