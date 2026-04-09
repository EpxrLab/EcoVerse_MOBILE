import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FadeInView } from "../components/FadeInView";
import { Leaf, Cloud, Trophy } from "lucide-react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { MobileHeader } from "../components/MobileHeader";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_CHILDREN = [
  { id: "1", name: "Nguyễn Minh Anh", class_name: "4A" },
  { id: "2", name: "Nguyễn Gia Bảo", class_name: "2B" },
];

const SCHOOL_CAMPAIGNS = [
  {
    id: "sc1",
    name: "Tái chế Nhựa",
    description: "Xếp hạng dựa trên độ chính xác phân loại rác",
    data: [
      { rank: 1, name: "Hoàng Anh", accuracy: 98, avatar: "🐶", class: "4A" },
      { rank: 2, name: "Thúy Linh", accuracy: 96, avatar: "🐱", class: "4B" },
      {
        rank: 3,
        name: "Nguyễn Minh Anh",
        accuracy: 95,
        avatar: "🦄",
        class: "4A",
      },
      { rank: 4, name: "Minh Đức", accuracy: 92, avatar: "🐻", class: "4A" },
      { rank: 5, name: "Thu Hà", accuracy: 89, avatar: "🐰", class: "4C" },
      { rank: 6, name: "Gia Bảo", accuracy: 85, avatar: "🦁", class: "4B" },
      { rank: 7, name: "Bảo Ngọc", accuracy: 82, avatar: "🦊", class: "4A" },
    ],
  },
  {
    id: "sc2",
    name: "Tiết kiệm Điện",
    description: "Xếp hạng dựa trên kiến thức tiết kiệm năng lượng",
    data: [
      { rank: 1, name: "Minh Đức", accuracy: 99, avatar: "🐻", class: "4A" },
      {
        rank: 2,
        name: "Nguyễn Minh Anh",
        accuracy: 97,
        avatar: "🦄",
        class: "4A",
      },
      { rank: 3, name: "Thu Hà", accuracy: 94, avatar: "🐰", class: "4C" },
      { rank: 4, name: "Hoàng Anh", accuracy: 91, avatar: "🐶", class: "4A" },
      { rank: 5, name: "Gia Bảo", accuracy: 88, avatar: "🦁", class: "4B" },
    ],
  },
];

