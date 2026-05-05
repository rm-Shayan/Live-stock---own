import { MaterialIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BOTTOM_NAV_CONTENT_HEIGHT } from "../constants";

export function BottomNavBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: "dashboard", route: "/" },
    { name: "Batches", icon: "inventory-2", route: "/batches" },
    { name: "Branches", icon: "store", route: "/branches" },
    { name: "Reports", icon: "analytics", route: "/reports" },
    { name: "Profile", icon: "person", route: "/profile" },
  ] as const;

  const ACTIVE_COLOR = "#006a35"; // Premium Emerald theme
  const INACTIVE_COLOR = "#a1a1aa"; // Soft grey

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        zIndex: 50,
        backgroundColor: "#ffffff",
        paddingBottom: Math.max(insets.bottom, 8), // Added slight padding for better spacing
        borderTopLeftRadius: 32, // Smoother corners
        borderTopRightRadius: 32,
        ...Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: -10 },
          },
          android: { elevation: 20 },
          default: {
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: -10 },
          },
        }),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around", // Better spacing distribution
          alignItems: "center",
          paddingHorizontal: 16,
          height: BOTTOM_NAV_CONTENT_HEIGHT,
          width: "100%",
        }}
      >
        {navItems.map((item) => {
          // Check if current path starts with the route (better for nested routes)
          const isActive = pathname === item.route;

          return (
            <TouchableOpacity
              key={item.name}
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 8,
                flex: 1,
              }}
              onPress={() => router.push(item.route)}
              activeOpacity={0.6}
            >
              {/* Icon Container - No background, just icon */}
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 4,
                }}
              >
                <MaterialIcons
                  name={item.icon as any}
                  size={26} // Slightly larger for better visibility
                  color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                />
                
                {/* Optional: Active Dot Indicator - modern look */}
                {isActive && (
                  <View 
                    style={{
                      position: 'absolute',
                      top: -10,
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: ACTIVE_COLOR
                    }} 
                  />
                )}
              </View>

              <Text
                style={{
                  fontSize: 11,
                  fontWeight: isActive ? "700" : "500",
                  color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR,
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}