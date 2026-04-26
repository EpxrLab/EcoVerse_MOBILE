import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { FadeInView } from "../components/FadeInView";
import { Leaf, Cloud, Trophy } from "lucide-react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { MobileHeader } from "../components/MobileHeader";
import { useFocusEffect } from "@react-navigation/native";
import {
  getParentChildren,
  getCampaignInvitationHistory,
  getCampaignLeaderboard,
} from "../services";

// ─── Rank Badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank }) {
  const gold = { bg: "#F59E0B", text: "#fff" };
  const silver = { bg: "#94A3B8", text: "#fff" };
  const bronze = { bg: "#F97316", text: "#fff" };
  const plain = { bg: "#F3F4F6", text: "#6B7280" };

  const c =
    rank === 1 ? gold : rank === 2 ? silver : rank === 3 ? bronze : plain;

  return (
    <View style={[styles.rankBadge, { backgroundColor: c.bg }]}>
      {rank <= 3 ? (
        <Trophy size={16} color={c.text} />
      ) : (
        <Text style={[styles.rankText, { color: c.text }]}>#{rank}</Text>
      )}
    </View>
  );
}

// ─── Leaderboard Row ──────────────────────────────────────────────────────────
function LeaderRow({ item, isMyChild, accentColor, showSchool }) {
  return (
    <FadeInView
      from={{ opacity: 0, translateX: -8 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 280, delay: (item.rank || 0) * 50 }}
      style={[
        styles.leaderRow,
        isMyChild && {
          backgroundColor: accentColor + "18",
          borderColor: accentColor + "50",
          borderWidth: 1.5,
        },
      ]}
    >
      <RankBadge rank={item.rank} />

      <View style={styles.avatarWrapper}>
        <Text style={styles.avatarEmoji}>{item.avatar || "👤"}</Text>
        {item.rank === 1 && <Text style={styles.crownEmoji}>👑</Text>}
      </View>

      <View style={styles.leaderInfo}>
        <View style={styles.leaderNameRow}>
          <Text
            style={[styles.leaderName, isMyChild && { color: accentColor }]}
            numberOfLines={1}
          >
            {item.studentName}
          </Text>
          {isMyChild && (
            <View
              style={[styles.childTag, { backgroundColor: accentColor + "22" }]}
            >
              <Text style={[styles.childTagText, { color: accentColor }]}>
                Con
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.leaderSub}>
          {item.schoolName || "Trường học"}
        </Text>
      </View>

      <View style={styles.accuracyBox}>
        <Text style={[styles.accuracyVal, { color: accentColor }]}>
          {item.combinedAccuracyPercentage || 0}%
        </Text>
        <Text style={styles.accuracyLabel}>Chính xác</Text>
      </View>
    </FadeInView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ParentStats() {
  // Children state
  const [children, setChildren] = useState([]);
  const [childOpen, setChildOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(null);

  // Campaigns state
  const [campaigns, setCampaigns] = useState([]);
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  // Leaderboard data
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const childRes = await getParentChildren();
      if (childRes?.data) {
        setChildren(childRes.data);
        if (childRes.data.length > 0 && !selectedChildId) {
          setSelectedChildId(childRes.data[0].studentId);
        }
      }

      const campaignRes = await getCampaignInvitationHistory();
      if (campaignRes?.data) {
        // We might want to see both approved and rejected in history, 
        // but for leaderboard, only approved campaigns usually have data.
        setCampaigns(campaignRes.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Filter campaigns for the selected child. 
  // For Leaderboard, we typically only care about campaigns the child actually joined (APPROVED).
  const childCampaigns = campaigns.filter(
    (c) => c.studentId === selectedChildId && c.parentApprovalStatus === "APPROVED"
  );

  // When selected child changes, auto-select first campaign
  useEffect(() => {
    if (childCampaigns.length > 0) {
      if (!selectedCampaignId || !childCampaigns.find(c => c.campaignId === selectedCampaignId)) {
        setSelectedCampaignId(childCampaigns[0].campaignId);
      }
    } else {
      setSelectedCampaignId(null);
      setLeaderboardData([]);
    }
  }, [selectedChildId, campaigns]);

  // Fetch leaderboard when campaign changes
  useEffect(() => {
    if (selectedCampaignId) {
      const fetchLeaderboard = async () => {
        try {
          setRefreshing(true);
          const res = await getCampaignLeaderboard(selectedCampaignId);
          if (res?.data) {
            setLeaderboardData(res.data);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setRefreshing(false);
        }
      };
      fetchLeaderboard();
    }
  }, [selectedCampaignId]);

  const childItems = children.map((c) => ({
    label: c.studentFullName || c.fullName || c.studentName || "Học sinh",
    value: c.studentId,
  }));

  const campaignItems = childCampaigns.map((c) => ({
    label: c.campaignName,
    value: c.campaignId,
  }));

  const selectedChild = children.find((c) => c.studentId === selectedChildId);
  const currentCampaign = campaigns.find((c) => c.campaignId === selectedCampaignId);

  const isMyChild = (item) => item.studentId === selectedChildId;

  const accentColor = "#059669";

  return (
    <View style={styles.screen}>
      <MobileHeader title="Bảng xếp hạng" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Child selector */}
        <View style={{ zIndex: 3000 }}>
          <Text style={styles.selectorLabel}>Xem xếp hạng của bé:</Text>
          <DropDownPicker
            open={childOpen}
            value={selectedChildId}
            items={childItems}
            setOpen={(v) => {
              setChildOpen(v);
              setCampaignOpen(false);
            }}
            setValue={setSelectedChildId}
            placeholder="Chọn học sinh"
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
          />
        </View>


        {loading ? (
          <ActivityIndicator size="large" color="#059669" style={{ marginTop: 40 }} />
        ) : (
          <FadeInView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 280 }}
          >
            {/* Campaign picker */}
            <View style={{ zIndex: 2000, marginBottom: 12 }}>
              <DropDownPicker
                open={campaignOpen}
                value={selectedCampaignId}
                items={campaignItems}
                setOpen={(v) => {
                  setCampaignOpen(v);
                  setChildOpen(false);
                }}
                setValue={setSelectedCampaignId}
                placeholder="Chọn chiến dịch"
                style={[styles.picker, { borderColor: accentColor + "20" }]}
                dropDownContainerStyle={[
                  styles.pickerDropdown,
                  { borderColor: accentColor + "20" },
                ]}
                textStyle={styles.pickerText}
                selectedItemLabelStyle={{ fontWeight: "700", color: accentColor }}
                ArrowUpIconComponent={() => (
                  <Text style={[styles.pickerArrow, { color: accentColor }]}>
                    ▲
                  </Text>
                )}
                ArrowDownIconComponent={() => (
                  <Text style={[styles.pickerArrow, { color: accentColor }]}>
                    ▼
                  </Text>
                )}
              />
            </View>

            {selectedCampaignId ? (
              <>
                {/* Campaign info banner */}
                <View
                  style={[
                    styles.infoBanner,
                    { backgroundColor: accentColor + "08", borderColor: accentColor + "20" },
                  ]}
                >
                  <View
                    style={[styles.infoIconBox, { backgroundColor: accentColor + "15" }]}
                  >
                    <Leaf size={18} color={accentColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.infoTitle, { color: accentColor }]}>
                      Chiến dịch: {currentCampaign?.campaignName}
                    </Text>
                    <Text style={[styles.infoDesc, { color: "#6B7280" }]}>
                      Xếp hạng dựa trên tổng số xu và độ chính xác
                    </Text>
                  </View>
                </View>

                {/* Leaderboard */}
                {refreshing ? (
                  <ActivityIndicator size="small" color={accentColor} style={{ marginTop: 20 }} />
                ) : (
                  <View style={styles.list}>
                    {leaderboardData.length > 0 ? (
                      leaderboardData.map((item, idx) => (
                        <LeaderRow
                          key={item.studentId || idx}
                          item={item}
                          isMyChild={isMyChild(item)}
                          accentColor={accentColor}
                          showSchool={true}
                        />
                      ))
                    ) : (
                      <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Chưa có dữ liệu xếp hạng</Text>
                      </View>
                    )}
                  </View>
                )}
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {selectedChildId ? "Bé chưa tham gia chiến dịch nào" : "Vui lòng chọn học sinh"}
                </Text>
              </View>
            )}
          </FadeInView>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAFB" },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 100,
    gap: 14,
  },

  // Selector
  selectorLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
    fontWeight: "500",
  },
  picker: {
    borderRadius: 12,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    minHeight: 48,
  },
  pickerDropdown: {
    borderRadius: 12,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  pickerText: { fontSize: 14, color: "#111827" },
  pickerArrow: { fontSize: 10, color: "#9CA3AF" },

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
  tabText: { fontSize: 13, fontWeight: "500", color: "#9CA3AF" },
  tabTextActiveBlue: { color: "#2563EB", fontWeight: "700" },
  tabTextActivePurple: { color: "#7C3AED", fontWeight: "700" },

  // Info banner
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 4,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  infoTitle: { fontSize: 14, fontWeight: "700" },
  infoDesc: { fontSize: 12, marginTop: 2 },

  // List
  list: { gap: 8 },

  // Leader row
  leaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rankText: { fontSize: 12, fontWeight: "800" },

  avatarWrapper: { position: "relative" },
  avatarEmoji: { fontSize: 28 },
  crownEmoji: {
    position: "absolute",
    top: -10,
    right: -6,
    fontSize: 12,
  },

  leaderInfo: { flex: 1, gap: 2 },
  leaderNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  leaderName: { fontSize: 14, fontWeight: "700", color: "#111827" },
  childTag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  childTagText: { fontSize: 10, fontWeight: "700" },
  leaderSub: { fontSize: 11, color: "#9CA3AF" },

  accuracyBox: { alignItems: "flex-end" },
  accuracyVal: {
    fontSize: 15,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  accuracyLabel: { fontSize: 10, color: "#9CA3AF" },

  emptyContainer: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
