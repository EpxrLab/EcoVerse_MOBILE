import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Pressable,
} from "react-native";
import { MotiView } from "moti";
import {
  Flag,
  Calendar,
  Coins,
  CheckCircle2,
  XCircle,
  Clock,
  School,
  User,
  Gamepad2,
  Gift,
} from "lucide-react-native";
import { MobileHeader } from "../components/MobileHeader";

const { height } = Dimensions.get("window");

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_INVITATIONS = [
  {
    id: "1",
    campaign_name: "Tái chế Nhựa Tháng 3",
    child_name: "Nguyễn Minh Anh",
    class_name: "4A",
    school_name: "Tiểu học Lê Văn Tám",
    start_date: "2026-03-01",
    end_date: "2026-03-31",
    reward_coins: 200,
    campaign_description:
      "Chiến dịch giúp học sinh hiểu về tác hại của rác thải nhựa và cách phân loại, tái chế đúng cách để bảo vệ môi trường sống.",
    status: "pending",
  },
  {
    id: "2",
    campaign_name: "Chiến dịch Xanh Mùa Hè",
    child_name: "Nguyễn Gia Bảo",
    class_name: "2B",
    school_name: "Tiểu học Lê Văn Tám",
    start_date: "2026-06-01",
    end_date: "2026-06-30",
    reward_coins: 150,
    campaign_description:
      "Trồng cây xanh và bảo vệ nguồn nước sạch trong cộng đồng.",
    status: "pending",
  },
  {
    id: "3",
    campaign_name: "Tiết kiệm Năng lượng",
    child_name: "Nguyễn Minh Anh",
    class_name: "4A",
    school_name: "Tiểu học Lê Văn Tám",
    start_date: "2026-01-10",
    end_date: "2026-01-31",
    reward_coins: 180,
    campaign_description:
      "Học cách sử dụng điện và nước tiết kiệm, thông minh hơn.",
    status: "accepted",
  },
  {
    id: "4",
    campaign_name: "Không Túi Nilon",
    child_name: "Nguyễn Gia Bảo",
    class_name: "2B",
    school_name: "Tiểu học Lê Văn Tám",
    start_date: "2025-12-01",
    end_date: "2025-12-31",
    reward_coins: 120,
    campaign_description: "Thay thế túi nilon bằng túi vải tái sử dụng.",
    status: "rejected",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const formatDateShort = (dateStr) => {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const getStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return {
        bg: "#FFF7ED",
        text: "#EA580C",
        label: "Chờ xác nhận",
        Icon: Clock,
      };
    case "accepted":
      return {
        bg: "#F0FDF4",
        text: "#16A34A",
        label: "Đã đồng ý",
        Icon: CheckCircle2,
      };
    case "rejected":
      return {
        bg: "#FEF2F2",
        text: "#DC2626",
        label: "Đã từ chối",
        Icon: XCircle,
      };
    default:
      return { bg: "#F3F4F6", text: "#6B7280", label: status, Icon: Clock };
  }
};

// ─── Invitation Card ──────────────────────────────────────────────────────────
function InvitationCard({ invitation, onPress, onAccept, onReject }) {
  const s = getStatusStyle(invitation.status);
  const StatusIcon = s.Icon;

  return (
    <TouchableOpacity
      onPress={() => onPress(invitation)}
      activeOpacity={0.85}
      style={styles.card}
    >
      <View style={styles.cardRow}>
        {/* Icon box */}
        <View style={styles.flagBox}>
          <Flag size={22} color="#059669" />
        </View>

        <View style={styles.cardBody}>
          {/* Title + badge */}
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {invitation.campaign_name}
            </Text>
            <View style={[styles.badge, { backgroundColor: s.bg }]}>
              <StatusIcon size={11} color={s.text} />
              <Text style={[styles.badgeText, { color: s.text }]}>
                {s.label}
              </Text>
            </View>
          </View>

          {/* Meta */}
          <View style={styles.metaRow}>
            <User size={12} color="#9CA3AF" />
            <Text style={styles.metaText}>
              {invitation.child_name} - Lớp {invitation.class_name}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Calendar size={12} color="#9CA3AF" />
            <Text style={styles.metaText}>
              {formatDateShort(invitation.start_date)} -{" "}
              {formatDate(invitation.end_date)}
            </Text>
          </View>

          {/* Action buttons for pending */}
          {invitation.status === "pending" && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={(e) => {
                  e.stopPropagation?.();
                  onAccept(invitation);
                }}
                activeOpacity={0.8}
              >
                <CheckCircle2 size={13} color="#fff" />
                <Text style={styles.acceptBtnText}>Đồng ý</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={(e) => {
                  e.stopPropagation?.();
                  onReject(invitation);
                }}
                activeOpacity={0.8}
              >
                <XCircle size={13} color="#6B7280" />
                <Text style={styles.rejectBtnText}>Từ chối</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ invitation, visible, onClose, onAccept, onReject }) {
  if (!invitation) return null;
  const s = getStatusStyle(invitation.status);
  const StatusIcon = s.Icon;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose} />
      <View style={styles.modalSheet}>
        {/* Handle */}
        <View style={styles.sheetHandle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.flagBox}>
              <Flag size={22} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>{invitation.campaign_name}</Text>
              <Text style={styles.modalSub}>
                Lời mời tham gia cho {invitation.child_name}
              </Text>
            </View>
          </View>

          {/* Info rows */}
          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <School size={15} color="#9CA3AF" />
              <Text style={styles.infoText}>{invitation.school_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Calendar size={15} color="#9CA3AF" />
              <Text style={styles.infoText}>
                {formatDate(invitation.start_date)} -{" "}
                {formatDate(invitation.end_date)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Coins size={15} color="#D97706" />
              <Text
                style={[
                  styles.infoText,
                  { color: "#D97706", fontWeight: "700" },
                ]}
              >
                Phần thưởng: {invitation.reward_coins.toLocaleString("vi-VN")}{" "}
                xu
              </Text>
            </View>
          </View>

          {/* Description */}
          {invitation.campaign_description && (
            <View style={styles.descBox}>
              <Text style={styles.descText}>
                {invitation.campaign_description}
              </Text>
            </View>
          )}

          {/* Child card */}
          <View style={styles.childCard}>
            <View style={styles.childAvatar}>
              <User size={18} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.childName}>{invitation.child_name}</Text>
              <Text style={styles.childClass}>Lớp {invitation.class_name}</Text>
            </View>
          </View>

          {/* Benefits grid */}
          <Text style={styles.benefitsTitle}>Khi tham gia, con sẽ được:</Text>
          <View style={styles.benefitsGrid}>
            {[
              {
                icon: Gamepad2,
                color: "#059669",
                label: "Chơi game môi trường",
              },
              { icon: Coins, color: "#D97706", label: "Kiếm xu thưởng" },
              { icon: Gift, color: "#7C3AED", label: "Đổi quà hấp dẫn" },
              { icon: Flag, color: "#2563EB", label: "Bảo vệ môi trường" },
            ].map(({ icon: Icon, color, label }) => (
              <View key={label} style={styles.benefitChip}>
                <Icon size={15} color={color} />
                <Text style={styles.benefitText}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Footer actions */}
          <View style={styles.modalFooter}>
            {invitation.status === "pending" ? (
              <View style={styles.footerBtns}>
                <TouchableOpacity
                  style={styles.modalRejectBtn}
                  onPress={() => onReject(invitation)}
                  activeOpacity={0.8}
                >
                  <XCircle size={16} color="#6B7280" />
                  <Text style={styles.modalRejectText}>Từ chối</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalAcceptBtn}
                  onPress={() => onAccept(invitation)}
                  activeOpacity={0.8}
                >
                  <CheckCircle2 size={16} color="#fff" />
                  <Text style={styles.modalAcceptText}>Đồng ý tham gia</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.statusFull, { backgroundColor: s.bg }]}>
                <StatusIcon size={16} color={s.text} />
                <Text style={[styles.statusFullText, { color: s.text }]}>
                  {s.label}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function ParentCampaigns() {
  const [invitations, setInvitations] = useState(MOCK_INVITATIONS);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingList = invitations.filter((i) => i.status === "pending");
  const respondedList = invitations.filter((i) => i.status !== "pending");

  const handleAccept = (invitation) => {
    setInvitations((prev) =>
      prev.map((i) =>
        i.id === invitation.id ? { ...i, status: "accepted" } : i,
      ),
    );
    setIsModalOpen(false);
  };

  const handleReject = (invitation) => {
    setInvitations((prev) =>
      prev.map((i) =>
        i.id === invitation.id ? { ...i, status: "rejected" } : i,
      ),
    );
    setIsModalOpen(false);
  };

  const handleViewDetail = (invitation) => {
    setSelectedInvitation(invitation);
    setIsModalOpen(true);
  };

  const currentList = activeTab === "pending" ? pendingList : respondedList;

  return (
    <View style={styles.screen}>
      <MobileHeader title="Chiến dịch" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero banner */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 350 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroIcon}>
            <Flag size={24} color="#059669" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Lời mời chiến dịch</Text>
            <Text style={styles.heroDesc}>
              Xác nhận cho con tham gia các chiến dịch môi trường
            </Text>
          </View>
        </MotiView>

        {/* Tab bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "pending" && styles.tabActive]}
            onPress={() => setActiveTab("pending")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "pending" && styles.tabTextActive,
              ]}
            >
              Chờ xác nhận
            </Text>
            {pendingList.length > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{pendingList.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "responded" && styles.tabActive]}
            onPress={() => setActiveTab("responded")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "responded" && styles.tabTextActive,
              ]}
            >
              Đã phản hồi
            </Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <MotiView
          key={activeTab}
          from={{ opacity: 0, translateX: 10 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: "timing", duration: 260 }}
        >
          {currentList.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                {activeTab === "pending" ? (
                  <CheckCircle2 size={32} color="#10B981" />
                ) : (
                  <Clock size={32} color="#D1D5DB" />
                )}
              </View>
              <Text style={styles.emptyTitle}>
                {activeTab === "pending"
                  ? "Không có lời mời mới"
                  : "Chưa có phản hồi nào"}
              </Text>
              <Text style={styles.emptyDesc}>
                {activeTab === "pending"
                  ? "Bạn đã xác nhận tất cả lời mời chiến dịch"
                  : "Các lời mời đã phản hồi sẽ hiển thị ở đây"}
              </Text>
            </View>
          ) : (
            currentList.map((inv, idx) => (
              <MotiView
                key={inv.id}
                from={{ opacity: 0, translateY: 12 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 300, delay: idx * 60 }}
              >
                <InvitationCard
                  invitation={inv}
                  onPress={handleViewDetail}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              </MotiView>
            ))
          )}
        </MotiView>
      </ScrollView>

      {/* Detail modal */}
      <DetailModal
        invitation={selectedInvitation}
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAFB" },

  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
    gap: 12,
  },

  // Hero banner
  heroBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#A7F3D0",
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { fontSize: 15, fontWeight: "700", color: "#064E3B" },
  heroDesc: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  // Tab bar
  tabBar: {
    flexDirection: "row",
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
    paddingVertical: 10,
    borderRadius: 11,
    gap: 6,
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: "500", color: "#9CA3AF" },
  tabTextActive: { color: "#059669", fontWeight: "700" },
  tabBadge: {
    backgroundColor: "#F97316",
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardRow: { flexDirection: "row", gap: 12 },
  flagBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardBody: { flex: 1, gap: 5 },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#111827", flex: 1 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    flexShrink: 0,
  },
  badgeText: { fontSize: 10, fontWeight: "600" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 12, color: "#6B7280" },

  // Action buttons
  actionRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  acceptBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#059669",
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  acceptBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rejectBtnText: { fontSize: 13, fontWeight: "600", color: "#6B7280" },

  // Empty state
  emptyState: { alignItems: "center", paddingVertical: 56, gap: 10 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: "#374151" },
  emptyDesc: { fontSize: 13, color: "#9CA3AF", textAlign: "center" },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: height * 0.88,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 16,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 22,
  },
  modalSub: { fontSize: 12, color: "#6B7280", marginTop: 3 },

  infoBlock: { gap: 10, marginBottom: 16 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoText: { fontSize: 13, color: "#374151" },

  descBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  descText: { fontSize: 13, color: "#6B7280", lineHeight: 20 },

  childCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
  },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  childName: { fontSize: 14, fontWeight: "700", color: "#1E3A8A" },
  childClass: { fontSize: 12, color: "#3B82F6", marginTop: 2 },

  benefitsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 10,
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  benefitChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: "47%",
  },
  benefitText: { fontSize: 11, color: "#374151", flex: 1 },

  // Modal footer
  modalFooter: { paddingTop: 4 },
  footerBtns: { flexDirection: "row", gap: 10 },
  modalRejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  modalRejectText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  modalAcceptBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#059669",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalAcceptText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  statusFull: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  statusFullText: { fontSize: 14, fontWeight: "700" },
});
