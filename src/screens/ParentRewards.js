import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
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
  Coins,
  Filter,
} from "lucide-react-native";
import { MobileHeader } from "../components/MobileHeader";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  cancelRequest,
  confirmRequest,
  getMyRequests,
  getParentChildren,
} from "../services";
import Toast from "react-native-toast-message";

// ─── Status config ────────────────────────────────────────────────────────────
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

// Only 3 statuses shown in filter per requirement
const FILTER_STATUSES = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Đang chờ xử lý" },
  { value: "DELIVERED", label: "Đã giao (chờ xác nhận)" },
  { value: "CONFIRMED", label: "Đã nhận quà" },
];

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_STUDENTS = [
  {
    studentId: "s1",
    studentFullName: "Nguyễn Minh Anh",
    studentCode: "HS2024001",
    className: "4A",
    gender: "FEMALE",
    dob: "15/03/2015",
    accountStatus: "ACTIVE",
  },
  {
    studentId: "s2",
    studentFullName: "Nguyễn Gia Bảo",
    studentCode: "HS2024002",
    className: "2B",
    gender: "MALE",
    dob: "22/07/2017",
    accountStatus: "ACTIVE",
  },
];

const MOCK_HISTORY = [
  {
    id: "h1",
    requestCode: "REQ-2026-001",
    rewardName: "Bút chì HB",
    rewardImageUrl: null,
    studentName: "Nguyễn Minh Anh",
    studentCode: "HS2024001",
    totalCoins: 10,
    quantity: 2,
    status: "PENDING",
    createdAt: "2026-03-20T10:00:00",
  },
  {
    id: "h2",
    requestCode: "REQ-2026-002",
    rewardName: "Voucher Tiki 50k",
    rewardImageUrl: null,
    studentName: "Nguyễn Gia Bảo",
    studentCode: "HS2024002",
    totalCoins: 180,
    quantity: 1,
    status: "DELIVERED",
    createdAt: "2026-03-18T09:30:00",
  },
  {
    id: "h3",
    requestCode: "REQ-2026-003",
    rewardName: "Bộ màu nước sinh thái",
    rewardImageUrl: null,
    studentName: "Nguyễn Minh Anh",
    studentCode: "HS2024001",
    totalCoins: 150,
    quantity: 1,
    status: "CONFIRMED",
    createdAt: "2026-03-10T14:00:00",
  },
  {
    id: "h4",
    requestCode: "REQ-2026-004",
    rewardName: "Vé xem phim CGV",
    rewardImageUrl: null,
    studentName: "Nguyễn Gia Bảo",
    studentCode: "HS2024002",
    totalCoins: 200,
    quantity: 1,
    status: "PENDING",
    createdAt: "2026-03-25T08:00:00",
  },
  {
    id: "h5",
    requestCode: "REQ-2026-005",
    rewardName: "Hộp bút màu 24 cây",
    rewardImageUrl: null,
    studentName: "Nguyễn Minh Anh",
    studentCode: "HS2024001",
    totalCoins: 80,
    quantity: 1,
    status: "REJECTED",
    createdAt: "2026-03-05T11:00:00",
  },
];

// ─── Reward History Card ──────────────────────────────────────────────────────
function RewardHistoryCard({ item, onCancel, onConfirm }) {
  const status = STATUS_MAP[item.status] || STATUS_MAP.PENDING;
  const StatusIcon = status.icon;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 280 }}
      style={styles.historyCard}
    >
      {/* Header: code + date + status badge */}
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

      {/* Body: image + info */}
      <View style={styles.historyBody}>
        {item.rewardImageUrl ? (
          <Image
            source={{ uri: item.rewardImageUrl }}
            style={styles.rewardImg}
          />
        ) : (
          <View style={[styles.rewardImg, styles.rewardImgPlaceholder]}>
            <Gift size={24} color="#D1D5DB" />
          </View>
        )}
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

      {/* Action buttons */}
      {(item.status === "PENDING" || item.status === "DELIVERED") && (
        <View style={styles.actionRow}>
          {item.status === "PENDING" && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.cancelBtn]}
              onPress={() => onCancel(item.id)}
              activeOpacity={0.8}
            >
              <XCircle size={14} color="#EF4444" />
              <Text style={styles.cancelBtnText}>Hủy yêu cầu</Text>
            </TouchableOpacity>
          )}
          {item.status === "DELIVERED" && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.confirmBtn]}
              onPress={() => onConfirm(item.id)}
              activeOpacity={0.8}
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

