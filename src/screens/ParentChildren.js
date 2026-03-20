import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import { ArrowLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChildCard } from "../components/ChildCard";

const MOCK_CHILDREN = [
  {
    id: "1",
    name: "Nguyễn Minh Anh",
    avatar_url: null,
    class_name: "Lớp 4A",
    school_name: "Tiểu học Lê Văn Tám",
    level: 5,
    coins: 320,
    accuracy: 87,
    streak_days: 12,
  },
  {
    id: "2",
    name: "Nguyễn Gia Bảo",
    avatar_url: null,
    class_name: "Lớp 2B",
    school_name: "Tiểu học Lê Văn Tám",
    level: 3,
    coins: 150,
    accuracy: 74,
    streak_days: 5,
  },
];

export default function ParentChildren() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleSelectChild = (child) => {
    navigation.navigate("ParentChildDetail", { childId: child.id });
  };

  return (
    <View style={styles.screen}>
      {/* Header với nút back */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Con của tôi</Text>
        {/* spacer để căn giữa title */}
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_CHILDREN.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Bạn chưa có con nào được liên kết
            </Text>
          </View>
        ) : (
          MOCK_CHILDREN.map((child, idx) => (
            <MotiView
              key={child.id}
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 300, delay: idx * 80 }}
            >
              <ChildCard child={child} onSelect={handleSelectChild} />
            </MotiView>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
