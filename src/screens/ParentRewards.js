import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { MotiView } from "moti";
import {
  Gift,
  History,
  CheckCircle,
  Clock,
  User,
  GraduationCap,
  Fingerprint,
  XCircle,
  Package,
  Calendar,
  Coins,
  ChevronRight,
} from "lucide-react-native";
import { MobileHeader } from "../components/MobileHeader";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMyRequests, getParentChildren } from "../services";

const STATUS_MAP = {
  PENDING: { label: "Đang chờ", color: "#F59E0B", bg: "#FEF3C7", icon: Clock },
  APPROVED: {
    label: "Đã duyệt",
    color: "#10B981",
    bg: "#D1FAE5",
    icon: CheckCircle,
  },
  DELIVERED: {
    label: "Đã giao",
    color: "#3B82F6",
    bg: "#DBEAFE",
    icon: Package,
  },
  CONFIRMED: {
    label: "Hoàn tất",
    color: "#059669",
    bg: "#ECFDF5",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Từ chối",
    color: "#EF4444",
    bg: "#FEE2E2",
    icon: XCircle,
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "#6B7280",
    bg: "#F3F4F6",
    icon: XCircle,
  },
};

function RewardHistoryCard({ item, onCancel, onConfirm }) {
  const status = STATUS_MAP[item.status] || STATUS_MAP.PENDING;
  const StatusIcon = status.icon;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      style={styles.historyCard}
    >
      <View style={styles.historyHeader}>
        <View style={styles.historyCodeBox}>
          <Text style={styles.historyCode}>{item.requestCode}</Text>
          <Text style={styles.historyDate}>
            {new Date(item.createdAt).toLocaleDateString("vi-VN")}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <StatusIcon size={12} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <View style={styles.historyBody}>
        <Image
          source={{
            uri: item.rewardImageUrl || "https://via.placeholder.com/100",
          }}
          style={styles.rewardImg}
        />
        <View style={styles.rewardMainInfo}>
          <Text style={styles.rewardName} numberOfLines={1}>
            {item.rewardName}
          </Text>
          <View style={styles.studentInfoRow}>
            <User size={12} color="#9CA3AF" />
            <Text style={styles.studentNameText}>
              {item.studentName} ({item.studentCode})
            </Text>
          </View>
          <View style={styles.coinInfoRow}>
            <Coins size={14} color="#D97706" />
            <Text style={styles.coinText}>{item.totalCoins} xu</Text>
            <Text style={styles.quantityText}>x{item.quantity}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      {(item.status === "PENDING" || item.status === "DELIVERED") && (
        <View style={styles.actionRow}>
          {item.status === "PENDING" && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.cancelBtn]}
              onPress={() => onCancel(item.id)}
            >
              <XCircle size={14} color="#EF4444" />
              <Text style={styles.cancelBtnText}>Hủy yêu cầu</Text>
            </TouchableOpacity>
          )}
          {item.status === "DELIVERED" && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.confirmBtn]}
              onPress={() => onConfirm(item.id)}
            >
              <CheckCircle size={14} color="#FFFFFF" />
              <Text style={styles.confirmBtnText}>Đã nhận quà</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </MotiView>
  );
}

