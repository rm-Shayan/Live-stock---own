import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useState, useCallback, useRef } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  View,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { fetchUsers, blockUser } from "../../../store/userSlice";
import { BottomNavBar } from "../../../components/BottomNavBar";
import { TopAppBar } from "../../../components/TopAppBar";
import { UserCardSkeleton, SkeletonBox } from "../../../components/SkeletonLoader";
import {
  FAB_BOTTOM_OFFSET,
  SCROLL_BOTTOM_PADDING,
  SCROLL_TOP_OFFSET,
} from "../../../constants";

const ROLE_TABS = ["All", "Manager", "Staff"];

const ROLE_STYLE: Record<string, { bg: string; text: string; icon: string }> = {
  admin:   { bg: "#fff3e0", text: "#e65100", icon: "admin-panel-settings" },
  manager: { bg: "#e8f5e9", text: "#1b5e20", icon: "manage-accounts" },
  staff:   { bg: "#e3f2fd", text: "#0d47a1", icon: "person" },
};

export default function UserManagementScreen() {
  const insets = useSafeAreaInsets();
  const router  = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { users, loading } = useSelector((state: RootState) => state.users);
  const [blockingId, setBlockingId]   = useState<string | null>(null);
  const [activeTab, setActiveTab]     = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchUsers());
    }, [dispatch])
  );

  const handleToggleBlock = async (user: any) => {
    if (blockingId) return; // prevent double-tap
    setBlockingId(user._id);
    try {
      const res = await dispatch(blockUser(user._id));
      if (!blockUser.fulfilled.match(res)) {
        Alert.alert("Error", (res.payload as string) || "Operation failed");
      }
    } finally {
      setBlockingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (u.role === "admin") return false; // never show admins in the list
    const matchesTab    = activeTab === "All" || u.role.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalUsers   = users.filter(u => u.role !== "admin").length;
  const blockedCount = users.filter((u) => u.isBlocked && u.role !== "admin").length;
  const staffCount   = users.filter((u) => u.role === "staff").length;
  const adminCount   = users.filter((u) => u.role === "admin").length;

  return (
    <View className="flex-1 bg-[#f4faf6]">
      <TopAppBar label="User Management" showBack backPath="/" />

      <ScrollView
        contentContainerStyle={{
          paddingTop: SCROLL_TOP_OFFSET,
          paddingBottom: SCROLL_BOTTOM_PADDING + 80,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => dispatch(fetchUsers())} />
        }
      >
        {/* ── Header ── */}
        <View className="mt-4 mb-6">
          <Text className="font-headline text-3xl font-extrabold text-on-surface tracking-tight leading-tight">
            Team Members
          </Text>
          <Text className="font-body text-outline text-sm mt-1">
            Manage access and roles across your organisation.
          </Text>
        </View>

        {/* ── Stats Row ── */}
        <View className="flex-row gap-3 mb-6">
          {loading && users.length === 0 ? (
            <>
              <View className="flex-1"><SkeletonBox height={90} borderRadius={20} /></View>
              <View className="flex-1"><SkeletonBox height={90} borderRadius={20} /></View>
              <View className="flex-1"><SkeletonBox height={90} borderRadius={20} /></View>
            </>
          ) : (
            <>
              {/* Total */}
              <View
                className="flex-1 rounded-[1.25rem] bg-white items-center justify-center py-4"
                style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { height: 2, width: 0 } }}
              >
                <Text className="text-2xl font-extrabold text-on-surface font-headline">{totalUsers}</Text>
                <Text className="text-[10px] font-bold uppercase tracking-widest text-outline font-body mt-0.5">Total</Text>
              </View>
              {/* Staff */}
              <View
                className="flex-1 rounded-[1.25rem] bg-secondary-container items-center justify-center py-4"
                style={{ elevation: 2, shadowColor: "#006a35", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { height: 2, width: 0 } }}
              >
                <Text className="text-2xl font-extrabold text-primary font-headline">{staffCount}</Text>
                <Text className="text-[10px] font-bold uppercase tracking-widest text-primary/70 font-body mt-0.5">Staff</Text>
              </View>
              {/* Blocked */}
              <View
                className="flex-1 rounded-[1.25rem] bg-red-50 items-center justify-center py-4"
                style={{ elevation: 2, shadowColor: "#ef4444", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { height: 2, width: 0 } }}
              >
                <Text className="text-2xl font-extrabold text-red-500 font-headline">{blockedCount}</Text>
                <Text className="text-[10px] font-bold uppercase tracking-widest text-red-400 font-body mt-0.5">Blocked</Text>
              </View>
            </>
          )}
        </View>

        {/* ── Search ── */}
        <View
          className="flex-row items-center bg-white rounded-2xl px-4 mb-5"
          style={{ height: 52, elevation: 1, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { height: 2, width: 0 } }}
        >
          <MaterialIcons name="search" size={20} color="#6f7a6e" />
          <TextInput
            style={{ flex: 1, marginLeft: 10, fontSize: 14, color: "#1a2e1a", fontFamily: "Inter_400Regular" }}
            placeholder="Search by name or email..."
            placeholderTextColor="#9eab9d"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialIcons name="close" size={18} color="#9eab9d" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Filter Chips ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ gap: 8, paddingRight: 4 }}
        >
          {ROLE_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 8,
                borderRadius: 50,
                backgroundColor: activeTab === tab ? "#006a35" : "#ffffff",
                borderWidth: 1,
                borderColor: activeTab === tab ? "#006a35" : "#d1e8d6",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: activeTab === tab ? "#ffffff" : "#3a5c3d",
                  fontFamily: "Inter_700Bold",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── User Cards ── */}
        {loading && users.length === 0 ? (
          <>
            <UserCardSkeleton />
            <UserCardSkeleton />
            <UserCardSkeleton />
          </>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const roleStyle = ROLE_STYLE[user.role] || ROLE_STYLE.staff;
            return (
              <View
                key={user._id}
                className="bg-white rounded-[1.5rem] mb-4 overflow-hidden"
                style={{
                  elevation: 2,
                  shadowColor: "#000",
                  shadowOpacity: 0.04,
                  shadowRadius: 10,
                  shadowOffset: { height: 3, width: 0 },
                  opacity: user.isBlocked ? 0.85 : 1,
                }}
              >
                {/* Blocked Banner */}
                {user.isBlocked && (
                  <View className="bg-red-500 px-4 py-1.5 flex-row items-center gap-2">
                    <MaterialIcons name="block" size={12} color="white" />
                    <Text className="text-white text-[10px] font-bold uppercase tracking-widest font-body">
                      Account Blocked — Login Disabled
                    </Text>
                  </View>
                )}

                <View className="p-5">
                  {/* Top Row: Avatar + Info + Edit */}
                  <View className="flex-row items-center mb-4">
                    {/* Avatar */}
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 16,
                        backgroundColor: user.isBlocked ? "#fee2e2" : "#d1fae5",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 14,
                        flexShrink: 0,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "900",
                          color: user.isBlocked ? "#ef4444" : "#006a35",
                          fontFamily: "Poppins_900Black",
                        }}
                      >
                        {user.username.substring(0, 2).toUpperCase()}
                      </Text>
                    </View>

                    {/* Name + Email */}
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                          color: user.isBlocked ? "#9ca3af" : "#1a2e1a",
                          fontFamily: "Inter_700Bold",
                        }}
                      >
                        {user.username}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 12,
                          color: "#6f7a6e",
                          fontFamily: "Inter_400Regular",
                          marginTop: 2,
                        }}
                      >
                        {user.email}
                      </Text>
                    </View>

                    {/* Edit Button */}
                    <TouchableOpacity
                      onPress={() => router.push(`/(admin)/users/${user._id}`)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        backgroundColor: "#e8f5e9",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 8,
                        flexShrink: 0,
                      }}
                    >
                      <MaterialIcons name="edit" size={18} color="#006a35" />
                    </TouchableOpacity>
                  </View>

                  {/* Bottom Row: Role Badge + Branch + Block Toggle */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingTop: 12,
                      borderTopWidth: 1,
                      borderTopColor: "#f0f4f1",
                    }}
                  >
                    {/* Role Badge */}
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 50,
                        backgroundColor: roleStyle.bg,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        flexShrink: 0,
                      }}
                    >
                      <MaterialIcons name={roleStyle.icon as any} size={11} color={roleStyle.text} />
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "800",
                          color: roleStyle.text,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          fontFamily: "Inter_700Bold",
                        }}
                      >
                        {user.role}
                      </Text>
                    </View>

                    {/* Branch */}
                    {user.branchId && (
                      <Text
                        numberOfLines={1}
                        style={{
                          flex: 1,
                          fontSize: 11,
                          color: "#6f7a6e",
                          fontFamily: "Inter_400Regular",
                          marginLeft: 8,
                        }}
                      >
                        📍 {typeof user.branchId === "object" ? user.branchId.name : "Assigned"}
                      </Text>
                    )}

                    {/* Spacer */}
                    {!user.branchId && <View style={{ flex: 1 }} />}

                    {/* Block Toggle */}
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      {blockingId === user._id ? (
                        <ActivityIndicator size="small" color="#006a35" />
                      ) : (
                        <>
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: "700",
                              color: user.isBlocked ? "#ef4444" : "#16a34a",
                              fontFamily: "Inter_700Bold",
                            }}
                          >
                            {user.isBlocked ? "Blocked" : "Active"}
                          </Text>
                          <Switch
                            value={!user.isBlocked}
                            onValueChange={() => handleToggleBlock(user)}
                            trackColor={{ false: "#fecaca", true: "#bbf7d0" }}
                            thumbColor={user.isBlocked ? "#ef4444" : "#16a34a"}
                            ios_backgroundColor="#fecaca"
                            disabled={blockingId !== null}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                          />
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View className="items-center py-20">
            <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-4">
              <MaterialIcons name="person-off" size={36} color="#006a35" />
            </View>
            <Text className="text-lg font-bold text-on-surface font-headline mb-1">No Users Found</Text>
            <Text className="text-sm text-outline font-body text-center px-8">
              No team members match the current filter.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: insets.bottom + FAB_BOTTOM_OFFSET,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          overflow: "hidden",
          elevation: 8,
          shadowColor: "#006a35",
          shadowOpacity: 0.35,
          shadowRadius: 12,
          shadowOffset: { height: 6, width: 0 },
        }}
        onPress={() => router.push("/(admin)/users/add")}
      >
        <LinearGradient
          colors={["#006a35", "#059669"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <MaterialIcons name="person-add" size={26} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <BottomNavBar />
    </View>
  );
}
