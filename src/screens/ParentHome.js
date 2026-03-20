import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronRight } from "lucide-react-native";
import { MobileHeader } from "../components/MobileHeader";
import { ChildCard } from "../components/ChildCard";
import { ActivityItem } from "../components/ActivityItem";

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

const MOCK_ACTIVITIES = [
  {
    id: "a1",
    type: "game",
    title: "Phân loại rác thải",
    description: "Hoàn thành màn 3 - Tái chế nhựa",
    coins_earned: 20,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "a2",
    type: "quiz",
    title: "Kiểm tra kiến thức môi trường",
    description: "8/10 câu đúng",
    coins_earned: 15,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "a3",
    type: "reward",
    title: "Đổi quà: Bút màu sinh thái",
    description: "Đã đổi thành công",
    coins_earned: -50,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "a4",
    type: "game",
    title: "Trồng cây xanh",
    description: "Hoàn thành thử thách hàng ngày",
    coins_earned: 10,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "a5",
    type: "quiz",
    title: "Quiz: Tiết kiệm nước",
    description: "10/10 câu đúng - Hoàn hảo!",
    coins_earned: 25,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export default function ParentHome() {
  const navigation = useNavigation();

  const handleSelectChild = (child) => {
    navigation.navigate("ParentChildDetail", { childId: child.id });
  };

  return (
    <View style={styles.screen}>
      <MobileHeader title="EcoVerse Parent" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Children Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Con của tôi</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("ParentChildren")}
              style={styles.viewAllButton}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllText}>Xem tất cả</Text>
              <ChevronRight size={16} color="#34A853" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardList}>
            {MOCK_CHILDREN.slice(0, 2).map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                onSelect={handleSelectChild}
              />
            ))}
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          </View>

          <View style={styles.activityList}>
            {MOCK_ACTIVITIES.slice(0, 5).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </View>
        </View>

        {/* Quick Tips */}
        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡 Mẹo hôm nay</Text>
          <Text style={styles.tipContent}>
            Khuyến khích con bạn chơi mỗi ngày để duy trì streak và nhận thêm xu
            thưởng!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#34A853",
  },
  cardList: {
    gap: 12,
  },
  activityList: {
    gap: 8,
  },
  tipBox: {
    backgroundColor: "rgba(52,168,83,0.1)",
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  tipContent: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
  },
});
