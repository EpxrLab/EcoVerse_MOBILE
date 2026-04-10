import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FadeInView } from "../components/FadeInView";
import {
  ArrowLeft,
  Package,
  Ticket,
  Coins,
  Info,
  CheckCircle,
  XCircle,
  Gift,
  Plus,
  Minus,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllRewards, createRewardRequest } from "../services";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  {
    key: "PHYSICAL",
    label: "Quà",
    icon: Package,
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    key: "VOUCHER",
    label: "Voucher",
    icon: Ticket,
    color: "#EA580C",
    bg: "#FFF7ED",
  },
];

const TYPE_EMOJI = { PHYSICAL: "🎁", VOUCHER: "🎫" };

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function RewardDetailModal({ reward, visible, onClose, tabColor }) {
  if (!reward) return null;
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(1);

  const outOfStock = !reward.isUnlimited && reward.stockQuantity === 0;
  const inactive = !reward.isActive;
  const isDisable = outOfStock || inactive;

  // Reset quantity when modal opens/changes reward
  useEffect(() => {
    if (visible) setQuantity(1);
  }, [visible, reward?.id]);

  const handleRewardRequest = async (rId) => {
    try {
      const childId = await AsyncStorage.getItem("studentId");
      const payload = {
        quantity: quantity,
        note: "",
        studentId: childId,
        rewardId: rId,
      };

      const res = await createRewardRequest(payload);
      if (res) {
        Toast.show({
          type: "success",
          text1: "Đổi quà thành công! 🎉",
          text2: `Bạn đã đổi thành công ${quantity} món quà: ${reward.rewardName}`,
        });
        AsyncStorage.removeItem("studentId");
        navigation.navigate("ParentHome");
      } else {
        Toast.show({
          type: "error",
          text1: "Đổi quà thất bại!",
          text2: "Vui lòng thử lại sau.",
        });
      }

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const increment = () => {
    if (reward.isUnlimited || quantity < reward.stockQuantity) {
      setQuantity((q) => q + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.detailSheet}>
        <View style={styles.sheetHandle} />

        <ScrollView
          contentContainerStyle={styles.detailContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image hero */}
          <View
            style={[styles.detailHero, { backgroundColor: tabColor + "15" }]}
          >
            {reward.imagePresignedUrl ? (
              <Image
                source={{ uri: reward.imagePresignedUrl }}
                style={styles.detailImage}
              />
            ) : (
              <Text style={styles.detailEmoji}>
                {TYPE_EMOJI[reward.rewardType]}
              </Text>
            )}
          </View>

          {/* Name + status */}
          <View style={styles.detailNameRow}>
            <Text style={styles.detailName}>{reward.rewardName}</Text>
            <View
              style={[
                styles.detailStatusBadge,
                { backgroundColor: !isDisable ? "#ECFDF5" : "#FEF2F2" },
              ]}
            >
              {!isDisable ? (
                <CheckCircle size={12} color="#059669" />
              ) : (
                <XCircle size={12} color="#DC2626" />
              )}
              <Text
                style={[
                  styles.detailStatusText,
                  { color: !isDisable ? "#059669" : "#DC2626" },
                ]}
              >
                {inactive
                  ? "Ngưng hoạt động"
                  : outOfStock
                    ? "Hết hàng"
                    : "Còn hàng"}
              </Text>
            </View>
          </View>

          {/* Coin cost & Quantity Selector */}
          <View style={styles.costAndQtyRow}>
            <View style={[styles.coinRow, { backgroundColor: "#FFFBEB" }]}>
              <Coins size={20} color="#D97706" />
              <Text style={styles.coinCost}>
                {reward.coinCost * quantity} xu
              </Text>
            </View>

            {!isDisable && (
              <View style={styles.qtySelector}>
                <TouchableOpacity
                  onPress={decrement}
                  style={[
                    styles.qtyBtn,
                    quantity <= 1 && styles.qtyBtnDisabled,
                  ]}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} color={quantity <= 1 ? "#D1D5DB" : "#374151"} />
                </TouchableOpacity>
                <View style={styles.qtyBox}>
                  <Text style={styles.qtyText}>{quantity}</Text>
                </View>
                <TouchableOpacity
                  onPress={increment}
                  style={[
                    styles.qtyBtn,
                    !reward.isUnlimited &&
                      quantity >= reward.stockQuantity &&
                      styles.qtyBtnDisabled,
                  ]}
                  disabled={!reward.isUnlimited && quantity >= reward.stockQuantity}
                >
                  <Plus size={16} color={(!reward.isUnlimited && quantity >= reward.stockQuantity) ? "#D1D5DB" : "#374151"} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Mô tả & Thông tin khác (Giữ nguyên các section của bạn) */}
          <View style={styles.detailSection}>
            <View style={styles.detailSectionHeader}>
              <Info size={14} color={tabColor} />
              <Text style={[styles.detailSectionTitle, { color: tabColor }]}>
                Mô tả
              </Text>
            </View>
            <Text style={styles.detailDesc}>{reward.description}</Text>
          </View>

          {/* ... (Các section khác: Số lượng, Điều khoản giữ nguyên) ... */}
        </ScrollView>

        {/* NÚT BẤM MỚI: ĐỔI QUÀ */}
        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[
              styles.redeemSubmitBtn,
              { backgroundColor: isDisable ? "#E5E7EB" : tabColor },
            ]}
            onPress={() => {
              if (!isDisable) {
                handleRewardRequest(reward.id);
              }
            }}
            disabled={isDisable}
            activeOpacity={0.8}
          >
            <Gift size={18} color="#FFFFFF" />
            <Text style={styles.redeemSubmitText}>
              {isDisable ? "Không thể đổi quà" : "Đổi quà ngay"}
            </Text>
          </TouchableOpacity>

          {/* Nút đóng phụ (Dạng Text để nhìn gọn hơn) */}
          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Để sau</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Reward Card ──────────────────────────────────────────────────────────────
function RewardCard({ reward, tab, onPress, delay }) {
  const outOfStock = !reward.isUnlimited && reward.stockQuantity === 0;
  const inactive = !reward.isActive;
  const dimmed = outOfStock || inactive;

  return (
    <FadeInView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 280, delay }}
      style={{ width: CARD_WIDTH }}
    >
      <TouchableOpacity
        onPress={() => onPress(reward)}
        activeOpacity={0.85}
        style={[styles.card, dimmed && styles.cardDimmed]}
      >
        {/* Image / emoji area */}
        <View style={[styles.cardImageBox, { backgroundColor: tab.bg }]}>
          {reward.imagePresignedUrl ? (
            <Image
              source={{ uri: reward.imagePresignedUrl }}
              style={styles.cardImage}
            />
          ) : (
            <Text style={styles.cardEmoji}>
              {TYPE_EMOJI[reward.rewardType]}
            </Text>
          )}
          {/* Status overlay */}
          {(outOfStock || inactive) && (
            <View style={styles.cardOverlay}>
              <Text style={styles.cardOverlayText}>
                {inactive ? "Ngưng" : "Hết hàng"}
              </Text>
            </View>
          )}
          {/* Unlimited badge */}
          {reward.isUnlimited && (
            <View
              style={[styles.unlimitedBadge, { backgroundColor: tab.color }]}
            >
              <Text style={styles.unlimitedText}>∞</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={2}>
            {reward.rewardName}
          </Text>
          <Text style={styles.cardDesc} numberOfLines={1}>
            {reward.description}
          </Text>
          <View style={styles.cardFooter}>
            <Coins size={13} color={dimmed ? "#D1D5DB" : "#D97706"} />
            <Text style={[styles.cardCoin, dimmed && styles.cardCoinDimmed]}>
              {reward.coinCost} xu
            </Text>
            {!reward.isUnlimited && reward.stockQuantity > 0 && (
              <Text style={styles.cardStock}>· còn {reward.stockQuantity}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </FadeInView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function ParentAllRewards() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState("PHYSICAL");
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchRewards = async () => {
    try {
      const res = await getAllRewards();
      setRewards(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(rewards);

  useEffect(() => {
    fetchRewards();
  }, []);

  const currentTab = TABS.find((t) => t.key === activeTab);
  const filtered = rewards.filter((r) => r.rewardType === activeTab);

  const handlePressCard = (reward) => {
    setSelected(reward);
    setModalVisible(true);
  };

  return (
    <View style={styles.screen}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách phần thưởng</Text>
        <View style={styles.backBtn} />
      </View>

      {/* ── Tab bar ── */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                isActive && {
                  borderBottomColor: tab.color,
                  borderBottomWidth: 2.5,
                },
              ]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Icon size={16} color={isActive ? tab.color : "#9CA3AF"} />
              <Text
                style={[
                  styles.tabText,
                  isActive && { color: tab.color, fontWeight: "700" },
                ]}
              >
                {tab.label}
              </Text>
              {/* Count badge */}
              {!isLoading && (
                <View
                  style={[
                    styles.tabCount,
                    { backgroundColor: isActive ? tab.color : "#E5E7EB" },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabCountText,
                      { color: isActive ? "#fff" : "#9CA3AF" },
                    ]}
                  >
                    {rewards.filter((r) => r.rewardType === tab.key).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Content ── */}
      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Đang tải phần thưởng...</Text>
        </View>
      ) : (
      <FlatList
        data={filtered}
        numColumns={2}
        key={activeTab}
        keyExtractor={(item, index) =>
          item.id ? `${item.id}-${index}` : `allreward-${index}`
        }
        columnWrapperStyle={filtered.length > 0 ? styles.cardGrid : null}
        ListHeaderComponent={() => (
          <FadeInView
            key={activeTab + "_banner"}
            from={{ opacity: 0, translateY: -6 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 250 }}
            style={[
              styles.banner,
              {
                backgroundColor: currentTab?.bg,
                borderColor: currentTab?.color + "30",
              },
            ]}
          >
            <currentTab.icon size={18} color={currentTab?.color} />
            <Text style={[styles.bannerText, { color: currentTab?.color }]}>
              {activeTab === "PHYSICAL" &&
                "Quà tặng hiện vật — giao tận trường cho bé"}
              {activeTab === "VOUCHER" &&
                "Voucher & ưu đãi — dùng mua sắm & giải trí"}
            </Text>
          </FadeInView>
        )}
        renderItem={({ item, index }) => (
          <RewardCard
            reward={item}
            tab={currentTab}
            onPress={handlePressCard}
            delay={index * 55}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 40 }}>{TYPE_EMOJI[activeTab]}</Text>
            <Text style={styles.emptyTitle}>Chưa có phần thưởng</Text>
            <Text style={styles.emptyDesc}>
              Danh mục này chưa có phần thưởng nào
            </Text>
          </View>
        )}
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
      )}

      {/* ── Detail Modal ── */}
      <RewardDetailModal
        reward={selected}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        tabColor={currentTab?.color || "#059669"}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAFB" },

  // Header
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
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },

  // Tab bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 12,
    borderBottomWidth: 2.5,
    borderBottomColor: "transparent",
  },
  tabText: { fontSize: 12, fontWeight: "500", color: "#9CA3AF" },
  tabCount: {
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabCountText: { fontSize: 10, fontWeight: "700" },

  // Loading
  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { fontSize: 13, color: "#9CA3AF" },

  // Scroll & grid
  scroll: { flex: 1 },
  grid: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 100, gap: 14 },

  // Banner
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  bannerText: { fontSize: 12, fontWeight: "600", flex: 1 },

  // Card grid
  cardGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDimmed: { opacity: 0.6 },
  cardImageBox: {
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cardImage: { width: "100%", height: "100%", resizeMode: "cover" },
  cardEmoji: { fontSize: 42 },
  cardOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
  },
  cardOverlayText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  unlimitedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  unlimitedText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },

  cardBody: { padding: 10, gap: 4 },
  cardName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 18,
  },
  cardDesc: { fontSize: 11, color: "#9CA3AF" },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 4,
  },
  cardCoin: { fontSize: 12, fontWeight: "700", color: "#D97706" },
  cardCoinDimmed: { color: "#D1D5DB" },
  cardStock: { fontSize: 10, color: "#9CA3AF" },

  // Empty state
  emptyState: { alignItems: "center", paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#374151" },
  emptyDesc: { fontSize: 13, color: "#9CA3AF" },

  // Modal
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  detailSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "82%",
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
    marginBottom: 0,
  },
  detailHero: {
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  detailImage: { width: "100%", height: "100%", resizeMode: "cover" },
  detailEmoji: { fontSize: 62 },
  detailContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 16,
  },

  detailNameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  detailName: { fontSize: 20, fontWeight: "800", color: "#111827", flex: 1 },
  detailStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexShrink: 0,
  },
  detailStatusText: { fontSize: 11, fontWeight: "700" },

  costAndQtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  coinRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  coinCost: { fontSize: 20, fontWeight: "800", color: "#D97706" },

  qtySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  qtyBtnDisabled: {
    backgroundColor: "#F9FAFB",
    elevation: 0,
  },
  qtyBox: {
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  detailSection: { gap: 6 },
  detailSectionHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailDesc: { fontSize: 13, color: "#374151", lineHeight: 20 },
  // Modal Footer & Buttons
  modalFooter: {
    padding: 20,
    paddingTop: 10,
    gap: 12,
  },
  redeemSubmitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 16,
    // Tạo độ nổi cho nút
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  redeemSubmitText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },

  // Điều chỉnh lại detailSheet để chứa footer cố định
  detailSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: "85%", // Cố định chiều cao để footer nằm dưới cùng
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
});
