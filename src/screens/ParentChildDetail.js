import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FadeInView } from "../components/FadeInView";
import { Animated } from "react-native";
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
  XCircle,
} from "lucide-react-native";
import { ActivityItem } from "../components/ActivityItem";
import {
  confirmRequest,
  getMyRequests,
  getParentChildren,
} from "../services";

const { width } = Dimensions.get("window");

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

// INITIAL_REWARDS moved to state

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
    case "APPROVED":
      return {
        label: "Đã duyệt",
        bg: "#EFF6FF",
        text: "#2563EB",
        Icon: MapPin,
      };
    case "collected":
    case "DELIVERED":
      return {
        label: "Đã giao",
        bg: "#F0FDF4",
        text: "#16A34A",
        Icon: Gift,
      };
    case "parent_confirmed":
    case "CONFIRMED":
      return {
        label: "Hoàn tất",
        bg: "#F3F4F6",
        text: "#6B7280",
        Icon: CheckCircle,
      };
    case "PENDING":
      return {
        label: "Đang chờ",
        bg: "#FFF7ED",
        text: "#EA580C",
        Icon: Clock,
      };
    case "REJECTED":
      return {
        label: "Từ chối",
        bg: "#FEE2E2",
        text: "#EF4444",
        Icon: XCircle,
      };
    default:
      return { label: status, bg: "#F3F4F6", text: "#6B7280", Icon: Gift };
  }
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ progress, delay }) {
  const widthAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 800,
      delay,
      useNativeDriver: false, // Cannot animate width with native driver
    }).start();
  }, [progress, delay]);

  return (
    <Animated.View
      style={[
        styles.progressFill,
        {
          width: widthAnim.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
          }),
        },
      ]}
    />
  );
}

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
    <FadeInView
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
          <ProgressBar progress={progress} delay={delay + 200} />
        </View>
      )}
    </FadeInView>
  );
}

// ─── Reward Row ───────────────────────────────────────────────────────────────
function RewardRow({ reward, onConfirm }) {
  const { label, bg, text, Icon: StatusIcon } = getStatusInfo(reward.status);
  return (
    <View style={styles.rewardCard}>
      <View style={styles.rewardEmoji}>
        {reward.rewardImagePresignedUrl ? (
          <Image
            source={{ uri: reward.rewardImagePresignedUrl }}
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
          />
        ) : (
          <Gift size={22} color="#9CA3AF" />
        )}
      </View>
      <View style={styles.rewardBody}>
        <View style={styles.rewardTopRow}>
          <View>
            <View style={styles.campaignTag}>
              <Text style={styles.campaignTagText}>{reward.requestCode || "Đổi quà"}</Text>
            </View>
            <Text style={styles.rewardName}>{reward.rewardName}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: bg }]}>
            <StatusIcon size={11} color={text} />
            <Text style={[styles.statusText, { color: text }]}>{label}</Text>
          </View>
        </View>
        <View style={styles.rewardFooter}>
          <View style={styles.dateRow}>
            <Clock size={11} color="#9CA3AF" />
            <Text style={styles.dateText}>
              {new Date(reward.createdAt).toLocaleDateString("vi-VN")}
            </Text>
          </View>
          {reward.status === "DELIVERED" && (
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => onConfirm(reward.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmBtnText}>Đã nhận quà</Text>
            </TouchableOpacity>
          )}
          {reward.status === "CONFIRMED" && (
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

  const [child, setChild] = useState(null);
  const [currentCoins, setCurrentCoins] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchData();
  }, [childId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resChildren, resRewards] = await Promise.all([
        getParentChildren(),
        getMyRequests(),
      ]);

      if (resChildren && resChildren.data) {
        const found = resChildren.data.find((c) => c.studentId === childId);
        if (found) {
          setChild(found);
          setCurrentCoins(found.totalCoin || 0);
        }
      }

      if (resRewards && resRewards.data) {
        // Filter rewards for this student and only show pending/delivered
        const studentRewards = resRewards.data.filter(
          (r) =>
            r.studentId === childId &&
            (r.status === "PENDING" || r.status === "DELIVERED"),
        );
        setRewards(studentRewards);
      }
    } catch (error) {
      console.log("Error fetching child detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      const res = await confirmRequest(id);
      if (res) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRedeem = (reward) => {
    // Refresh data after successful redeem (should be handled in modal or here)
    setTimeout(() => fetchData(), 500);
  };

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <Text>Đang tải thông tin...</Text>
      </View>
    );
  }

  if (!child) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <Text>Không tìm thấy thông tin học sinh</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: "#059669" }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            <Text style={styles.heroAvatarInitial}>{child.studentFullName.charAt(0)}</Text>
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{child.studentFullName}</Text>
            <Text style={styles.heroMeta}>
              Lớp {child.gradeLevel}{child.className} {child.schoolName ? `· ${child.schoolName}` : ""}
            </Text>
            {/* Removed Level badge as requested */}
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
            sub={`Mã học sinh: ${child.studentCode}`}
            delay={0}
          />
          <StatCard
            icon={Target}
            iconColor="#059669"
            label="Ngày sinh"
            value={child.dob ? new Date(child.dob).toLocaleDateString("vi-VN") : "N/A"}
            delay={80}
          />
          <StatCard
            icon={Flame}
            iconColor="#F97316"
            label="Giới tính"
            value={child.gender === "MALE" ? "Nam" : "Nữ"}
            delay={160}
          />
          <StatCard
            icon={Medal}
            iconColor="#3B82F6"
            label="Trạng thái"
            value={child.accountStatus === "ACTIVE" ? "Hoạt động" : "Khóa"}
            delay={240}
          />
        </View>

        {/* ── Reward tracking ── */}
        <FadeInView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 350, delay: 300 }}
        >
          {/* Section header */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Gift size={18} color="#DC2626" />
              <Text style={styles.sectionTitle}>Theo dõi quà tặng</Text>
            </View>
          </View>

          <View style={styles.rewardList}>
            {rewards.map((r) => (
              <RewardRow key={r.id} reward={r} onConfirm={handleConfirm} />
            ))}
          </View>
        </FadeInView>

        {/* ── Recent activities ── */}
        <FadeInView
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
        </FadeInView>
      </ScrollView>

      {/* Redeem modal removed */}
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
