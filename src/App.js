import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Home, Gift, Flag, Trophy, Settings } from "lucide-react-native";
import { View, Text } from "react-native";

import ParentAuth from "./features/auth/screen/ParentAuth";
import ParentHome from "./screens/ParentHome";
import ParentRewards from "./screens/ParentRewards";
import ParentCampaigns from "./screens/ParentCampaigns";
import ParentStats from "./screens/ParentStats";
import ParentSettings from "./screens/ParentSettings";
import ParentChildren from "./screens/ParentChildren";
import ParentChildDetail from "./screens/ParentChildDetail";
import ParentProfile from "./screens/ParentProfile";
import { ParentAllRewards } from "./screens/ParentAllRewards";
import Toast from "react-native-toast-message";

const PlaceholderScreen = ({ route }) => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <Text style={{ fontSize: 16, color: "#6B7280" }}>{route.name}</Text>
  </View>
);

const Tab = createBottomTabNavigator();

function ParentTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#34A853",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarStyle: {
          backgroundColor: "rgba(255,255,255,0.97)",
          borderTopColor: "rgba(0,0,0,0.06)",
          borderTopWidth: 1,
          paddingTop: 8,
          height: 75,
          paddingBottom: 15,
        },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            ParentHome: Home,
            ParentRewards: Gift,
            ParentCampaigns: Flag,
            ParentStats: Trophy,
            ParentSettings: Settings,
          };
          const Icon = icons[route.name];
          return Icon ? (
            <Icon size={size} color={color} strokeWidth={1.8} />
          ) : null;
        },
      })}
    >
      <Tab.Screen
        name="ParentHome"
        component={ParentHome}
        options={{ tabBarLabel: "Trang chủ" }}
      />
      <Tab.Screen
        name="ParentRewards"
        component={ParentRewards}
        options={{ tabBarLabel: "Quà tặng" }}
      />
      <Tab.Screen
        name="ParentCampaigns"
        component={ParentCampaigns}
        options={{ tabBarLabel: "Chiến dịch" }}
      />
      <Tab.Screen
        name="ParentStats"
        component={ParentStats}
        options={{ tabBarLabel: "Xếp hạng" }}
      />
      <Tab.Screen
        name="ParentSettings"
        component={ParentSettings}
        options={{ tabBarLabel: "Cài đặt" }}
      />
    </Tab.Navigator>
  );
}

// ─── Root Stack Navigator ────────────────────────────────────────────────────
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="ParentAuth"
          screenOptions={{ headerShown: false, animation: "fade" }}
        >
          <Stack.Screen name="ParentAuth" component={ParentAuth} />

          <Stack.Screen name="ParentHome" component={ParentTabs} />

          {/* Detail screens — no tabs, full screen */}
          <Stack.Screen
            name="ParentChildDetail"
            component={ParentChildDetail}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="ParentChildren"
            component={ParentChildren}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen name="ParentProfile" component={ParentProfile} />
          <Stack.Screen name="ParentAllRewards" component={ParentAllRewards} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}
