import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { FadeInView } from "./FadeInView";
import {
  Coins,
  Gift,
  Sparkles,
  Package,
  X,
  ShoppingBag,
} from "lucide-react-native";

const { height } = Dimensions.get("window");

// ─── Mock Marketplace ─────────────────────────────────────────────────────────
const MOCK_REWARDS = [
  {
    id: "r1",
    name: "Avatar Rồng Xanh",
    type: "virtual",
    image: "🐉",
    coins: 80,
    description: "Mở khóa avatar đặc biệt trong game",
  },
  {
    id: "r2",
    name: "Khung ảnh Lá Rừng",
    type: "virtual",
    image: "🌿",
    coins: 50,
    description: "Khung profile độc quyền mùa hè",
  },
  {
    id: "r3",
    name: "Hiệu ứng Sao Băng",
    type: "virtual",
    image: "✨",
    coins: 60,
    description: "Hiệu ứng đặc biệt khi hoàn thành màn",
  },
  {
    id: "r4",
    name: "Nhân vật Gấu Trúc",
    type: "virtual",
    image: "🐼",
    coins: 120,
    description: "Skin nhân vật cực cute",
  },
  {
    id: "r5",
    name: "Bút màu sinh thái",
    type: "physical",
    image: "🖊️",
    coins: 150,
    description: "Bộ 12 bút màu làm từ vật liệu tái chế",
  },
  {
    id: "r6",
    name: "Vé xem phim CGV",
    type: "physical",
    image: "🎬",
    coins: 200,
    description: "Vé xem phim 2D tại rạp CGV toàn quốc",
  },
  {
    id: "r7",
    name: "Voucher Tiki 50k",
    type: "physical",
    image: "🎫",
    coins: 180,
    description: "Voucher mua sắm online Tiki 50.000đ",
  },
  {
    id: "r8",
    name: "Hộp đồ chơi STEM",
    type: "physical",
    image: "🔬",
    coins: 300,
    description: "Bộ thí nghiệm khoa học dành cho trẻ em",
  },
];

const TYPE_LABELS = {
  virtual: {
    label: "Vật phẩm ảo",
    bg: "#F5F3FF",
    text: "#7C3AED",
    icon: Sparkles,
  },
  physical: {
    label: "Quà hiện vật",
    bg: "#FFF7ED",
    text: "#EA580C",
    icon: Package,
  },
};

