import React, { useState } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { FadeInView } from "../components/FadeInView";
import { ArrowLeft, Lock, ShieldCheck, CheckCircle, Info } from "lucide-react-native";
import { changePassword } from "../services";
import Toast from "react-native-toast-message";

export default function ChangePassword() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const isForce = route.params?.isFirstLogin || false;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập đầy đủ thông tin",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu xác nhận không khớp",
      });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(newPassword)) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu yếu",
        text2: "Phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu quá ngắn",
        text2: "Mật khẩu mới phải từ 6 ký tự",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = { oldPassword, newPassword, confirmPassword };
      const res = await changePassword(payload);
      
      if (res && res.status === 200) {
        Toast.show({
          type: "success",
          text1: "Đổi mật khẩu thành công! 🎉",
        });
        if (isForce) {
            navigation.replace("ParentHome", { refreshed: true });
        } else {
            navigation.goBack();
        }
      } else {
        Toast.show({
          type: "error",
          text1: res?.message || "Đổi mật khẩu thất bại",
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Đã có lỗi xảy ra. Vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          {!isForce && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft size={24} color="#111827" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
            {isForce ? "Cần đổi mật khẩu" : "Đổi mật khẩu"}
          </Text>
          {!isForce ? <View style={{ width: 40 }} /> : null}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {isForce && (
            <FadeInView style={styles.infoBox}>
              <Info size={20} color="#0369A1" />
              <Text style={styles.infoText}>
                Đây là lần đầu bạn đăng nhập. Vì lý do bảo mật, vui lòng đổi mật khẩu mặc định trước khi tiếp tục.
              </Text>
            </FadeInView>
          )}

          <FadeInView delay={200} style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu cũ</Text>
              <View style={styles.inputWrap}>
                <Lock size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu cũ"
                  secureTextEntry
                  value={oldPassword}
                  onChangeText={setOldPassword}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu mới</Text>
              <View style={styles.inputWrap}>
                <ShieldCheck size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Chữ hoa, thường, số, ký tự đặc biệt"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>
              <Text style={styles.inputHint}>
                Mật khẩu phải bao gồm chữ HOA, thường, số và ký tự (!@#$%^&*)
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
              <View style={styles.inputWrap}>
                <ShieldCheck size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập lại mật khẩu mới"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, isLoading && styles.disabledBtn]}
              onPress={handleChangePassword}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <CheckCircle size={20} color="#fff" />
                  <Text style={styles.submitBtnText}>Xác nhận thay đổi</Text>
                </>
              )}
            </TouchableOpacity>
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
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827", flex: 1, textAlign: "center" },
  backBtn: { padding: 8 },
  scrollContent: { padding: 20 },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#F0F9FF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BAE6FD",
    marginBottom: 24,
    gap: 12,
  },
  infoText: { flex: 1, fontSize: 13, color: "#0369A1", lineHeight: 18 },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 48, fontSize: 15, color: "#111827" },
  inputHint: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 6,
    marginLeft: 4,
    fontStyle: "italic",
  },
  submitBtn: {
    backgroundColor: "#059669",
    height: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
    shadowColor: "#059669",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  disabledBtn: { backgroundColor: "#9CA3AF", elevation: 0 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
