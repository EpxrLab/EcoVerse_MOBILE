import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FadeInView } from "../components/FadeInView";
import {
  Bell,
  Shield,
  Moon,
  Globe,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  User,
} from "lucide-react-native";
import { MobileHeader } from "../components/MobileHeader";

export default function ParentSettings() {
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsSections = [
    {
      title: "Tài khoản",
      items: [
        {
          icon: User,
          label: "Thông tin cá nhân",
          action: "navigate",
          screen: "ParentProfile",
        },
        { icon: Shield, label: "Bảo mật", action: "navigate" },
      ],
    },
    {
      title: "Cài đặt",
      items: [
        {
          icon: Bell,
          label: "Thông báo",
          action: "toggle",
          toggleKey: "notifications",
        },
        {
          icon: Moon,
          label: "Chế độ tối",
          action: "toggle",
          toggleKey: "darkMode",
        },
        {
          icon: Globe,
          label: "Ngôn ngữ",
          action: "navigate",
          subtitle: "Tiếng Việt",
        },
      ],
    },
    {
      title: "Hỗ trợ",
      items: [
        { icon: HelpCircle, label: "Trung tâm trợ giúp", action: "navigate" },
        { icon: FileText, label: "Điều khoản sử dụng", action: "navigate" },
      ],
    },
  ];

  const getToggleValue = (key) => {
    if (key === "notifications") return notifications;
    if (key === "darkMode") return darkMode;
    return false;
  };

  const handleToggle = (key) => {
    if (key === "notifications") setNotifications((v) => !v);
    if (key === "darkMode") setDarkMode((v) => !v);
  };

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: "ParentAuth" }] });
  };

  return (
    <View style={styles.screen}>
      <MobileHeader title="Cài đặt" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section, sIdx) => (
          <FadeInView
            key={section.title}
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 300, delay: sIdx * 80 }}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <View style={styles.card}>
              {section.items.map((item, idx) => {
                const Icon = item.icon;
                const isLast = idx === section.items.length - 1;
                const toggleVal =
                  item.action === "toggle"
                    ? getToggleValue(item.toggleKey)
                    : false;

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.row, !isLast && styles.rowBorder]}
                    onPress={() => {
                      if (item.action === "toggle") {
                        handleToggle(item.toggleKey);
                      } else if (item.action === "navigate" && item.screen) {
                        navigation.navigate(item.screen);
                      }
                    }}
                    activeOpacity={item.action === "navigate" ? 0.6 : 1}
                  >
                    {/* Left: icon + label */}
                    <View style={styles.rowLeft}>
                      <View style={styles.iconBox}>
                        <Icon size={18} color="#6B7280" />
                      </View>
                      <View>
                        <Text style={styles.rowLabel}>{item.label}</Text>
                        {item.subtitle && (
                          <Text style={styles.rowSubtitle}>
                            {item.subtitle}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Right: toggle or chevron */}
                    {item.action === "toggle" ? (
                      <Switch
                        value={toggleVal}
                        onValueChange={() => handleToggle(item.toggleKey)}
                        trackColor={{ false: "#E5E7EB", true: "#A7F3D0" }}
                        thumbColor={toggleVal ? "#059669" : "#D1D5DB"}
                      />
                    ) : (
                      <ChevronRight size={18} color="#D1D5DB" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </FadeInView>
        ))}

        {/* Logout */}
        <FadeInView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: 300,
            delay: settingsSections.length * 80,
          }}
        >
          <View style={[styles.card, styles.logoutCard]}>
            <TouchableOpacity
              style={styles.row}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, styles.logoutIconBox]}>
                  <LogOut size={18} color="#DC2626" />
                </View>
                <Text style={styles.logoutText}>Đăng xuất</Text>
              </View>
            </TouchableOpacity>
          </View>
        </FadeInView>

        {/* Version */}
        <Text style={styles.version}>EcoVerse Parent v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 20,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
    paddingLeft: 4,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutCard: {
    borderColor: "#FEE2E2",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIconBox: {
    backgroundColor: "#FEE2E2",
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  rowSubtitle: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 1,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
  },

  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#D1D5DB",
    paddingVertical: 8,
  },
});
