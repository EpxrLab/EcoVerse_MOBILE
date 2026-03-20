import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView } from "moti";
import {
  ArrowLeft,
  Coins,
  Target,
  Flame,
  Trophy,
  Medal,
  Gift,
  CheckCircle,
  Truck,
  MapPin,
  Clock,
  ShoppingBag,
} from "lucide-react-native";
import { ActivityItem } from "../components/ActivityItem";
import { RedeemRewardModal } from "../components/RedeemRewardModal";

const { width } = Dimensions.get("window");

// ─── Mock Data ───────────────────────────────────────────────────────────────
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

const MOCK_STATS = { weekly_coins: 45, class_rank: 3 };

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

const INITIAL_REWARDS = [
  {
    id: "PR-1",
    name: "Vé xem phim CGV",
    campaign: "Tái chế Nhựa",
    status: "shipping",
    date: "25/01/2026",
    image: "🎬",
  },
  {
    id: "PR-2",
    name: "Voucher Tiki 50k",
    campaign: "Chiến dịch Xanh",
    status: "collected",
    date: "20/01/2026",
    image: "🎫",
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
        Icon: Truck,
      };
    case "at_school":
      return {
        label: "Đã về trường",
        bg: "#EFF6FF",
        text: "#2563EB",
        Icon: MapPin,
      };
    case "collected":
      return {
        label: "Con đã nhận",
        bg: "#F0FDF4",
        text: "#16A34A",
        Icon: Gift,
      };
    case "parent_confirmed":
      return {
        label: "Đã xác nhận",
        bg: "#F3F4F6",
        text: "#6B7280",
        Icon: CheckCircle,
      };
    default:
      return { label: status, bg: "#F3F4F6", text: "#6B7280", Icon: Gift };
  }
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  iconColor,
  label,
  value,
  sub,
  progress,
  delay,
}) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 14, delay }}
      style={styles.statCard}
    >
      <View style={styles.statHeader}>
        <Icon size={18} color={iconColor} />
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {sub && <Text style={styles.statSub}>{sub}</Text>}
      {progress !== undefined && (
        <View style={styles.progressTrack}>
          <MotiView
            from={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "timing", duration: 800, delay: delay + 200 }}
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
      )}
    </MotiView>
  );
}

