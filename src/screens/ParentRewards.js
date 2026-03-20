import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { MotiView } from "moti";
import {
  Coins,
  Gift,
  TrendingUp,
  Truck,
  MapPin,
  CheckCircle,
  Clock,
} from "lucide-react-native";
import { MobileHeader } from "../components/MobileHeader";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_CHILDREN = [
  {
    id: "1",
    name: "Nguyễn Minh Anh",
    avatar_url: null,
    coins: 320,
    level: 5,
    accuracy: 87,
  },
  {
    id: "2",
    name: "Nguyễn Gia Bảo",
    avatar_url: null,
    coins: 150,
    level: 3,
    accuracy: 74,
  },
];

const INITIAL_TRACKING = [
  {
    id: "PR-1",
    childName: "Bé An",
    name: "Vé xem phim CGV",
    campaign: "Tái chế Nhựa",
    status: "shipping",
    date: "25/01/2026",
    image: "🎬",
  },
  {
    id: "PR-2",
    childName: "Bé Chi",
    name: "Voucher Tiki 50k",
    campaign: "Chiến dịch Xanh",
    status: "collected",
    date: "20/01/2026",
    image: "🎫",
  },
  {
    id: "PR-3",
    childName: "Bé An",
    name: "Bút màu sinh thái",
    campaign: "Tiết kiệm nước",
    status: "parent_confirmed",
    date: "10/01/2026",
    image: "🖊️",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getStatusInfo = (status) => {
  switch (status) {
    case "shipping":
      return {
        label: "Đang vận chuyển",
        bg: "#FFF7ED",
        text: "#EA580C",
        icon: Truck,
      };
    case "at_school":
      return {
        label: "Đã về trường",
        bg: "#EFF6FF",
        text: "#2563EB",
        icon: MapPin,
      };
    case "collected":
      return {
        label: "Con đã nhận",
        bg: "#F0FDF4",
        text: "#16A34A",
        icon: Gift,
      };
    case "parent_confirmed":
      return {
        label: "Đã xác nhận",
        bg: "#F3F4F6",
        text: "#6B7280",
        icon: CheckCircle,
      };
    default:
      return { label: status, bg: "#F3F4F6", text: "#6B7280", icon: Gift };
  }
};

// ─── Child Redeem Card ────────────────────────────────────────────────────────
function ChildRedeemCard({ child }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 320 }}
      style={styles.redeemCard}
    >
      {/* Avatar + Info */}
      <View style={styles.redeemTop}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>{child.name.charAt(0)}</Text>
        </View>
        <View style={styles.redeemInfo}>
          <Text style={styles.redeemName}>{child.name}</Text>
          <View style={styles.coinBadge}>
            <Coins size={13} color="#D97706" />
            <Text style={styles.coinText}>{child.coins} xu</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.redeemBtn} activeOpacity={0.8}>
          <Gift size={14} color="#FFFFFF" />
          <Text style={styles.redeemBtnText}>Đổi quà</Text>
        </TouchableOpacity>
      </View>

      {/* Mini stats */}
      <View style={styles.redeemStats}>
        <View style={styles.statChip}>
          <TrendingUp size={13} color="#10B981" />
          <Text style={styles.statChipText}>Level {child.level}</Text>
        </View>
        <View style={styles.statChip}>
          <CheckCircle size={13} color="#3B82F6" />
          <Text style={styles.statChipText}>{child.accuracy}% Chính xác</Text>
        </View>
      </View>
    </MotiView>
  );
}