const PARTNERSHIP_CAMPAIGNS = [
  {
    id: "pc1",
    name: "Không khói bụi",
    description: "Xếp hạng dựa trên độ chính xác thử thách không khí sạch",
    data: [
      {
        rank: 1,
        name: "Minh Đức",
        accuracy: 94,
        avatar: "🐻",
        class: "4A",
        school: "TH Lê Lợi",
      },
      {
        rank: 2,
        name: "Hoàng Anh",
        accuracy: 91,
        avatar: "🐶",
        class: "4A",
        school: "TH Lê Lợi",
      },
      {
        rank: 3,
        name: "Thu Hà",
        accuracy: 88,
        avatar: "🐰",
        class: "4C",
        school: "TH Nguyễn Du",
      },
      {
        rank: 4,
        name: "Nguyễn Minh Anh",
        accuracy: 85,
        avatar: "🦄",
        class: "4A",
        school: "TH Eco",
      },
      {
        rank: 5,
        name: "Thúy Linh",
        accuracy: 80,
        avatar: "🐱",
        class: "4B",
        school: "TH Kim Đồng",
      },
    ],
  },
  {
    id: "pc2",
    name: "Đại dương Xanh",
    description: "Xếp hạng dựa trên hiểu biết về sinh vật biển",
    data: [
      {
        rank: 1,
        name: "Thu Hà",
        accuracy: 96,
        avatar: "🐰",
        class: "4C",
        school: "TH Nguyễn Du",
      },
      {
        rank: 2,
        name: "Nguyễn Minh Anh",
        accuracy: 93,
        avatar: "🦄",
        class: "4A",
        school: "TH Eco",
      },
      {
        rank: 3,
        name: "Minh Đức",
        accuracy: 90,
        avatar: "🐻",
        class: "4A",
        school: "TH Lê Lợi",
      },
      {
        rank: 4,
        name: "Gia Bảo",
        accuracy: 87,
        avatar: "🦁",
        class: "4B",
        school: "TH Kim Đồng",
      },
    ],
  },
];

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
      transition={{ type: "timing", duration: 280, delay: item.rank * 50 }}
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
        <Text style={styles.avatarEmoji}>{item.avatar}</Text>
        {item.rank === 1 && <Text style={styles.crownEmoji}>👑</Text>}
      </View>

      <View style={styles.leaderInfo}>
        <View style={styles.leaderNameRow}>
          <Text
            style={[styles.leaderName, isMyChild && { color: accentColor }]}
            numberOfLines={1}
          >
            {item.name}
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
          Lớp {item.class}
          {showSchool && item.school ? ` • ${item.school}` : ""}
        </Text>
      </View>

      <View style={styles.accuracyBox}>
        <Text style={[styles.accuracyVal, { color: accentColor }]}>
          {item.accuracy}%
        </Text>
        <Text style={styles.accuracyLabel}>Chính xác</Text>
      </View>
    </FadeInView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ParentStats() {
  const [activeTab, setActiveTab] = useState("school");

  // Child picker
  const [childOpen, setChildOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(MOCK_CHILDREN[0].id);
  const childItems = MOCK_CHILDREN.map((c) => ({
    label: `${c.name} (${c.class_name})`,
    value: c.id,
  }));

  // School campaign picker
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState(
    SCHOOL_CAMPAIGNS[0].id,
  );
  const schoolItems = SCHOOL_CAMPAIGNS.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  // Partnership campaign picker
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState(
    PARTNERSHIP_CAMPAIGNS[0].id,
  );
  const partnerItems = PARTNERSHIP_CAMPAIGNS.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const selectedChild = MOCK_CHILDREN.find((c) => c.id === selectedChildId);
  const currentSchool = SCHOOL_CAMPAIGNS.find((c) => c.id === selectedSchoolId);
  const currentPartner = PARTNERSHIP_CAMPAIGNS.find(
    (c) => c.id === selectedPartnerId,
  );

  const isMyChild = (item) => item.name === selectedChild?.name;

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
        <View style={{ zIndex: 300 }}>
          <Text style={styles.selectorLabel}>Xem xếp hạng của bé:</Text>
          <DropDownPicker
            open={childOpen}
            value={selectedChildId}
            items={childItems}
            setOpen={(v) => {
              setChildOpen(v);
              setSchoolOpen(false);
              setPartnerOpen(false);
            }}
            setValue={setSelectedChildId}
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

        {/* Tab bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "school" && styles.tabActive]}
            onPress={() => setActiveTab("school")}
            activeOpacity={0.8}
          >
            <Leaf
              size={14}
              color={activeTab === "school" ? "#2563EB" : "#9CA3AF"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "school" && styles.tabTextActiveBlue,
              ]}
            >
              Trường Học
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "partnership" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("partnership")}
            activeOpacity={0.8}
          >
            <Cloud
              size={14}
              color={activeTab === "partnership" ? "#7C3AED" : "#9CA3AF"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "partnership" && styles.tabTextActivePurple,
              ]}
            >
              Đối Tác
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── School Tab ── */}
        {activeTab === "school" && (
          <FadeInView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 280 }}
          >
            {/* Campaign picker */}
            <View style={{ zIndex: 200, marginBottom: 12 }}>
              <DropDownPicker
                open={schoolOpen}
                value={selectedSchoolId}
                items={schoolItems}
                setOpen={(v) => {
                  setSchoolOpen(v);
                  setChildOpen(false);
                  setPartnerOpen(false);
                }}
                setValue={setSelectedSchoolId}
                style={[styles.picker, { borderColor: "#BFDBFE" }]}
                dropDownContainerStyle={[
                  styles.pickerDropdown,
                  { borderColor: "#BFDBFE" },
                ]}
                textStyle={styles.pickerText}
                selectedItemLabelStyle={{ fontWeight: "700", color: "#2563EB" }}
                ArrowUpIconComponent={() => (
                  <Text style={[styles.pickerArrow, { color: "#2563EB" }]}>
                    ▲
                  </Text>
                )}
                ArrowDownIconComponent={() => (
                  <Text style={[styles.pickerArrow, { color: "#2563EB" }]}>
                    ▼
                  </Text>
                )}
              />
            </View>

            {/* Campaign info banner */}
            <View
              style={[
                styles.infoBanner,
                { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" },
              ]}
            >
              <View
                style={[styles.infoIconBox, { backgroundColor: "#DBEAFE" }]}
              >
                <Leaf size={18} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoTitle, { color: "#1E3A8A" }]}>
                  Chiến dịch: {currentSchool?.name}
                </Text>
                <Text style={[styles.infoDesc, { color: "#3B82F6" }]}>
                  {currentSchool?.description}
                </Text>
              </View>
            </View>

            {/* Leaderboard */}
            <View style={styles.list}>
              {currentSchool?.data.map((item) => (
                <LeaderRow
                  key={item.rank}
                  item={item}
                  isMyChild={isMyChild(item)}
                  accentColor="#059669"
                  showSchool={false}
                />
              ))}
            </View>
          </FadeInView>
        )}

        {/* ── Partnership Tab ── */}
        {activeTab === "partnership" && (
          <FadeInView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 280 }}
          >
            {/* Campaign picker */}
            <View style={{ zIndex: 200, marginBottom: 12 }}>
              <DropDownPicker
                open={partnerOpen}
                value={selectedPartnerId}
                items={partnerItems}
                setOpen={(v) => {
                  setPartnerOpen(v);
                  setChildOpen(false);
                  setSchoolOpen(false);
                }}
                setValue={setSelectedPartnerId}
                style={[styles.picker, { borderColor: "#DDD6FE" }]}
                dropDownContainerStyle={[
                  styles.pickerDropdown,
                  { borderColor: "#DDD6FE" },
                ]}
                textStyle={styles.pickerText}
                selectedItemLabelStyle={{ fontWeight: "700", color: "#7C3AED" }}
                ArrowUpIconComponent={() => (
                  <Text style={[styles.pickerArrow, { color: "#7C3AED" }]}>
                    ▲
                  </Text>
                )}
                ArrowDownIconComponent={() => (
                  <Text style={[styles.pickerArrow, { color: "#7C3AED" }]}>
                    ▼
                  </Text>
                )}
              />
            </View>

            {/* Campaign info banner */}
            <View
              style={[
                styles.infoBanner,
                { backgroundColor: "#F5F3FF", borderColor: "#DDD6FE" },
              ]}
            >
              <View
                style={[styles.infoIconBox, { backgroundColor: "#EDE9FE" }]}
              >
                <Cloud size={18} color="#7C3AED" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoTitle, { color: "#4C1D95" }]}>
                  Chiến dịch: {currentPartner?.name}
                </Text>
                <Text style={[styles.infoDesc, { color: "#7C3AED" }]}>
                  {currentPartner?.description}
                </Text>
              </View>
            </View>

            {/* Leaderboard */}
            <View style={styles.list}>
              {currentPartner?.data.map((item) => (
                <LeaderRow
                  key={item.rank}
                  item={item}
                  isMyChild={isMyChild(item)}
                  accentColor="#7C3AED"
                  showSchool
                />
              ))}
            </View>
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
});
