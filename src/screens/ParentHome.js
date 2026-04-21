
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MobileHeader } from "../components/MobileHeader";
import { ChildCard } from "../components/ChildCard";
import { getParentChildren, getAuthenticatedParent } from "../services";

export default function ParentHome() {
  const navigation = useNavigation();
  const [children, setChildren] = React.useState([]);

  React.useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      // Check for first login
      const profile = await getAuthenticatedParent();
      if (profile?.data?.isFirstLogin) {
        navigation.replace("ChangePassword", { isFirstLogin: true });
        return;
      }

      const res = await getParentChildren();
      if (res && res.data) {
        setChildren(res.data);
      }
    } catch (error) {
      console.log("Error fetching children:", error);
    }
  };

  const handleSelectChild = (child) => {
    navigation.navigate("ParentChildDetail", { childId: child.studentId });
  };

  return (
    <View style={styles.screen}>
      <MobileHeader title="EcoVerse Parent" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Children Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Con của tôi</Text>
          </View>

          <View style={styles.cardList}>
            {children.slice(0, 2).map((child) => (
              <ChildCard
                key={child.studentId}
                child={child}
                onSelect={handleSelectChild}
              />
            ))}
          </View>
        </View>


      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#34A853",
  },
  cardList: {
    gap: 12,
  },
});