// ─── Reward Card ──────────────────────────────────────────────────────────────
function RewardCard({ reward, selected, currentCoins, onSelect }) {
  const affordable = currentCoins >= reward.coins;
  const typeInfo = TYPE_LABELS[reward.type];
  const TypeIcon = typeInfo.icon;
  const isSelected = selected?.id === reward.id;

  return (
    <TouchableOpacity
      onPress={() => affordable && onSelect(reward)}
      activeOpacity={affordable ? 0.75 : 1}
      style={[
        styles.rewardCard,
        isSelected && styles.rewardCardSelected,
        !affordable && styles.rewardCardDisabled,
      ]}
    >
      {/* Emoji */}
      <View
        style={[
          styles.rewardEmojiBox,
          isSelected && styles.rewardEmojiBoxSelected,
        ]}
      >
        <Text style={styles.rewardEmoji}>{reward.image}</Text>
      </View>

      {/* Info */}
      <View style={styles.rewardInfo}>
        <View style={styles.rewardNameRow}>
          <Text
            style={[
              styles.rewardName,
              !affordable && styles.rewardNameDisabled,
            ]}
            numberOfLines={1}
          >
            {reward.name}
          </Text>
          <View style={[styles.typeBadge, { backgroundColor: typeInfo.bg }]}>
            <TypeIcon size={10} color={typeInfo.text} />
            <Text style={[styles.typeText, { color: typeInfo.text }]}>
              {typeInfo.label}
            </Text>
          </View>
        </View>
        <Text style={styles.rewardDesc} numberOfLines={1}>
          {reward.description}
        </Text>
        <View style={styles.rewardCoinRow}>
          <Coins size={13} color={affordable ? "#D97706" : "#D1D5DB"} />
          <Text
            style={[
              styles.rewardCoin,
              !affordable && styles.rewardCoinDisabled,
            ]}
          >
            {reward.coins} xu
          </Text>
          {!affordable && <Text style={styles.notEnough}>· Không đủ xu</Text>}
        </View>
      </View>

      {/* Selected indicator */}
      {isSelected && (
        <View style={styles.selectedDot}>
          <View style={styles.selectedDotInner} />
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export function RedeemRewardModal({
  visible,
  onClose,
  currentCoins,
  childName,
  onRedeem,
}) {
  const [selected, setSelected] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { key: "all", label: "Tất cả" },
    { key: "virtual", label: "Vật phẩm ảo" },
    { key: "physical", label: "Quà hiện vật" },
  ];

  const filtered =
    activeFilter === "all"
      ? MOCK_REWARDS
      : MOCK_REWARDS.filter((r) => r.type === activeFilter);

  const canRedeem = selected && currentCoins >= selected.coins;

  const handleConfirm = () => {
    if (!canRedeem) return;
    onRedeem(selected);
    setSelected(null);
    onClose();
  };

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose} />

      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ShoppingBag size={20} color="#059669" />
            <View>
              <Text style={styles.headerTitle}>Đổi quà cho con</Text>
              {childName && (
                <Text style={styles.headerSub}>Dành cho {childName}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeBtn}
            activeOpacity={0.7}
          >
            <X size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Coin balance */}
        <View style={styles.balanceRow}>
          <View style={styles.balanceBox}>
            <Coins size={16} color="#D97706" />
            <Text style={styles.balanceLabel}>Số xu hiện có:</Text>
            <Text style={styles.balanceVal}>{currentCoins} xu</Text>
          </View>
        </View>

        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterChip,
                activeFilter === f.key && styles.filterChipActive,
              ]}
              onPress={() => {
                setActiveFilter(f.key);
                setSelected(null);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === f.key && styles.filterTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reward list */}
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filtered.map((reward, idx) => (
            <FadeInView
              key={reward.id}
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 250, delay: idx * 40 }}
            >
              <RewardCard
                reward={reward}
                selected={selected}
                currentCoins={currentCoins}
                onSelect={setSelected}
              />
            </FadeInView>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {selected && (
            <FadeInView
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 200 }}
              style={styles.selectedSummary}
            >
              <Text style={styles.summaryEmoji}>{selected.image}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryName} numberOfLines={1}>
                  {selected.name}
                </Text>
                <Text style={styles.summaryAfter}>
                  Còn lại: {currentCoins - selected.coins} xu
                </Text>
              </View>
              <View style={styles.summaryCoin}>
                <Coins size={13} color="#D97706" />
                <Text style={styles.summaryCoinText}>-{selected.coins}</Text>
              </View>
            </FadeInView>
          )}

          <View style={styles.footerBtns}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmBtn,
                !canRedeem && styles.confirmBtnDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!canRedeem}
              activeOpacity={0.85}
            >
              <Gift size={15} color="#FFFFFF" />
              <Text style={styles.confirmText}>
                {selected ? "Đổi quà" : "Chọn quà trước"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.88,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: { fontSize: 17, fontWeight: "800", color: "#111827" },
  headerSub: { fontSize: 12, color: "#6B7280", marginTop: 1 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  // Balance
  balanceRow: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  balanceBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  balanceLabel: { fontSize: 13, color: "#92400E", flex: 1 },
  balanceVal: { fontSize: 15, fontWeight: "800", color: "#D97706" },

  // Filter
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  filterChipActive: {
    backgroundColor: "#059669",
  },
  filterText: { fontSize: 12, fontWeight: "600", color: "#6B7280" },
  filterTextActive: { color: "#FFFFFF" },

  // List
  listScroll: { maxHeight: height * 0.38 },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 8,
  },

  // Reward card
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "#F3F4F6",
  },
  rewardCardSelected: {
    backgroundColor: "#F0FDF4",
    borderColor: "#34D399",
  },
  rewardCardDisabled: {
    opacity: 0.5,
  },
  rewardEmojiBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rewardEmojiBoxSelected: {
    backgroundColor: "#D1FAE5",
  },
  rewardEmoji: { fontSize: 22 },
  rewardInfo: { flex: 1, gap: 3 },
  rewardNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  rewardName: { fontSize: 13, fontWeight: "700", color: "#111827", flex: 1 },
  rewardNameDisabled: { color: "#9CA3AF" },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    flexShrink: 0,
  },
  typeText: { fontSize: 9, fontWeight: "700" },
  rewardDesc: { fontSize: 11, color: "#9CA3AF" },
  rewardCoinRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  rewardCoin: { fontSize: 12, fontWeight: "700", color: "#D97706" },
  rewardCoinDisabled: { color: "#D1D5DB" },
  notEnough: { fontSize: 11, color: "#EF4444" },
  selectedDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  selectedDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#059669",
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 12,
  },
  selectedSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  summaryEmoji: { fontSize: 20 },
  summaryName: { fontSize: 13, fontWeight: "700", color: "#064E3B" },
  summaryAfter: { fontSize: 11, color: "#6B7280", marginTop: 2 },
  summaryCoin: { flexDirection: "row", alignItems: "center", gap: 3 },
  summaryCoinText: { fontSize: 13, fontWeight: "800", color: "#D97706" },

  footerBtns: { flexDirection: "row", gap: 10 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  confirmBtn: {
    flex: 2,
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
  confirmBtnDisabled: {
    backgroundColor: "#D1FAE5",
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmText: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },
});
