import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { logoutUser } from "../../store/authSlice";
import {
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomNavBar } from "../../components/BottomNavBar";
import { TopAppBar as AppTopBar } from "../../components/TopAppBar";
import {
  SCROLL_BOTTOM_PADDING,
  SCROLL_TOP_OFFSET,
} from "../../constants";
import api from "../../utils/api";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [profile, setProfile] = useState<any>(null);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);

  useEffect(() => {
    // Fetch full profile with branch populated
    api.get("/profile").then((res) => {
      if (res.data?.data) setProfile(res.data.data);
    }).catch(() => {});
  }, []);

  const displayUser = profile || user;
  const initials = displayUser?.username
    ? displayUser.username.slice(0, 2).toUpperCase()
    : "US";

  const ROLE_COLOR: Record<string, string> = {
    admin: "#e65100",
    manager: "#1b5e20",
    staff: "#0d47a1",
  };
  const roleColor = ROLE_COLOR[displayUser?.role] || "#374151";

  const infoRows = [
    { icon: "mail-outline", label: "Email", value: displayUser?.email || "—" },
    { icon: "admin-panel-settings", label: "Role", value: displayUser?.role ? displayUser.role.charAt(0).toUpperCase() + displayUser.role.slice(1) : "—" },
    { icon: "account-tree", label: "Branch", value: profile?.branchId?.name || displayUser?.branchId?.name || "Head Office" },
  ];

  const menuItems = [
    { icon: "person-outline", label: "Edit Profile", sub: "Update name and email", path: "/profile/edit" },
    { icon: "lock-outline", label: "Change Password", sub: "Security & authentication", path: "/settings/change-password" },
  ];

  return (
    <View className="flex-1 bg-[#f4faf6]">
      <AppTopBar />

      <ScrollView
        contentContainerStyle={{
          paddingTop: SCROLL_TOP_OFFSET,
          paddingBottom: SCROLL_BOTTOM_PADDING + 60,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile Hero Card ── */}
        <View
          className="bg-white rounded-[2rem] overflow-hidden mb-6 mt-4"
          style={{ elevation: 3, shadowColor: "#006a35", shadowOpacity: 0.07, shadowRadius: 16, shadowOffset: { height: 4, width: 0 } }}
        >
          {/* Green header strip */}
          <LinearGradient colors={["#006a35", "#00944a"]} style={{ paddingTop: 32, paddingBottom: 48, alignItems: "center" }}>
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 28,
                backgroundColor: "rgba(255,255,255,0.25)",
                borderWidth: 3,
                borderColor: "rgba(255,255,255,0.6)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 32, fontWeight: "900", color: "#fff", fontFamily: "Poppins_900Black" }}>
                {initials}
              </Text>
            </View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff", fontFamily: "Poppins_900Black", marginBottom: 4 }}>
              {displayUser?.username || "User"}
            </Text>
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 4,
                borderRadius: 50,
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#fff", textTransform: "uppercase", letterSpacing: 1 }}>
                {displayUser?.role || "Staff"}
              </Text>
            </View>
          </LinearGradient>

          {/* Info rows offset up */}
          <View style={{ marginTop: -24, marginHorizontal: 20, backgroundColor: "#fff", borderRadius: 20, paddingVertical: 8, elevation: 2, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { height: 2, width: 0 } }}>
            {infoRows.map((row, i) => (
              <View
                key={row.label}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderBottomWidth: i < infoRows.length - 1 ? 1 : 0,
                  borderBottomColor: "#f0f4f1",
                }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "#f0faf4", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                  <MaterialIcons name={row.icon as any} size={18} color="#006a35" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10, fontWeight: "700", color: "#9eab9d", textTransform: "uppercase", letterSpacing: 0.6 }}>{row.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#1a2e1a", marginTop: 1 }} numberOfLines={1}>{row.value}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 24 }} />
        </View>

        {/* ── Analytics Banner ── */}
        <TouchableOpacity
          onPress={() => router.push("/reports")}
          activeOpacity={0.9}
          className="mb-6"
        >
          <LinearGradient
            colors={["#005c28", "#00944a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-[1.5rem] p-6 flex-row items-center"
            style={{ elevation: 4, shadowColor: "#006a35", shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { height: 4, width: 0 } }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff", marginBottom: 4, fontFamily: "Poppins_900Black" }}>Saylani Live Stock</Text>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontFamily: "Inter_400Regular" }}>Advanced management suite active</Text>
            </View>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
              <MaterialIcons name="analytics" size={24} color="white" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── Account Settings ── */}
        <Text style={{ fontSize: 12, fontWeight: "700", color: "#6f7a6e", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginLeft: 4 }}>
          Account Settings
        </Text>
        <View
          className="bg-white rounded-[1.5rem] mb-6 overflow-hidden"
          style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, shadowOffset: { height: 2, width: 0 } }}
        >
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.path}
              onPress={() => router.push(item.path as any)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                borderBottomWidth: i < menuItems.length - 1 ? 1 : 0,
                borderBottomColor: "#f0f4f1",
              }}
              activeOpacity={0.7}
            >
              <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: "#f0faf4", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
                <MaterialIcons name={item.icon as any} size={20} color="#006a35" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#1a2e1a" }}>{item.label}</Text>
                <Text style={{ fontSize: 12, color: "#6f7a6e", marginTop: 2 }}>{item.sub}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#c4d4c4" />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Preferences ── */}
        <Text style={{ fontSize: 12, fontWeight: "700", color: "#6f7a6e", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginLeft: 4 }}>
          Preferences
        </Text>
        <View
          className="bg-white rounded-[1.5rem] mb-8 overflow-hidden"
          style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, shadowOffset: { height: 2, width: 0 } }}
        >
          {[
            { label: "Push Notifications", sub: "Real-time stock alerts", value: pushEnabled, onChange: setPushEnabled },
            { label: "Critical Alerts Only", sub: "Silence non-emergency", value: criticalOnly, onChange: setCriticalOnly },
          ].map((pref, i, arr) => (
            <View
              key={pref.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                borderBottomColor: "#f0f4f1",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#1a2e1a" }}>{pref.label}</Text>
                <Text style={{ fontSize: 12, color: "#6f7a6e", marginTop: 2 }}>{pref.sub}</Text>
              </View>
              <Switch
                value={pref.value}
                onValueChange={pref.onChange}
                trackColor={{ false: "#dfe3e1", true: "#bbf7d0" }}
                thumbColor={pref.value ? "#16a34a" : "#f4f4f4"}
              />
            </View>
          ))}
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity
          onPress={() => dispatch(logoutUser()).then(() => router.replace("/login"))}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            paddingVertical: 16,
            borderRadius: 50,
            backgroundColor: "#fee2e2",
          }}
          activeOpacity={0.8}
        >
          <MaterialIcons name="logout" size={20} color="#dc2626" />
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#dc2626" }}>Logout from Account</Text>
        </TouchableOpacity>

        <Text style={{ textAlign: "center", fontSize: 11, color: "#9eab9d", marginTop: 16, fontStyle: "italic" }}>
          Application Version 2.4.0 (Stable Build)
        </Text>
      </ScrollView>

      <BottomNavBar />
    </View>
  );
}
