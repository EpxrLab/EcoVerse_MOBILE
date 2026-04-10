import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "@env";
import { getNotifications, getUnreadCount } from "../services";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";

// Cấu hình để thông báo hiện lên ngay cả khi app đang mở (Foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Polyfills for STOMP
import { TextEncoder, TextDecoder } from "text-encoding";
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const stompClientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  // Yêu cầu quyền thông báo từ hệ điều hành
  const requestPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.warn("Permission to show notifications was denied");
    }
  };

  // Derive WebSocket URL from BACKEND_URL
  // If BACKEND_URL is https://api.ecoverse-system.io.vn/api
  // WS URL should be ws://api.ecoverse-system.io.vn/ws (or wss if using https)
  const getWsUrl = () => {
    let url = BACKEND_URL.replace("/api", "/ws");
    if (url.startsWith("https")) {
      return url.replace("https", "wss");
    } else if (url.startsWith("http")) {
      return url.replace("http", "ws");
    }
    return url;
  };

  const fetchInitialData = async () => {
    try {
      const [list, count] = await Promise.all([
        getNotifications(),
        getUnreadCount()
      ]);
      if (list) setNotifications(list);
      if (count !== undefined) setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching initial notifications:", error);
    }
  };

  const connectWebSocket = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      console.log("No token found, skipping WebSocket connection");
      return;
    }

    const client = new Client({
      brokerURL: getWsUrl(),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log("STOMP: " + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        setIsConnected(true);
        console.log("Connected to WebSocket");

        // Subscribe to user-specific notifications
        // The backend uses /user destination prefix
        client.subscribe("/user/queue/notifications", async (message) => {
          const newNotification = JSON.parse(message.body);
          console.log("New notification received:", newNotification);
          
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // 1. Hiện Popup trong ứng dụng (Toast)
          Toast.show({
            type: "info",
            text1: "Thông báo mới",
            text2: newNotification.message || "Bạn có một thông báo mới",
            position: "top",
            visibilityTime: 4000,
          });

          // 2. Hiện Thông báo hệ thống (Level 1)
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "EcoVerse 🌿",
              body: newNotification.message || "Bạn có một thông báo mới",
              data: { data: newNotification },
            },
            trigger: null,
          });
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
      onDisconnect: () => {
        setIsConnected(false);
        console.log("Disconnected from WebSocket");
      },
    });

    client.activate();
    stompClientRef.current = client;
  };

  const disconnectWebSocket = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
  };

  useEffect(() => {
    requestPermissions();
    fetchInitialData();
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const refreshNotifications = () => {
    fetchInitialData();
  };

  const value = {
    notifications,
    unreadCount,
    isConnected,
    setUnreadCount,
    setNotifications,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
