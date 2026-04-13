import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { useNotifications } from "../context/NotificationContext";
import { ChevronLeft, Bell, CheckCircle2, Clock } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { markAsRead, markAllAsRead } from "../services";

const formatTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

    return date.toLocaleDateString("vi-VN");
};

export default function ParentNotifications() {
    const navigation = useNavigation();
    const {
        notifications,
        unreadCount,
        setNotifications,
        setUnreadCount,
        refreshNotifications,
    } = useNotifications();

    useEffect(() => {
        refreshNotifications();
    }, []);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId ? { ...n, status: "READ" } : n
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, status: "READ" })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.notificationItem, item.status === "UNREAD" && styles.unreadItem]}
            onPress={() => item.status === "UNREAD" && handleMarkAsRead(item.id)}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, item.status === "UNREAD" && styles.unreadIconContainer]}>
                <Bell size={20} color={item.status === "UNREAD" ? "#34A853" : "#9CA3AF"} />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.itemHeader}>
                    <Text style={[styles.message, item.status === "UNREAD" && styles.unreadMessage]}>
                        {item.message}
                    </Text>
                    {item.status === "UNREAD" && <View style={styles.unreadDot} />}
                </View>
                <View style={styles.itemFooter}>
                    <Clock size={12} color="#9CA3AF" />
                    <Text style={styles.timestamp}>
                        {formatTime(item.createdAt)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <ChevronLeft size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.title}>Thông báo</Text>
                {unreadCount > 0 ? (
                    <TouchableOpacity
                        style={styles.markAllButton}
                        onPress={handleMarkAllAsRead}
                    >
                        <CheckCircle2 size={20} color="#34A853" />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 40 }} />
                )}
            </View>

            {notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconCircle}>
                        <Bell size={48} color="#D1D5DB" />
                    </View>
                    <Text style={styles.emptyTitle}>Chưa có thông báo nào</Text>
                    <Text style={styles.emptySub}>
                        Chúng tôi sẽ thông báo cho bạn khi có tin nhắn mới
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F3F4F6",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    markAllButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ECFDF5",
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    notificationItem: {
        flexDirection: "row",
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#F3F4F6",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    unreadItem: {
        borderColor: "rgba(52,168,83,0.15)",
        backgroundColor: "#F0FDF4",
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    unreadIconContainer: {
        backgroundColor: "#DCFCE7",
    },
    contentContainer: {
        flex: 1,
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 4,
    },
    message: {
        flex: 1,
        fontSize: 14,
        color: "#374151",
        lineHeight: 20,
        marginRight: 8,
    },
    unreadMessage: {
        color: "#111827",
        fontWeight: "600",
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#34A853",
        marginTop: 6,
    },
    itemFooter: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    timestamp: {
        fontSize: 12,
        color: "#9CA3AF",
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#374151",
        marginBottom: 8,
    },
    emptySub: {
        fontSize: 14,
        color: "#9CA3AF",
        textAlign: "center",
        lineHeight: 20,
    },
});