// ─── Reward Row ───────────────────────────────────────────────────────────────
function RewardRow({ reward, onConfirm }) {
  const { label, bg, text, Icon: StatusIcon } = getStatusInfo(reward.status);
  return (
    <View style={styles.rewardCard}>
      <View style={styles.rewardEmoji}>
        <Text style={{ fontSize: 22 }}>{reward.image}</Text>
      </View>
      <View style={styles.rewardBody}>
        <View style={styles.rewardTopRow}>
          <View>
            <View style={styles.campaignTag}>
              <Text style={styles.campaignTagText}>{reward.campaign}</Text>
            </View>
            <Text style={styles.rewardName}>{reward.name}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: bg }]}>
            <StatusIcon size={11} color={text} />
            <Text style={[styles.statusText, { color: text }]}>{label}</Text>
          </View>
        </View>
        <View style={styles.rewardFooter}>
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
              <Text style={styles.confirmBtnText}>Xác nhận con đã nhận</Text>
            </TouchableOpacity>
          )}
          {reward.status === "parent_confirmed" && (
            <View style={styles.confirmedRow}>
              <CheckCircle size={12} color="#10B981" />
              <Text style={styles.confirmedText}>Phụ huynh đã xác nhận</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ParentChildDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { childId } = route.params || {};
  const child = MOCK_CHILDREN.find((c) => c.id === childId) || MOCK_CHILDREN[0];

  const [currentCoins, setCurrentCoins] = useState(child.coins);
  const [rewards, setRewards] = useState(INITIAL_REWARDS);
  const [redeemModalVisible, setRedeemModalVisible] = useState(false);

  const handleConfirm = (id) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "parent_confirmed" } : r)),
    );
  };

  const handleRedeem = (reward) => {
    setCurrentCoins((prev) => prev - reward.coins);
    const newReward = {
      id: `PR-${Date.now()}`,
      name: reward.name,
      campaign: "Đổi quà",
      status: "shipping",
      date: new Date().toLocaleDateString("vi-VN"),
      image: reward.image,
    };
    setRewards((prev) => [newReward, ...prev]);
  };

  return (
    <View style={styles.screen}>
      {/* ── Green hero header ── */}
      <View style={[styles.heroHeader, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="rgba(255,255,255,0.85)" />
          <Text style={styles.backText}>Quay lại</Text>
        </TouchableOpacity>

        <View style={styles.heroContent}>
          <View style={styles.heroAvatar}>
            <Text style={styles.heroAvatarInitial}>{child.name.charAt(0)}</Text>
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{child.name}</Text>
            <Text style={styles.heroMeta}>
              {child.class_name} · {child.school_name}
            </Text>
            <View style={styles.levelBadge}>
              <Trophy size={11} color="#FFFFFF" />
              <Text style={styles.levelText}>Level {child.level}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Stats grid ── */}
        <View style={styles.statsGrid}>
          <StatCard
            icon={Coins}
            iconColor="#F59E0B"
            label="Tổng xu"
            value={currentCoins}
            sub={`+${MOCK_STATS.weekly_coins} tuần này`}
            delay={0}
          />
          <StatCard
            icon={Target}
            iconColor="#059669"
            label="Chính xác"
            value={`${child.accuracy}%`}
            progress={child.accuracy}
            delay={80}
          />
          <StatCard
            icon={Flame}
            iconColor="#F97316"
            label="Streak"
            value={`${child.streak_days} ngày`}
            sub="Chuỗi ngày liên tục"
            delay={160}
          />
          <StatCard
            icon={Medal}
            iconColor="#3B82F6"
            label="Xếp hạng"
            value={`#${MOCK_STATS.class_rank}`}
            sub="Trong lớp"
            delay={240}
          />
        </View>

        {/* ── Reward tracking ── */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 350, delay: 300 }}
        >
          {/* Section header with "Đổi quà cho con" button */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Gift size={18} color="#DC2626" />
              <Text style={styles.sectionTitle}>Theo dõi quà tặng</Text>
            </View>
            <TouchableOpacity
              style={styles.redeemTriggerBtn}
              onPress={() => setRedeemModalVisible(true)}
              activeOpacity={0.8}
            >
              <ShoppingBag size={13} color="#FFFFFF" />
              <Text style={styles.redeemTriggerText}>Đổi quà cho con</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rewardList}>
            {rewards.map((r) => (
              <RewardRow key={r.id} reward={r} onConfirm={handleConfirm} />
            ))}
          </View>
        </MotiView>

        {/* ── Recent activities ── */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 350, delay: 400 }}
        >
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
            Hoạt động gần đây
          </Text>
          {MOCK_ACTIVITIES.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có hoạt động nào</Text>
          ) : (
            MOCK_ACTIVITIES.slice(0, 10).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          )}
        </MotiView>
      </ScrollView>

      {/* ── Redeem modal ── */}
      <RedeemRewardModal
        visible={redeemModalVisible}
        onClose={() => setRedeemModalVisible(false)}
        currentCoins={currentCoins}
        childName={child.name}
        onRedeem={handleRedeem}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAFB" },

  heroHeader: {
    backgroundColor: "#059669",
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  backText: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  heroContent: { flexDirection: "row", alignItems: "center", gap: 16 },
  heroAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroAvatarInitial: { fontSize: 28, fontWeight: "800", color: "#FFFFFF" },
  heroInfo: { flex: 1, gap: 4 },
  heroName: { fontSize: 20, fontWeight: "800", color: "#FFFFFF" },
  heroMeta: { fontSize: 13, color: "rgba(255,255,255,0.75)" },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  levelText: { fontSize: 12, fontWeight: "700", color: "#FFFFFF" },

  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 24,
  },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: {
    width: (width - 42) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 4,
  },
  statHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  statLabel: { fontSize: 12, color: "#9CA3AF" },
  statValue: { fontSize: 22, fontWeight: "800", color: "#111827" },
  statSub: { fontSize: 11, color: "#10B981" },
  progressTrack: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    marginTop: 6,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#059669", borderRadius: 3 },

  // Section header — now a row with title + button
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },

  // "Đổi quà cho con" trigger button
  redeemTriggerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#059669",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 4,
  },
  redeemTriggerText: { fontSize: 12, fontWeight: "700", color: "#FFFFFF" },

  rewardList: { gap: 10 },
  rewardCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  rewardEmoji: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    flexShrink: 0,
  },
  rewardBody: { flex: 1, gap: 6 },
  rewardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  campaignTag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 3,
    alignSelf: "flex-start",
  },
  campaignTagText: { fontSize: 10, color: "#6B7280" },
  rewardName: { fontSize: 13, fontWeight: "700", color: "#111827" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    flexShrink: 0,
  },
  statusText: { fontSize: 10, fontWeight: "600" },
  rewardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { fontSize: 11, color: "#9CA3AF" },
  confirmBtn: {
    backgroundColor: "#059669",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmBtnText: { fontSize: 11, fontWeight: "700", color: "#FFFFFF" },
  confirmedRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  confirmedText: { fontSize: 11, fontWeight: "600", color: "#10B981" },

  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 13,
    paddingVertical: 24,
  },
});
