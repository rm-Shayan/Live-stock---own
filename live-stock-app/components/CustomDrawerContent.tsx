import { MaterialIcons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { logoutUser } from "../store/authSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CustomDrawerContentProps = any;

const MENU_ITEMS = [
  { label: "Dashboard", route: "/", icon: "dashboard" as const },
  {
    label: "Batch Management",
    route: "/batches",
    icon: "inventory-2" as const,
  },
  {
    label: "User Management",
    route: "/(admin)/users",
    icon: "people" as const,
  },
  {
    label: "Allocation List",
    route: "/allocations",
    icon: "call-split" as const,
  },
  {
    label: "Branch Management",
    route: "/(admin)/branches",
    icon: "domain" as const,
  },
  {
    label: "Slaughter Log",
    route: "/slaughter",
    icon: "content-cut" as const,
  },
  { label: "Settings", route: "/settings", icon: "settings" as const },
  {
    label: "Help & Support",
    route: "/settings/help",
    icon: "help-outline" as const,
  },
];

export function CustomDrawerContent(props: CustomDrawerContentProps) {
  const router = useRouter();
  const currentPath = usePathname();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "AD";

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      router.replace("/login");
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <LinearGradient
        colors={["#e0f2e9", "#ffffff"]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, height: 300, opacity: 0.5 }}
      />
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
          <Pressable
            onPress={() => router.push("/profile")}
            style={{ alignItems: "center" }}
          >
            <View
              style={{
                width: 65,
                height: 65,
                borderRadius: 32.5,
                backgroundColor: "#006a35",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 3,
                borderColor: "#ffffff",
                elevation: 8,
                shadowColor: "#006a35",
                shadowOpacity: 0.3,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 5 },
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "900", letterSpacing: 1 }}>
                {initials}
              </Text>
            </View>
          </Pressable>
          <Text
            style={{
              fontSize: 19,
              fontWeight: "900",
              color: "#004d24",
              fontFamily: "Manrope_700Bold",
              letterSpacing: -0.5,
            }}
          >
            {user?.username || "Guest User"}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#64748b",
              marginTop: 2,
              fontWeight: "600",
              fontFamily: "Inter_500Medium",
            }}
          >
            {user?.email || "No email provided"}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={{ paddingHorizontal: 16 }}>
          {MENU_ITEMS.map((item) => {
            const isActive = currentPath === item.route;
            return (
              <TouchableOpacity
                key={item.route}
                activeOpacity={0.7}
                onPress={() => handleNavigation(item.route)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 14,
                  marginBottom: 6,
                  backgroundColor: isActive
                    ? "#006a35"
                    : "transparent",
                  elevation: isActive ? 4 : 0,
                  shadowColor: "#006a35",
                  shadowOpacity: isActive ? 0.2 : 0,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                }}
              >
                <MaterialIcons
                  name={item.icon}
                  size={22}
                  color={isActive ? "#ffffff" : "#64748b"}
                />
                <Text
                  style={{
                    marginLeft: 16,
                    fontSize: 15,
                    fontWeight: isActive ? "700" : "600",
                    color: isActive ? "#ffffff" : "#334155",
                    fontFamily: isActive
                      ? "Inter_600SemiBold"
                      : "Inter_500Medium",
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Footer Section (Logout) */}
      <View
        style={{
          padding: 24,
          paddingBottom: Math.max(insets.bottom + 20, 24),
          borderTopWidth: 1,
          borderTopColor: "rgba(0,0,0,0.05)",
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={22} color="#dc2626" />
          <Text
            style={{
              marginLeft: 16,
              fontSize: 15,
              fontWeight: "600",
              color: "#dc2626",
              fontFamily: "Inter_600SemiBold",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
