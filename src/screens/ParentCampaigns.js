import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { FadeInView } from "../components/FadeInView";
import {
  Flag,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  AlertTriangle,
  Filter,
  Info,
} from "lucide-react-native";
import { MobileHeader } from "../components/MobileHeader";
import DropDownPicker from "react-native-dropdown-picker";
import {
  approveInvitation,
  getAllCamapaignInvitations,
  rejectInvitation,
} from "../services";
import Toast from "react-native-toast-message";

const { height, width } = Dimensions.get("window");

const MOCK_INVITATIONS = [
  {
    campaignId: "c1a2b3c4-0001",
    campaignName: "Tái chế Nhựa Tháng 3",
    studentId: "s1",
    studentName: "Nguyễn Minh Anh",
    parentApprovalStatus: "INVITED",
    invitationDeadline: "2026-04-05T23:59:00.000Z",
  },
  {
    campaignId: "c1a2b3c4-0002",
    campaignName: "Chiến dịch Xanh Mùa Hè",
    studentId: "s2",
    studentName: "Nguyễn Gia Bảo",
    parentApprovalStatus: "INVITED",
    invitationDeadline: "2026-04-10T23:59:00.000Z",
  },
  {
    campaignId: "c1a2b3c4-0003",
    campaignName: "Tiết kiệm Năng lượng",
    studentId: "s1",
    studentName: "Nguyễn Minh Anh",
    parentApprovalStatus: "APPROVED",
    invitationDeadline: "2026-03-15T23:59:00.000Z",
  },
  {
    campaignId: "c1a2b3c4-0004",
    campaignName: "Không Túi Nilon",
    studentId: "s2",
    studentName: "Nguyễn Gia Bảo",
    parentApprovalStatus: "REJECTED",
    invitationDeadline: "2026-03-10T23:59:00.000Z",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDeadline = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const isExpiringSoon = (iso) => {
  if (!iso) return false;
  const diff = new Date(iso) - new Date();
  return diff > 0 && diff < 1000 * 60 * 60 * 48; // < 48h
};

const STATUS_CONFIG = {
  INVITED: {
    label: "Chờ xác nhận",
    color: "#EA580C",
    bg: "#FFF7ED",
    icon: Clock,
  },
  APPROVED: {
    label: "Đã đồng ý",
    color: "#16A34A",
    bg: "#F0FDF4",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Đã từ chối",
    color: "#DC2626",
    bg: "#FEF2F2",
    icon: XCircle,
  },
};

// ─── Invitation Card ──────────────────────────────────────────────────────────
function InvitationCard({ item, onPress, onAccept, onRejectPress }) {
  const cfg = STATUS_CONFIG[item.parentApprovalStatus] || STATUS_CONFIG.INVITED;
  const StatusIcon = cfg.icon;
  const expiring = isExpiringSoon(item.invitationDeadline);

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      activeOpacity={0.85}
      style={styles.card}
    >
      <View style={styles.cardRow}>
        {/* Left icon */}
        <View style={styles.flagBox}>
          <Flag size={20} color="#059669" />
        </View>

        <View style={styles.cardBody}>
          {/* Title + status badge */}
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.campaignName}
            </Text>
            <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
              <StatusIcon size={10} color={cfg.color} />
              <Text style={[styles.badgeText, { color: cfg.color }]}>
                {cfg.label}
              </Text>
            </View>
          </View>

          {/* Student */}
          <View style={styles.metaRow}>
            <User size={12} color="#9CA3AF" />
            <Text style={styles.metaText}>{item.studentName}</Text>
          </View>

          {/* Deadline */}
          <View style={styles.metaRow}>
            <Calendar size={12} color={expiring ? "#EF4444" : "#9CA3AF"} />
            <Text style={[styles.metaText, expiring && styles.metaTextUrgent]}>
              Hạn xác nhận: {formatDeadline(item.invitationDeadline)}
              {expiring ? "  ⚠ Sắp hết hạn!" : ""}
            </Text>
          </View>

          {/* Action buttons — only for INVITED */}
          {item.parentApprovalStatus === "INVITED" && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => onAccept(item)}
                activeOpacity={0.8}
              >
                <CheckCircle2 size={13} color="#fff" />
                <Text style={styles.acceptBtnText}>Đồng ý</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => onRejectPress(item)}
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

// ─── Reject Reason Modal ──────────────────────────────────────────────────────
function RejectReasonModal({ invitation, visible, onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      Alert.alert(
        "Thiếu lý do",
        "Vui lòng nhập lý do từ chối trước khi xác nhận.",
      );
      return;
    }
    onConfirm(invitation, reason.trim());
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  if (!invitation) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <View style={styles.rejectSheet}>
        <View style={styles.sheetHandle} />

        {/* Header */}
        <View style={styles.rejectHeader}>
          <View style={styles.rejectIconBox}>
            <XCircle size={22} color="#DC2626" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rejectTitle}>Từ chối lời mời</Text>
            <Text style={styles.rejectSub} numberOfLines={1}>
              {invitation.campaignName}
            </Text>
          </View>
        </View>

        {/* Warning banner */}
        <View style={styles.warningBanner}>
          <AlertTriangle size={16} color="#D97706" />
          <Text style={styles.warningText}>
            Lưu ý: Sau khi từ chối, thao tác này{" "}
            <Text style={styles.warningBold}>không thể hoàn tác</Text>. Con bạn
            sẽ không thể tham gia chiến dịch này.
          </Text>
        </View>

        {/* Reason input */}
        <Text style={styles.reasonLabel}>
          Lý do từ chối <Text style={{ color: "#EF4444" }}>*</Text>
        </Text>
        <TextInput
          style={styles.reasonInput}
          placeholder="Nhập lý do từ chối chiến dịch này..."
          placeholderTextColor="#C0C9D4"
          multiline
          numberOfLines={4}
          value={reason}
          onChangeText={setReason}
          maxLength={300}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{reason.length}/300</Text>

        {/* Buttons */}
        <View style={styles.rejectFooter}>
          <TouchableOpacity
            style={styles.cancelSheetBtn}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelSheetText}>Hủy bỏ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.confirmRejectBtn,
              !reason.trim() && styles.confirmRejectBtnDisabled,
            ]}
            onPress={handleConfirm}
            activeOpacity={0.85}
          >
            <XCircle size={15} color="#fff" />
            <Text style={styles.confirmRejectText}>Xác nhận từ chối</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({
  invitation,
  visible,
  onClose,
  onAccept,
  onRejectPress,
}) {
  if (!invitation) return null;
  const cfg =
    STATUS_CONFIG[invitation.parentApprovalStatus] || STATUS_CONFIG.INVITED;
  const StatusIcon = cfg.icon;
  const expiring = isExpiringSoon(invitation.invitationDeadline);

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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Campaign name */}
          <View style={styles.detailHeaderRow}>
            <View style={styles.flagBox}>
              <Flag size={20} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailTitle}>{invitation.campaignName}</Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: cfg.bg,
                    alignSelf: "flex-start",
                    marginTop: 4,
                  },
                ]}
              >
                <StatusIcon size={11} color={cfg.color} />
                <Text style={[styles.badgeText, { color: cfg.color }]}>
                  {cfg.label}
                </Text>
              </View>
            </View>
          </View>

          {/* Info block */}
          <View style={styles.detailInfoBlock}>
            <View style={styles.detailInfoRow}>
              <User size={15} color="#6B7280" />
              <Text style={styles.detailInfoLabel}>Học sinh:</Text>
              <Text style={styles.detailInfoVal}>{invitation.studentName}</Text>
            </View>
            <View style={styles.detailInfoRow}>
              <Calendar size={15} color={expiring ? "#EF4444" : "#6B7280"} />
              <Text style={styles.detailInfoLabel}>Hạn xác nhận:</Text>
              <Text
                style={[
                  styles.detailInfoVal,
                  expiring && { color: "#EF4444", fontWeight: "700" },
                ]}
              >
                {formatDeadline(invitation.invitationDeadline)}
                {expiring ? " ⚠" : ""}
              </Text>
            </View>
          </View>

          {/* Expiring warning */}
          {expiring && (
            <View style={styles.warningBanner}>
              <AlertTriangle size={14} color="#D97706" />
              <Text style={styles.warningText}>
                Lời mời sắp hết hạn, hãy xác nhận sớm!
              </Text>
            </View>
          )}

          {/* Info note */}
          <View style={styles.infoNote}>
            <Info size={14} color="#2563EB" />
            <Text style={styles.infoNoteText}>
              Liên hệ nhà trường để biết thêm chi tiết về chiến dịch này.
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.detailFooter}>
            {invitation.parentApprovalStatus === "INVITED" ? (
              <View style={styles.footerBtns}>
                <TouchableOpacity
                  style={styles.modalRejectBtn}
                  onPress={() => {
                    onClose();
                    setTimeout(() => onRejectPress(invitation), 300);
                  }}
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
              <View style={[styles.statusFull, { backgroundColor: cfg.bg }]}>
                <StatusIcon size={16} color={cfg.color} />
                <Text style={[styles.statusFullText, { color: cfg.color }]}>
                  {cfg.label}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ParentCampaigns() {
  const [invitations, setInvitations] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selected, setSelected] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectVisible, setRejectVisible] = useState(false);

  const [dropOpen, setDropOpen] = useState(false);
  const [dropValue, setDropValue] = useState("ALL");
  const dropItems = [
    { label: "Tất cả", value: "ALL" },
    { label: "Đã đồng ý", value: "APPROVED" },
    { label: "Đã từ chối", value: "REJECTED" },
  ];

  const fetchData = async () => {
    try {
      const res = await getAllCamapaignInvitations();
      setInvitations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingList = invitations.filter(
    (i) => i.parentApprovalStatus === "INVITED",
  );
  const respondedList = invitations.filter(
    (i) => i.parentApprovalStatus !== "INVITED",
  );
  const filteredResponded =
    dropValue === "ALL"
      ? respondedList
      : respondedList.filter((i) => i.parentApprovalStatus === dropValue);

  const currentList = activeTab === "pending" ? pendingList : filteredResponded;

  const handleAccept = async (item) => {
    try {
      const payload = {
        studentId: item.studentId,
      };
      const res = await approveInvitation(item.id, payload);

      if (res) {
        Toast.show({
          type: "success",
          text1: "Xác nhận tham gia thành công!",
          text2: "Bạn đã xác nhận học sinh sẽ tham gia chiến dịch.",
        });
        fetchData();
      } else {
        Toast.show({
          type: "error",
          text1: "Xác nhận tham gia thất bại!",
          text2:
            "Thao tác xác nhận học sinh sẽ tham gia chiến dịch chưa được ghi nhận.",
        });
      }
      setDetailVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectPress = (item) => {
    setRejectTarget(item);
    setRejectVisible(true);
  };

  const handleRejectConfirm = async (item, reason) => {
    try {
      const payload = {
        studentId: item.studentId,
        reason: reason,
      };
      const res = await rejectInvitation(item.id, payload);
      if (res) {
        Toast.show({
          type: "success",
          text1: "Từ chối tham gia thành công!",
          text2: "Bạn đã từ chối cho học sinh tham gia chiến dịch.",
        });
        fetchData();
      } else {
        Toast.show({
          type: "error",
          text1: "Từ chối tham gia thất bại!",
          text2: "Thao tác từ chối tham gia chiến dịch của bạn chưa được ghi nhận.",
        });
      }
      setRejectVisible(false);
      setRejectTarget(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewDetail = (item) => {
    setSelected(item);
    setDetailVisible(true);
  };

  return (
    <View style={styles.screen}>
      <MobileHeader title="Chiến dịch" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero banner */}
        <FadeInView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 350 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroIcon}>
            <Flag size={22} color="#059669" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Lời mời chiến dịch</Text>
            <Text style={styles.heroDesc}>
              Xác nhận cho con tham gia các chiến dịch môi trường
            </Text>
          </View>
          {pendingList.length > 0 && (
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{pendingList.length} mới</Text>
            </View>
          )}
        </FadeInView>

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {[
            {
              key: "pending",
              label: "Chờ xác nhận",
              count: pendingList.length,
            },
            {
              key: "responded",
              label: "Đã phản hồi",
              count: respondedList.length,
            },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View
                  style={[
                    styles.tabBadge,
                    {
                      backgroundColor:
                        activeTab === tab.key ? "#F97316" : "#E5E7EB",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      { color: activeTab === tab.key ? "#fff" : "#9CA3AF" },
                    ]}
                  >
                    {tab.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Dropdown filter — only on responded tab */}
        {activeTab === "responded" && (
          <FadeInView
            from={{ opacity: 0, translateY: -4 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 220 }}
            style={{ zIndex: 500 }}
          >
            <View style={styles.filterLabelRow}>
              <Filter size={13} color="#6B7280" />
              <Text style={styles.filterLabel}>Lọc theo kết quả phản hồi</Text>
              <Text style={styles.filterCount}>
                {filteredResponded.length} kết quả
              </Text>
            </View>
            <DropDownPicker
              open={dropOpen}
              value={dropValue}
              items={dropItems}
              setOpen={setDropOpen}
              setValue={setDropValue}
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
              zIndex={500}
              zIndexInverse={100}
            />
          </FadeInView>
        )}

        {/* List */}
        <FadeInView
          key={activeTab + dropValue}
          from={{ opacity: 0, translateX: 6 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: "timing", duration: 240 }}
          style={{ zIndex: 1 }}
        >
          {currentList.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBox}>
                {activeTab === "pending" ? (
                  <Flag size={32} color="#A7F3D0" />
                ) : (
                  <CheckCircle2 size={32} color="#D1D5DB" />
                )}
              </View>
              <Text style={styles.emptyTitle}>
                {activeTab === "pending"
                  ? "Không có lời mời nào"
                  : dropValue !== "ALL"
                    ? `Không có chiến dịch "${dropItems.find((d) => d.value === dropValue)?.label}"`
                    : "Chưa có phản hồi nào"}
              </Text>
              <Text style={styles.emptyDesc}>
                {activeTab === "pending"
                  ? "Hiện tại không có chiến dịch nào mời con bạn tham gia"
                  : "Các lời mời đã phản hồi sẽ hiển thị ở đây"}
              </Text>
            </View>
          ) : (
            currentList.map((inv, idx) => (
              <FadeInView
                key={inv.campaignId}
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 280, delay: idx * 55 }}
              >
                <InvitationCard
                  item={inv}
                  onPress={handleViewDetail}
                  onAccept={handleAccept}
                  onRejectPress={handleRejectPress}
                />
              </FadeInView>
            ))
          )}
        </FadeInView>
      </ScrollView>

      {/* Detail modal */}
      <DetailModal
        invitation={selected}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        onAccept={handleAccept}
        onRejectPress={handleRejectPress}
      />

      {/* Reject reason modal */}
      <RejectReasonModal
        invitation={rejectTarget}
        visible={rejectVisible}
        onClose={() => {
          setRejectVisible(false);
          setRejectTarget(null);
        }}
        onConfirm={handleRejectConfirm}
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
    paddingBottom: 120,
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
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { fontSize: 15, fontWeight: "700", color: "#064E3B" },
  heroDesc: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  heroBadge: {
    backgroundColor: "#F97316",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  heroBadgeText: { fontSize: 11, fontWeight: "800", color: "#fff" },

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
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: { fontSize: 10, fontWeight: "800" },

  // Filter
  filterLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  filterLabel: { fontSize: 12, fontWeight: "600", color: "#6B7280", flex: 1 },
  filterCount: { fontSize: 11, color: "#9CA3AF" },
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

  // Invitation Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 2,
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
    width: 46,
    height: 46,
    borderRadius: 13,
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
  metaTextUrgent: { color: "#EF4444", fontWeight: "600" },

  // Action buttons
  actionRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  acceptBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#059669",
    paddingVertical: 9,
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
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rejectBtnText: { fontSize: 13, fontWeight: "600", color: "#6B7280" },

  // Empty state
  emptyState: { alignItems: "center", paddingVertical: 60, gap: 10 },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  // Backdrop
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },

  // Reject reason sheet
  rejectSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 36,
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
  rejectHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  rejectIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  rejectTitle: { fontSize: 18, fontWeight: "800", color: "#111827" },
  rejectSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  // Warning banner
  warningBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginBottom: 16,
  },
  warningText: { fontSize: 12, color: "#92400E", flex: 1, lineHeight: 18 },
  warningBold: { fontWeight: "800" },

  // Info note
  infoNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 16,
  },
  infoNoteText: { fontSize: 12, color: "#1E40AF", flex: 1, lineHeight: 18 },

  // Reason input
  reasonLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  reasonInput: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FAFAFA",
    minHeight: 110,
    marginBottom: 4,
  },
  charCount: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "right",
    marginBottom: 20,
  },

  // Reject footer buttons
  rejectFooter: { flexDirection: "row", gap: 10 },
  cancelSheetBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelSheetText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  confirmRejectBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#DC2626",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmRejectBtnDisabled: {
    backgroundColor: "#FCA5A5",
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmRejectText: { fontSize: 14, fontWeight: "700", color: "#fff" },

  // Detail sheet
  detailSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    maxHeight: height * 0.75,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 16,
  },
  detailHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 22,
  },
  detailInfoBlock: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginBottom: 14,
  },
  detailInfoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailInfoLabel: { fontSize: 13, color: "#6B7280", width: 100 },
  detailInfoVal: { fontSize: 13, fontWeight: "600", color: "#111827", flex: 1 },
  detailFooter: { paddingTop: 8 },
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