// ─── Tracking Card ────────────────────────────────────────────────────────────
function TrackingCard({ reward, onConfirm }) {
  const statusInfo = getStatusInfo(reward.status);
  const StatusIcon = statusInfo.icon;

  return (
    <MotiView
      from={{ opacity: 0, translateX: -10 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 300 }}
      style={styles.trackCard}
    >
      {/* Emoji image */}
      <View style={styles.trackEmoji}>
        <Text style={{ fontSize: 24 }}>{reward.image}</Text>
      </View>

      <View style={styles.trackBody}>
        {/* Child + campaign */}
        <View style={styles.trackMeta}>
          <View style={styles.childTag}>
            <Text style={styles.childTagText}>{reward.childName}</Text>
          </View>
          <Text style={styles.trackCampaign}> · {reward.campaign}</Text>
        </View>

        {/* Name + status badge */}
        <View style={styles.trackRow}>
          <Text style={styles.trackName} numberOfLines={1}>
            {reward.name}
          </Text>
          <View
            style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}
          >
            <StatusIcon size={11} color={statusInfo.text} />
            <Text style={[styles.statusText, { color: statusInfo.text }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        {/* Date + action */}
        <View style={styles.trackFooter}>
          <View style={styles.dateRow}>
            <Clock size={11} color="#9CA3AF" />
            <Text style={styles.dateText}>{reward.date}</Text>
          </View>

          {reward.status === "collected" && (
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => onConfirm(reward.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmBtnText}>Xác nhận nhận</Text>
            </TouchableOpacity>
          )}
          {reward.status === "parent_confirmed" && (
            <View style={styles.confirmedRow}>
              <CheckCircle size={12} color="#10B981" />
              <Text style={styles.confirmedText}>Đã xác nhận</Text>
            </View>
          )}
        </View>
      </View>
    </MotiView>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function ParentRewards() {
  const [activeTab, setActiveTab] = useState("redeem");
  const [trackingRewards, setTrackingRewards] = useState(INITIAL_TRACKING);

  const pendingCount = trackingRewards.filter(
    (r) => r.status !== "parent_confirmed",
  ).length;

  const handleConfirmReceipt = (id) => {
    setTrackingRewards((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "parent_confirmed" } : r)),
    );
  };

  return (
    <View style={styles.screen}>
      <MobileHeader title="Đổi quà & Tracking" />

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
            Đổi quà
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "tracking" && styles.tabActive]}
          onPress={() => setActiveTab("tracking")}
          activeOpacity={0.8}
        >
          <Truck
            size={15}
            color={activeTab === "tracking" ? "#059669" : "#9CA3AF"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "tracking" && styles.tabTextActive,
            ]}
          >
            Theo dõi
          </Text>
          {pendingCount > 0 && (
            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
              style={styles.tabBadge}
            >
              <Text style={styles.tabBadgeText}>{pendingCount}</Text>
            </MotiView>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "redeem" && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 250 }}
          >
            {MOCK_CHILDREN.map((child) => (
              <ChildRedeemCard key={child.id} child={child} />
            ))}
          </MotiView>
        )}

        {activeTab === "tracking" && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 250 }}
          >
            {trackingRewards.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Gift size={32} color="#D1D5DB" />
                </View>
                <Text style={styles.emptyTitle}>Chưa có quà tặng nào</Text>
                <Text style={styles.emptyDesc}>
                  Hãy đổi quà cho các bé ngay nhé!
                </Text>
              </View>
            ) : (
              trackingRewards.map((reward) => (
                <TrackingCard
                  key={reward.id}
                  reward={reward}
                  onConfirm={handleConfirmReceipt}
                />
              ))
            )}
          </MotiView>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  // Tab bar
  tabBar: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  tabTextActive: {
    color: "#059669",
    fontWeight: "700",
  },
  tabBadge: {
    backgroundColor: "#F97316",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },

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
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  redeemTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#A7F3D0",
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: "800",
    color: "#059669",
  },
  redeemInfo: {
    flex: 1,
    gap: 5,
  },
  redeemName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  coinBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  coinText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D97706",
  },
  redeemBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#059669",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  redeemBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  redeemStats: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statChipText: {
    fontSize: 11,
    color: "#6B7280",
  },

  // Tracking card
  trackCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  trackEmoji: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    flexShrink: 0,
  },
  trackBody: {
    flex: 1,
    gap: 4,
  },
  trackMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  childTag: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  childTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2563EB",
  },
  trackCampaign: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  trackName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexShrink: 0,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  trackFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  confirmBtn: {
    backgroundColor: "#059669",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  confirmedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  confirmedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },
  emptyDesc: {
    fontSize: 13,
    color: "#9CA3AF",
  },
});
