import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FadeInView } from "../components/FadeInView";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  GraduationCap,
  School,
  BookOpen,
  Hash,
  Star,
} from "lucide-react-native";
import { getAuthenticatedParent } from "../services";

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, iconColor, label, value, delay }) {
  return (
    <FadeInView
      from={{ opacity: 0, translateX: -10 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 300, delay }}
      style={styles.infoRow}
    >
      <View style={[styles.infoIconBox, { backgroundColor: iconColor + "18" }]}>
        <Icon size={17} color={iconColor} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "—"}</Text>
      </View>
    </FadeInView>
  );
}

// ─── Child Card ───────────────────────────────────────────────────────────────
function ChildProfileCard({ child, index }) {
  return (
    <FadeInView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 320, delay: 400 + index * 80 }}
      style={styles.childCard}
    >
      {/* Avatar initial */}
      <View style={styles.childAvatar}>
        <Text style={styles.childAvatarText}>{child.fullName.charAt(0)}</Text>
      </View>

      <View style={styles.childInfo}>
        <Text style={styles.childName}>{child.fullName}</Text>

        <View style={styles.childMetaRow}>
          <View style={styles.childMetaChip}>
            <GraduationCap size={11} color="#2563EB" />
            <Text style={styles.childMetaText}>
              {child.gradeLevel} · {child.className}
            </Text>
          </View>
        </View>

        <View style={styles.childDetailsRow}>
          <View style={styles.childDetail}>
            <School size={11} color="#9CA3AF" />
            <Text style={styles.childDetailText} numberOfLines={1}>
              {child.schoolName}
            </Text>
          </View>
          <View style={styles.childDetail}>
            <Hash size={11} color="#9CA3AF" />
            <Text style={styles.childDetailText}>{child.studentCode}</Text>
          </View>
        </View>
      </View>
    </FadeInView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ParentProfile() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchParentProfile = async () => {
    try {
      const res = await getAuthenticatedParent();
      setProfile(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchParentProfile();
  }, []);

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
          <Text style={styles.backText}>Cài đặt</Text>
        </TouchableOpacity>

        {!isLoading && profile && (
          <FadeInView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400, delay: 100 }}
            style={styles.heroContent}
          >
            {/* Avatar */}
            <View style={styles.heroAvatar}>
              <Text style={styles.heroAvatarInitial}>
                {profile?.fullName?.charAt(0)}
              </Text>
            </View>

            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>{profile?.fullName}</Text>
              <Text style={styles.heroPhone}>{profile?.phoneNumber}</Text>
              {profile?.isFirstLogin && (
                <View style={styles.firstLoginBadge}>
                  <Star size={10} color="#FCD34D" />
                  <Text style={styles.firstLoginText}>Đăng nhập lần đầu</Text>
                </View>
              )}
            </View>
          </FadeInView>
        )}
      </View>

      {/* ── Content ── */}
      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#059669" />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Personal info section */}
          <FadeInView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 300, delay: 150 }}
          >
            <Text style={styles.sectionLabel}>THÔNG TIN CÁ NHÂN</Text>
            <View style={styles.card}>
              <InfoRow
                icon={User}
                iconColor="#059669"
                label="Họ và tên"
                value={profile?.fullName}
                delay={180}
              />
              <View style={styles.divider} />
              <InfoRow
                icon={Phone}
                iconColor="#2563EB"
                label="Số điện thoại"
                value={profile?.phoneNumber}
                delay={230}
              />
              <View style={styles.divider} />
              <InfoRow
                icon={Mail}
                iconColor="#7C3AED"
                label="Email"
                value={profile?.email}
                delay={280}
              />
            </View>
          </FadeInView>

          {/* Account section */}
          <FadeInView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 300, delay: 300 }}
          >
            <Text style={styles.sectionLabel}>TÀI KHOẢN</Text>
            <View style={styles.card}>
              <InfoRow
                icon={Hash}
                iconColor="#EA580C"
                label="Mã tài khoản"
                value={profile?.id?.slice(0, 8)?.toUpperCase() + "..."}
                delay={320}
              />
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View
                  style={[styles.infoIconBox, { backgroundColor: "#F0FDF4" }]}
                >
                  <Star size={17} color="#059669" />
                </View>
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Trạng thái</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: profile?.isFirstLogin ? "#D97706" : "#059669" },
                    ]}
                  >
                    {profile?.isFirstLogin
                      ? "Chưa hoàn thiện hồ sơ"
                      : "Hoạt động"}
                  </Text>
                </View>
              </View>
            </View>
          </FadeInView>

          {/* Children section */}
          <FadeInView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 300, delay: 360 }}
          >
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionLabel}>CON CỦA TÔI</Text>
              <View style={styles.childCountBadge}>
                <Text style={styles.childCountText}>
                  {profile?.children?.length}
                </Text>
              </View>
            </View>

            {profile?.children?.length === 0 ? (
              <View style={styles.emptyChildren}>
                <BookOpen size={28} color="#D1D5DB" />
                <Text style={styles.emptyChildrenText}>
                  Chưa có học sinh liên kết
                </Text>
              </View>
            ) : (
              <View style={styles.childList}>
                {profile?.children?.map((child, idx) => (
                  <ChildProfileCard key={child.id} child={child} index={idx} />
                ))}
              </View>
            )}
          </FadeInView>

        </ScrollView>
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAFB" },

  // Hero
  heroHeader: {
    backgroundColor: "#059669",
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
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
  heroAvatarInitial: { fontSize: 30, fontWeight: "800", color: "#FFFFFF" },
  heroInfo: { flex: 1, gap: 5 },
  heroName: { fontSize: 20, fontWeight: "800", color: "#FFFFFF" },
  heroPhone: { fontSize: 13, color: "rgba(255,255,255,0.75)" },
  firstLoginBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  firstLoginText: { fontSize: 11, fontWeight: "600", color: "#FCD34D" },

  // Loading
  loadingBox: { flex: 1, alignItems: "center", justifyContent: "center" },

  // Scroll
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
    gap: 20,
  },

  // Section labels
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingLeft: 2,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  childCountBadge: {
    backgroundColor: "#059669",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  childCountText: { fontSize: 11, fontWeight: "800", color: "#FFFFFF" },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginLeft: 64 },

  // Info row
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoText: { flex: 1, gap: 2 },
  infoLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "500" },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#111827" },

  // Child card
  childList: { gap: 10 },
  childCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
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
  childAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D1FAE5",
    borderWidth: 2,
    borderColor: "#A7F3D0",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  childAvatarText: { fontSize: 20, fontWeight: "800", color: "#059669" },
  childInfo: { flex: 1, gap: 5 },
  childName: { fontSize: 15, fontWeight: "700", color: "#111827" },
  childMetaRow: { flexDirection: "row" },
  childMetaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  childMetaText: { fontSize: 11, fontWeight: "600", color: "#2563EB" },
  childDetailsRow: { gap: 4 },
  childDetail: { flexDirection: "row", alignItems: "center", gap: 5 },
  childDetailText: { fontSize: 11, color: "#6B7280", flex: 1 },

  // Empty children
  emptyChildren: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  emptyChildrenText: { fontSize: 13, color: "#9CA3AF" },

  // Edit button
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: "#A7F3D0",
  },
  editBtnText: { fontSize: 14, fontWeight: "700", color: "#059669" },
});
