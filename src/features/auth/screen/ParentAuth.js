import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import { Phone, Lock, Eye, EyeOff } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

const MOCK_PHONE = "0901234567";
const MOCK_PASSWORD = "123";

// ─── Floating leaf shapes ────────────────────────────────────────────────────
function FloatingOrb({ size, color, style, delay = 0 }) {
  return (
    <MotiView
      from={{ translateY: 0, opacity: 0.6 }}
      animate={{ translateY: -18, opacity: 1 }}
      transition={{
        type: "timing",
        duration: 3200,
        delay,
        loop: true,
        repeatReverse: true,
      }}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          position: "absolute",
        },
        style,
      ]}
    />
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message, type, visible }) {
  return (
    <MotiView
      animate={{
        opacity: visible ? 1 : 0,
        translateY: visible ? 0 : -20,
        scale: visible ? 1 : 0.9,
      }}
      transition={{ type: "spring", damping: 18 }}
      style={[
        styles.toast,
        type === "success" ? styles.toastSuccess : styles.toastError,
      ]}
      pointerEvents="none"
    >
      <Text style={styles.toastIcon}>{type === "success" ? "✓" : "✕"}</Text>
      <Text style={styles.toastText}>{message}</Text>
    </MotiView>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function ParentAuth() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      showToast("Vui lòng nhập đầy đủ thông tin", "error");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);

    if (phone === MOCK_PHONE && password === MOCK_PASSWORD) {
      showToast("Chào mừng trở lại! 🌿", "success");
      setTimeout(() => navigation.navigate("ParentHome"), 1100);
    } else {
      showToast("Thông tin đăng nhập không đúng", "error");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        {/* ── Background layer ── */}
        <View style={styles.heroBg} />
        <View style={styles.heroOverlay} />

        {/* Floating orbs */}
        <FloatingOrb
          size={180}
          color="rgba(52,211,153,0.12)"
          style={{ top: -40, left: -50 }}
          delay={0}
        />
        <FloatingOrb
          size={120}
          color="rgba(16,185,129,0.1)"
          style={{ top: 80, right: -30 }}
          delay={600}
        />
        <FloatingOrb
          size={80}
          color="rgba(110,231,183,0.15)"
          style={{ top: 200, left: 40 }}
          delay={1200}
        />
        <FloatingOrb
          size={60}
          color="rgba(52,211,153,0.2)"
          style={{ top: height * 0.35, right: 60 }}
          delay={900}
        />

        {/* Toast */}
        <View style={styles.toastWrapper} pointerEvents="none">
          <Toast
            message={toast.message}
            type={toast.type}
            visible={toast.visible}
          />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { minHeight: height - insets.top },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero section ── */}
          <View style={styles.heroSection}>
            {/* Logo mark */}
            <MotiView
              from={{ opacity: 0, scale: 0.5, rotate: "-20deg" }}
              animate={{ opacity: 1, scale: 1, rotate: "0deg" }}
              transition={{ type: "spring", damping: 12, delay: 100 }}
              style={styles.logoMark}
            >
              <View style={styles.logoLeafOuter}>
                <View style={styles.logoLeafInner}>
                  <Text style={styles.logoEmoji}>🌿</Text>
                </View>
              </View>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500, delay: 280 }}
            >
              <Text style={styles.brandName}>EcoVerse</Text>
              <Text style={styles.brandTagline}>
                Hành trình xanh của gia đình bạn
              </Text>
            </MotiView>
          </View>

          {/* ── Form panel ── */}
          <MotiView
            from={{ opacity: 0, translateY: 60 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 20, delay: 400 }}
            style={styles.panel}
          >
            {/* Panel handle */}
            <View style={styles.panelHandle} />

            <Text style={styles.panelTitle}>Đăng nhập</Text>
            <Text style={styles.panelSub}>Dành cho Phụ huynh</Text>

            {/* Phone field */}
            <MotiView
              animate={{ borderColor: phoneFocused ? "#10B981" : "#E5E7EB" }}
              transition={{ type: "timing", duration: 180 }}
              style={styles.fieldWrap}
            >
              <View
                style={[
                  styles.fieldIconBox,
                  phoneFocused && styles.fieldIconBoxActive,
                ]}
              >
                <Phone size={16} color={phoneFocused ? "#10B981" : "#9CA3AF"} />
              </View>
              <TextInput
                style={styles.fieldInput}
                placeholder="Số điện thoại"
                placeholderTextColor="#C0C9D4"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={11}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
              />
            </MotiView>

            {/* Password field */}
            <MotiView
              animate={{ borderColor: passFocused ? "#10B981" : "#E5E7EB" }}
              transition={{ type: "timing", duration: 180 }}
              style={styles.fieldWrap}
            >
              <View
                style={[
                  styles.fieldIconBox,
                  passFocused && styles.fieldIconBoxActive,
                ]}
              >
                <Lock size={16} color={passFocused ? "#10B981" : "#9CA3AF"} />
              </View>
              <TextInput
                style={[styles.fieldInput, { flex: 1 }]}
                placeholder="Mật khẩu"
                placeholderTextColor="#C0C9D4"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.eyeBtn}
              >
                {showPassword ? (
                  <EyeOff size={17} color="#9CA3AF" />
                ) : (
                  <Eye size={17} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </MotiView>

            {/* Forgot */}
            <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Login button */}
            <MotiView
              animate={{
                scale: isLoading ? 0.96 : 1,
                opacity: isLoading ? 0.85 : 1,
              }}
              transition={{ type: "timing", duration: 140 }}
            >
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={handleLogin}
                activeOpacity={0.88}
                disabled={isLoading}
              >
                {/* Shimmer stripe */}
                <View style={styles.btnShimmer} />
                <Text style={styles.loginBtnText}>
                  {isLoading ? "Đang xác thực..." : "Đăng nhập"}
                </Text>
              </TouchableOpacity>
            </MotiView>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social-style hint */}
            <TouchableOpacity style={styles.registerBtn} activeOpacity={0.7}>
              <Text style={styles.registerText}>
                Chưa có tài khoản?{" "}
                <Text style={styles.registerBold}>Liên hệ nhà trường</Text>
              </Text>
            </TouchableOpacity>

            {/* Demo hint */}
            <View style={styles.demoBox}>
              <Text style={styles.demoLabel}>🔑 Demo</Text>
              <Text style={styles.demoVal}>0901234567 · 123</Text>
            </View>
          </MotiView>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#064E3B",
  },

  // Background
  heroBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.52,
    backgroundColor: "#064E3B",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.52,
    backgroundColor: "transparent",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  // Toast
  toastWrapper: {
    position: "absolute",
    top: 56,
    left: 20,
    right: 20,
    zIndex: 999,
    alignItems: "center",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 10,
  },
  toastSuccess: { backgroundColor: "#059669" },
  toastError: { backgroundColor: "#DC2626" },
  toastIcon: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Scroll
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },

  // Hero
  heroSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
    gap: 20,
  },
  logoMark: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoLeafOuter: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
  },
  logoLeafInner: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  logoEmoji: {
    fontSize: 30,
  },
  brandName: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -1,
  },
  brandTagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginTop: 4,
    fontWeight: "400",
    letterSpacing: 0.2,
  },

  // Panel
  panel: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 12,
  },
  panelHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 24,
  },
  panelTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#064E3B",
    letterSpacing: -0.5,
  },
  panelSub: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 28,
  },

  // Fields
  fieldWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingRight: 14,
    marginBottom: 14,
    backgroundColor: "#FAFAFA",
    overflow: "hidden",
  },
  fieldIconBox: {
    width: 48,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    marginRight: 12,
  },
  fieldIconBoxActive: {
    backgroundColor: "#ECFDF5",
    borderRightColor: "#10B981",
  },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    paddingVertical: 14,
  },
  eyeBtn: {
    paddingLeft: 8,
  },

  // Forgot
  forgotRow: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: 2,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#10B981",
  },

  // Login button
  loginBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  btnShimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "55%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderTopRightRadius: 60,
    borderBottomRightRadius: 60,
  },
  loginBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 24,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },

  // Register
  registerBtn: {
    alignItems: "center",
    paddingVertical: 4,
  },
  registerText: {
    fontSize: 13,
    color: "#6B7280",
  },
  registerBold: {
    color: "#059669",
    fontWeight: "700",
  },

  // Demo
  demoBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#F0FDF4",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  demoLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  demoVal: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
    letterSpacing: 0.3,
  },
});
