import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FadeInView } from "../../../components/FadeInView";
import { ArrowLeft, Mail, Lock, Key, CheckCircle } from "lucide-react-native";
import { forgotPassword, verifyResetPassword } from "../../../services";

export default function ForgotPassword() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRequestOTP = async () => {
    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Email không hợp lệ");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const res = await forgotPassword(email.trim());
      // Backend handles it as success if it sends the email, even if status is not 0
      if (res && (res.status === 200 || res.message?.includes("gửi OTP"))) {
        setStep(2);
      } else {
        setError(res?.message || "Không thể gửi mã OTP. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng kiểm tra lại kết nối.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim() || !newPassword.trim()) {
      setError("Vui lòng nhập đầy đủ OTP và mật khẩu mới");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(newPassword)) {
      setError("Mật khẩu phải bao gồm cả chữ hoa, chữ thường, số và ký tự đặc biệt");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const payload = {
        email: email.trim(),
        password: newPassword,
        otp: otp.trim(),
      };
      const res = await verifyResetPassword(payload);
      if (res && res.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigation.navigate("ParentAuth");
        }, 2000);
      } else {
        setError(res?.message || "Xác thực thất bại. Vui lòng kiểm tra lại OTP.");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <FadeInView style={styles.successContainer}>
          <CheckCircle size={80} color="#059669" />
          <Text style={styles.successTitle}>Thành công!</Text>
          <Text style={styles.successSub}>Mật khẩu của bạn đã được thay đổi.</Text>
          <Text style={styles.redirectText}>Đang chuyển về trang đăng nhập...</Text>
        </FadeInView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => step === 1 ? navigation.goBack() : setStep(1)}
            style={styles.backBtn}
          >
            <ArrowLeft size={24} color="#064E3B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quên mật khẩu</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <FadeInView style={styles.card}>
            <View style={styles.iconCircle}>
              {step === 1 ? (
                <Mail size={32} color="#059669" />
              ) : (
                <Key size={32} color="#059669" />
              )}
            </View>

            <Text style={styles.title}>
              {step === 1 ? "Nhập Email của bạn" : "Xác thực & Thay đổi"}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1
                ? "Chúng tôi sẽ gửi mã OTP đến email này nếu nó tồn tại trong hệ thống để bạn có thể đặt lại mật khẩu."
                : `Vui lòng nhập mã OTP đã được gửi đến ${email} và mật khẩu mới.`}
            </Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {step === 1 ? (
              <View style={styles.inputContainer}>
                <View style={styles.inputWrap}>
                  <Mail size={18} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="example@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.primaryBtn, isLoading && styles.disabledBtn]}
                  onPress={handleRequestOTP}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>Gửi mã OTP</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <View style={styles.inputWrap}>
                  <Key size={18} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mã OTP"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.inputWrap}>
                  <Lock size={18} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu mới (Hoa, thường, số, @#...)"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                  />
                </View>
                <Text style={styles.hintText}>
                  Yêu cầu: Chữ hoa, chữ thường, số và ký tự đặc biệt
                </Text>
                <TouchableOpacity
                  style={[styles.primaryBtn, isLoading && styles.disabledBtn]}
                  onPress={handleResetPassword}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>Đặt lại mật khẩu</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </FadeInView>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#064E3B" },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scrollContent: { padding: 24, paddingTop: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "800", color: "#111827", marginBottom: 10 },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  hintText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 4,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginBottom: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  inputContainer: { width: "100%", gap: 14 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: 52, fontSize: 15, color: "#111827" },
  primaryBtn: {
    backgroundColor: "#059669",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#059669",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: { backgroundColor: "#9CA3AF" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  successContainer: { alignItems: "center", padding: 40 },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginTop: 20,
  },
  successSub: { fontSize: 15, color: "#6B7280", marginTop: 8, textAlign: "center" },
  redirectText: { fontSize: 13, color: "#9CA3AF", marginTop: 40 },
});