// ─── Child Info Card ──────────────────────────────────────────────────────────
function ChildInfoCard({ student }) {
  const navigation = useNavigation();
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
            <Text style={styles.dividerChar}>|</Text>
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

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ParentRewards() {
  const [activeTab, setActiveTab] = useState("redeem");
  const [students, setStudents] = useState([]);
  const [history, setHistory] = useState([]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const filterItems = FILTER_STATUSES;

  const fetchData = async () => {
    try {
      const res = await getParentChildren();
      const res1 = await getMyRequests();
      setStudents(res.data);
      setHistory(res1.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = async (reward) => {
    try {
      const res = await cancelRequest(reward.id);

      if (res) {
        Toast.show({
          type: "success",
          text1: "Hủy yêu cầu đổi quà thành công!",
          text2: `Bạn đã hủy yêu cầu đổi món quà: ${reward.rewardName}`,
        });
        fetchData();
      } else {
        Toast.show({
          type: "error",
          text1: "Hủy yêu cầu đổi quà thất bại!",
          text2: `Thao tác hủy yêu cầu chưa được ghi nhận.`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirm = async (reward) => {
    try {
      const res = await confirmRequest(reward.id);

      if (res) {
        Toast.show({
          type: "success",
          text1: "Xác nhận đã nhận quà thành công!",
          text2: `Bạn đã xác nhận đổi thành công món quà: ${reward.rewardName}`,
        });
        fetchData();
      } else {
        Toast.show({
          type: "error",
          text1: "Xác nhận đã nhận quà thất bại!",
          text2: `Thao tác xác nhận đã nhận quà của bạn chưa được ghi nhận.`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Apply filter
  const filteredHistory =
    filterStatus === "ALL"
      ? history
      : history.filter((r) => r.status === filterStatus);

  // Count badge for filter
  const pendingCount = history.filter(
    (r) => r.status === "PENDING" || r.status === "DELIVERED",
  ).length;

  return (
    <View style={styles.screen}>
      <MobileHeader title="Quản lý con & Quà tặng" />

      {/* ── Tab Bar ── */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "redeem" && styles.tabActive]}
          onPress={() => setActiveTab("redeem")}
          activeOpacity={0.8}
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
          activeOpacity={0.8}
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
          {pendingCount > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{pendingCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── History filter dropdown (only on history tab) ── */}
      {activeTab === "history" && (
        <MotiView
          from={{ opacity: 0, translateY: -6 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 220 }}
          style={styles.filterWrapper}
        >
          <View style={styles.filterLabelRow}>
            <Filter size={13} color="#6B7280" />
            <Text style={styles.filterLabel}>Lọc theo trạng thái</Text>
            {filterStatus !== "ALL" && (
              <View
                style={[
                  styles.activeFilterDot,
                  {
                    backgroundColor:
                      STATUS_MAP[filterStatus]?.color || "#059669",
                  },
                ]}
              />
            )}
          </View>

          <DropDownPicker
            open={filterOpen}
            value={filterStatus}
            items={filterItems}
            setOpen={setFilterOpen}
            setValue={setFilterStatus}
            style={styles.picker}
            dropDownContainerStyle={styles.pickerDropdown}
            textStyle={styles.pickerText}
            selectedItemLabelStyle={{ fontWeight: "700", color: "#059669" }}
            ArrowUpIconComponent={() => (
              <Text style={styles.pickerArrow}>▲</Text>
            )}
            ArrowDownIconComponent={() => (
              <Text style={styles.pickerArrow}>▼</Text>
            )}
            zIndex={1000}
            zIndexInverse={500}
          />

          {/* Result count */}
          <Text style={styles.filterCount}>
            {filteredHistory.length} kết quả
          </Text>
        </MotiView>
      )}

      {/* ── Content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          activeTab === "history" && filterOpen && { paddingTop: 160 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "redeem" ? (
          students.map((item) => (
            <ChildInfoCard key={item.studentId} student={item} />
          ))
        ) : filteredHistory.length > 0 ? (
          filteredHistory.map((item, idx) => (
            <MotiView
              key={item.id}
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 260, delay: idx * 50 }}
            >
              <RewardHistoryCard
                item={item}
                onCancel={() => handleCancel(item)}
                onConfirm={() => handleConfirm(item)}
              />
            </MotiView>
          ))
        ) : (
          <View style={styles.emptyState}>
            <History size={40} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>
              {filterStatus === "ALL"
                ? "Chưa có lịch sử đổi quà"
                : `Không có yêu cầu "${FILTER_STATUSES.find((f) => f.value === filterStatus)?.label}"`}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAFB" },

  // Tab bar
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
  tabActive: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tabText: { fontSize: 13, fontWeight: "500", color: "#9CA3AF" },
  tabTextActive: { color: "#059669", fontWeight: "700" },
  tabBadge: {
    backgroundColor: "#F97316",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  tabBadgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },

  // Filter section
  filterWrapper: {
    marginHorizontal: 16,
    marginTop: 12,
    zIndex: 1000,
  },
  filterLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  filterLabel: { fontSize: 12, fontWeight: "600", color: "#6B7280", flex: 1 },
  activeFilterDot: { width: 8, height: 8, borderRadius: 4 },
  filterCount: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 6,
    textAlign: "right",
  },

  picker: {
    borderRadius: 12,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    minHeight: 46,
  },
  pickerDropdown: {
    borderRadius: 12,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  pickerText: { fontSize: 13, color: "#111827" },
  pickerArrow: { fontSize: 9, color: "#9CA3AF" },

  // Scroll
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
    gap: 12,
  },

  // Redeem card
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
  dividerChar: { color: "#E5E7EB", marginHorizontal: 2 },
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

  // History card
  historyCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  historyCodeBox: {},
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
  rewardImgPlaceholder: { alignItems: "center", justifyContent: "center" },
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

  // Empty
  emptyState: { alignItems: "center", marginTop: 80, gap: 10 },
  emptyTitle: { color: "#9CA3AF", fontWeight: "600", textAlign: "center" },
});
