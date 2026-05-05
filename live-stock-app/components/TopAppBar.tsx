import { MaterialIcons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
  TOP_BAR_BG,
  TOP_BAR_CONTENT_HEIGHT,
} from "../constants";

interface TopAppBarProps {
  /** Label shown in the bar. Defaults to 'Saylani Livestock' */
  label?: string;
  /** When true: shows ← back button and centers label (inner screens) */
  showBack?: boolean;
  /** Optional fallback path if canGoBack is false */
  backPath?: string;
}

export function TopAppBar({
  label = "Saylani Livestock ",
  showBack = false,
  backPath,
}: TopAppBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "AD";

  const handleBack = () => {
    if (backPath) {
      // Prioritize explicit parent path for "Up" navigation
      router.replace(backPath as any);
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.replace("/");
    }
  };

  /* ── Inner page bar: ← back | label centered ── */
  if (showBack) {
    return (
      <View
        style={{
          paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 24),
          backgroundColor: TOP_BAR_BG,
          borderBottomWidth: 0.5,
          borderBottomColor: "rgba(0,0,0,0.05)",
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            },
            android: { elevation: 2 },
            default: {},
          }),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: TOP_BAR_CONTENT_HEIGHT,
            paddingHorizontal: 16,
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={handleBack}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.8)",
              borderWidth: 1,
              borderColor: "rgba(0,77,36,0.1)",
            }}
          >
            <MaterialIcons name="arrow-back" size={18} color="#006a35" />
          </TouchableOpacity>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 20,
              fontWeight: "900",
              letterSpacing: 0.3,
              color: "#006a35",
              fontFamily: "Poppins_900Black",
              ...Platform.select({
                ios: {
                  shadowColor: "#004d24",
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                  shadowOffset: { width: 0, height: 1 },
                },
                android: { elevation: 3 },
                default: {},
              }),
            }}
          >
            {label}
          </Text>
          <View style={{ width: 36, height: 36 }} />
        </View>
      </View>
    );
  }

  /* ── Home / root bar: avatar | app name | notifications ── */
  return (
    <View
      style={{
        paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 24),
        backgroundColor: TOP_BAR_BG,
        borderBottomWidth: 0.5,
        borderBottomColor: "rgba(0,0,0,0.05)",
        ...Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          },
          android: { elevation: 2 },
          default: {},
        }),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          height: TOP_BAR_CONTENT_HEIGHT + 8,
          width: "100%",
          marginTop: 2,
          position: "relative",
        }}
      >
        {/* Hamburger Menu - Left */}
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={{
            position: "absolute",
            left: 24,
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.5)",
            borderWidth: 1,
            borderColor: "rgba(0,77,36,0.1)",
          }}
        >
          <MaterialIcons name="menu" size={20} color="#006a35" />
        </TouchableOpacity>

        {/* Label/Name - Center */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            router.push("/");
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "900",
              letterSpacing: 0.5,
              color: "#006a35",
              fontFamily: "Poppins_900Black",
              ...Platform.select({
                ios: {
                  shadowColor: "#004d24",
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                  shadowOffset: { width: 0, height: 1 },
                },
                android: { elevation: 3 },
                default: {},
              }),
            }}
          >
            {label}
          </Text>
        </TouchableOpacity>

        {/* Avatar - Right: shows real user initials */}
        <Pressable
          onPress={() => {
            router.push("/profile");
          }}
          hitSlop={10}
          style={{
            position: "absolute",
            right: 24,
            width: 36,
            height: 36,
            borderRadius: 18,
            overflow: "hidden",
            borderWidth: 2,
            borderColor: "rgba(0,125,58,0.25)",
            backgroundColor: "#006a35",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "900", fontSize: 13, letterSpacing: 0.5 }}>
            {initials}
          </Text>
        </Pressable>
         
      </View>
    </View>
  );
}