// ─── Child Info Card (Updated to Match Your Data) ─────────────────────────────
function ChildInfoCard({ student }) {
  const navigation = useNavigation();

  // Logic hiển thị giới tính
  const isMale = student.gender === "MALE";

  const handleNavigate = async () => {
    navigation.navigate("ParentAllRewards");
    await AsyncStorage.setItem("studentId", student.studentId);
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "timing", duration: 400 }}
      style={styles.redeemCard}
    >
      <View style={styles.redeemTop}>
        <View
          style={[
            styles.avatarCircle,
            { backgroundColor: isMale ? "#DBEAFE" : "#FCE7F3" },
          ]}
        >
          <Text
            style={[
              styles.avatarInitial,
              { color: isMale ? "#2563EB" : "#DB2777" },
            ]}
          >
            {student.studentFullName.charAt(0)}
          </Text>
        </View>

        <View style={styles.redeemInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.redeemName}>{student.studentFullName}</Text>
            <View
              style={[
                styles.statusTag,
                {
                  backgroundColor:
                    student.accountStatus === "ACTIVE" ? "#DCFCE7" : "#FEE2E2",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusTagText,
                  {
                    color:
                      student.accountStatus === "ACTIVE"
                        ? "#16A34A"
                        : "#EF4444",
                  },
                ]}
              >
                ● {student.accountStatus}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Fingerprint size={12} color="#6B7280" />
            <Text style={styles.infoText}>{student.studentCode}</Text>
            <Text style={styles.divider}>|</Text>
            <GraduationCap size={12} color="#6B7280" />
            <Text style={styles.infoText}>Lớp {student.className}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.redeemBtn}
          activeOpacity={0.8}
          onPress={handleNavigate}
        >
          <Gift size={14} color="#FFFFFF" />
          <Text style={styles.redeemBtnText}>Đổi quà</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.redeemStats}>
        <View style={styles.statChip}>
          <User size={13} color="#6B7280" />
          <Text style={styles.statChipText}>
            Giới tính: {isMale ? "Nam" : "Nữ"}
          </Text>
        </View>
        <View style={styles.statChip}>
          <Clock size={13} color="#6B7280" />
          <Text style={styles.statChipText}>Sinh: {student.dob}</Text>
        </View>
      </View>
    </MotiView>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function ParentRewards() {
  const [activeTab, setActiveTab] = useState("redeem");
  const [students, setStudents] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchData = async () => {
    try {
      const res = await getParentChildren();
      setStudents(res.data);
      const res1 = await getMyRequests();
      setHistory(res1.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.screen}>
      <MobileHeader title="Quản lý con & Quà tặng" />

      {/* Tab Bar Giữ nguyên logic của bạn */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "redeem" && styles.tabActive]}
          onPress={() => setActiveTab("redeem")}
        >
          <Gift
            size={15}
            color={activeTab === "redeem" ? "#059669" : "#9CA3AF"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "redeem" && styles.tabTextActive,
            ]}
          >
            Học sinh
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.tabActive]}
          onPress={() => setActiveTab("history")}
        >
          <History
            size={15}
            color={activeTab === "history" ? "#059669" : "#9CA3AF"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.tabTextActive,
            ]}
          >
            Lịch sử
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {activeTab === "redeem" ? (
          students?.map((item) => (
            <ChildInfoCard key={item.studentId} student={item} />
          ))
        ) : history?.length > 0 ? (
          history?.map((item) => (
            <RewardHistoryCard key={item.id} item={item} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <History size={40} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Chưa có lịch sử đổi quà</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAFB" },
  tabBar: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 11,
  },
  tabActive: { backgroundColor: "#FFFFFF", elevation: 2 },
  tabText: { fontSize: 13, fontWeight: "500", color: "#9CA3AF" },
  tabTextActive: { color: "#059669", fontWeight: "700" },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
    gap: 12,
  },

  // Card Styles
  redeemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  redeemTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { fontSize: 22, fontWeight: "800" },
  redeemInfo: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  redeemName: { fontSize: 16, fontWeight: "700", color: "#111827" },
  statusTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  statusTagText: { fontSize: 9, fontWeight: "700" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  infoText: { fontSize: 12, color: "#6B7280", fontWeight: "500" },
  divider: { color: "#E5E7EB", marginHorizontal: 2 },
  redeemBtn: {
    backgroundColor: "#059669",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  redeemBtnText: { fontSize: 12, fontWeight: "700", color: "#FFFFFF" },

  redeemStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F9FAFB",
  },
  statChip: { flexDirection: "row", alignItems: "center", gap: 6 },
  statChipText: { fontSize: 12, color: "#4B5563" },
  emptyState: { alignItems: "center", marginTop: 100, gap: 10 },
  emptyTitle: { color: "#9CA3AF", fontWeight: "600" },

  historyCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  historyCode: { fontSize: 12, fontWeight: "700", color: "#374151" },
  historyDate: { fontSize: 10, color: "#9CA3AF", marginTop: 2 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 10, fontWeight: "700" },

  historyBody: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 12,
  },
  rewardImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  rewardMainInfo: { flex: 1, justifyContent: "center", gap: 4 },
  rewardName: { fontSize: 14, fontWeight: "700", color: "#111827" },
  studentInfoRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  studentNameText: { fontSize: 11, color: "#6B7280" },
  coinInfoRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  coinText: { fontSize: 13, fontWeight: "800", color: "#D97706" },
  quantityText: { fontSize: 11, color: "#9CA3AF", marginLeft: 4 },

  actionRow: { flexDirection: "row", marginTop: 12, gap: 8 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelBtn: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  cancelBtnText: { color: "#EF4444", fontSize: 12, fontWeight: "700" },
  confirmBtn: { backgroundColor: "#059669" },
  confirmBtnText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
});
