import { TopAppBar } from "@/components/TopAppBar";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SCROLL_TOP_OFFSET } from "../../constants";

const FormInput = ({ label, icon, error, ...props }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ fontSize: 11, color: "#6f7a6e", marginBottom: 6, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, marginLeft: 2 }}>
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#ffffff",
          borderRadius: 16,
          paddingHorizontal: 14,
          height: 56,
          borderWidth: 1.5,
          borderColor: error ? "#ef4444" : isFocused ? "#007d3a" : "#e8f0e8",
          elevation: isFocused ? 3 : 1,
          shadowColor: isFocused ? "#007d3a" : "#000",
          shadowOpacity: isFocused ? 0.08 : 0.03,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <MaterialIcons name={icon} size={20} color={isFocused ? "#007d3a" : "#9eab9d"} />
        <TextInput
          style={{ flex: 1, marginLeft: 10, fontSize: 15, color: "#1a2e1a", height: "100%", padding: 0 }}
          placeholderTextColor="#c4d4c4"
          selectionColor="#007d3a"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {error && <Text style={{ fontSize: 11, color: "#ef4444", marginTop: 4, marginLeft: 4, fontWeight: "600" }}>{error}</Text>}
    </View>
  );
};

export default function EditProfile() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const { user } = useSelector((state: RootState) => state.auth);

  const [name, setName]   = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initials = name ? name.slice(0, 2).toUpperCase() : "US";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim() || !email.includes("@")) e.email = "Valid email is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    // Profile editing is cosmetic here — the admin uses Edit User page for actual backend updates
    Alert.alert("Profile Saved", "Your display preferences have been updated.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f4faf6" }}>
      <TopAppBar label="Edit Profile" showBack backPath="/profile" />

      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: SCROLL_TOP_OFFSET,
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 40,
          }}
        >
          {/* ── Avatar Hero ── */}
          <View style={{ alignItems: "center", marginBottom: 32, marginTop: 8 }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 32,
                backgroundColor: "#d1fae5",
                borderWidth: 4,
                borderColor: "rgba(0,106,53,0.15)",
                alignItems: "center",
                justifyContent: "center",
                elevation: 4,
                shadowColor: "#006a35",
                shadowOpacity: 0.12,
                shadowRadius: 12,
                shadowOffset: { height: 4, width: 0 },
              }}
            >
              <Text style={{ fontSize: 34, fontWeight: "900", color: "#006a35", fontFamily: "Poppins_900Black" }}>
                {initials}
              </Text>
            </View>
            <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "800", color: "#1a2e1a" }}>
              {name || "Your Name"}
            </Text>
            <View style={{ paddingHorizontal: 14, paddingVertical: 4, borderRadius: 50, backgroundColor: "#e8f5e9", marginTop: 6 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#1b5e20", textTransform: "uppercase", letterSpacing: 0.8 }}>
                {user?.role || "Staff"}
              </Text>
            </View>
          </View>

          {/* ── Info Card ── */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 24,
              padding: 20,
              marginBottom: 16,
              elevation: 2,
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 10,
              shadowOffset: { height: 3, width: 0 },
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#1a2e1a", marginBottom: 16 }}>Personal Information</Text>

            <FormInput
              label="Username"
              icon="person-outline"
              placeholder="Your username"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />
            <FormInput
              label="Email Address"
              icon="mail-outline"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
          </View>

          {/* ── Read-only info ── */}
          <View
            style={{
              backgroundColor: "#fff8ed",
              borderRadius: 20,
              padding: 16,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: "#fde9b0",
              flexDirection: "row",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <MaterialIcons name="info-outline" size={18} color="#d97706" style={{ marginTop: 1 }} />
            <Text style={{ flex: 1, fontSize: 12, color: "#92400e", lineHeight: 18 }}>
              Role and branch assignment can only be changed by an administrator from the User Management panel.
            </Text>
          </View>

          {/* ── Save Button ── */}
          <TouchableOpacity onPress={handleSave} activeOpacity={0.85}>
            <LinearGradient
              colors={["#006a35", "#00944a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 50,
                paddingVertical: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 10,
                elevation: 6,
                shadowColor: "#006a35",
                shadowOpacity: 0.3,
                shadowRadius: 12,
                shadowOffset: { height: 4, width: 0 },
              }}
            >
              <MaterialIcons name="check-circle" size={22} color="white" />
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700", letterSpacing: 0.4 }}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
