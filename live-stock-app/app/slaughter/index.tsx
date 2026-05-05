import React, { useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchSlaughters, deleteSlaughter } from "../../store/slaughterSlice";
import { BottomNavBar } from "../../components/BottomNavBar";
import { TopAppBar } from "../../components/TopAppBar";
import { CardSkeleton, SkeletonBox } from "../../components/SkeletonLoader";
import {
  SCROLL_TOP_OFFSET,
  SCROLL_BOTTOM_PADDING,
  FAB_BOTTOM_OFFSET,
} from "../../constants";

export default function SlaughterLogScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { slaughters, loading } = useSelector((state: RootState) => state.slaughter);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchSlaughters());
    }, [dispatch])
  );

  const todayStr = new Date().toDateString();

  const totalToday = slaughters
    .filter((s) => new Date(s.date).toDateString() === todayStr)
    .reduce((sum, s) => sum + s.count, 0);

  const activeBranches = [...new Set(slaughters.map((s) => s.branchId))].length;
  const { user } = useSelector((state: RootState) => state.auth);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this slaughter record? This will adjust the inventory accordingly.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            const res = await dispatch(deleteSlaughter(id));
            if (deleteSlaughter.fulfilled.match(res)) {
              dispatch(fetchSlaughters());
              Alert.alert("Deleted", "Slaughter record removed successfully");
            } else {
              Alert.alert("Error", (res.payload as string) || "Delete failed");
            }
          } 
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#f8faf9]">
      <TopAppBar />

      <ScrollView
        contentContainerStyle={{
          paddingTop: SCROLL_TOP_OFFSET,
          paddingBottom: SCROLL_BOTTOM_PADDING + 20,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchSlaughters())}
            colors={["#006a35"]}
            tintColor="#006a35"
          />
        }
      >
        {/* Header */}
        <View className="mb-6 flex-row justify-between items-end">
          <View>
            <Text className="text-[#006a35] font-bold text-xs uppercase tracking-widest mb-1 font-body">
              Operations
            </Text>
            <Text className="text-4xl font-black text-[#006a35] tracking-tight leading-tight font-headline">
              Slaughter Log
            </Text>
          </View>
          <TouchableOpacity className="flex-row items-center gap-1">
            <MaterialIcons name="file-download" size={20} color="#006a35" />
            <Text className="text-sm font-bold text-[#006a35] font-body">Export</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View className="flex-row gap-4 mb-8">
          {loading && slaughters.length === 0 ? (
            <>
              <SkeletonBox width="48%" height={140} borderRadius={24} />
              <SkeletonBox width="48%" height={140} borderRadius={24} />
            </>
          ) : (
            <>
              <View
                className="flex-1 bg-white rounded-[2rem] p-5 items-center border border-[#006a35]/10"
                style={{ elevation: 4, shadowColor: "#006a35", shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { height: 6, width: 0 } }}
              >
                <LinearGradient
                  colors={["#006a35", "#059669"]}
                  className="w-14 h-14 rounded-2xl items-center justify-center mb-3 shadow-sm"
                >
                  <MaterialIcons name="content-cut" size={26} color="white" />
                </LinearGradient>
                <Text className="text-4xl font-black text-[#006a35] font-headline tracking-tighter">
                  {totalToday}
                </Text>
                <Text className="text-xs text-[#064e3b]/70 font-bold font-body mt-1 uppercase tracking-wider">
                  Today's Count
                </Text>
              </View>
              <View
                className="flex-1 bg-white rounded-[2rem] p-5 items-center border border-amber-500/10"
                style={{ elevation: 4, shadowColor: "#f59e0b", shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { height: 6, width: 0 } }}
              >
                <LinearGradient
                  colors={["#f59e0b", "#d97706"]}
                  className="w-14 h-14 rounded-2xl items-center justify-center mb-3 shadow-sm"
                >
                  <MaterialIcons name="domain" size={26} color="white" />
                </LinearGradient>
                <Text className="text-4xl font-black text-amber-600 font-headline tracking-tighter">
                  {activeBranches}
                </Text>
                <Text className="text-xs text-amber-700/70 font-bold font-body mt-1 uppercase tracking-wider">
                  Active Branches
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Log List Section */}
        <View className="mb-4">
          <Text className="text-xl font-extrabold text-[#004d24] tracking-tight font-headline mb-4">
            Recent Entries
          </Text>

          {loading && slaughters.length === 0 ? (
            <>
              <CardSkeleton rows={2} />
              <CardSkeleton rows={2} />
              <CardSkeleton rows={2} />
            </>
          ) : slaughters.length === 0 ? (
            <View className="items-center py-16 bg-white rounded-[2rem] border border-[#006a35]/5">
              <MaterialIcons name="content-cut" size={40} color="#94a3b8" />
              <Text className="text-on-surface-variant font-body mt-3 font-medium">
                No slaughter records yet.
              </Text>
            </View>
          ) : (
            <View
              className="bg-white rounded-[2rem] overflow-hidden border border-[#00612c]/5"
              style={{ elevation: 4, shadowColor: "#00612c", shadowOpacity: 0.08, shadowRadius: 20, shadowOffset: { height: 8, width: 0 } }}
            >
              {slaughters.map((log, index) => (
                <View
                  key={log._id}
                  className={`p-5 ${index !== slaughters.length - 1 ? "border-b border-[#00000008]" : ""}`}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-3">
                      <View className="w-10 h-10 rounded-full bg-[#e0f2e9] items-center justify-center">
                        <MaterialIcons name="check-circle" size={20} color="#006a35" />
                      </View>
                      <View>
                        <Text className="font-bold text-sm text-on-surface font-body">
                          {log.count} Heads Processed
                        </Text>
                        <Text className="text-xs text-outline font-medium font-body mt-0.5">
                          {new Date(log.date).toDateString() === todayStr
                            ? "Today"
                            : new Date(log.date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <View className="items-end">
                        <Text className="text-xs font-bold text-outline font-body">
                          {new Date(log.date).toLocaleDateString()}
                        </Text>
                        <Text className="text-[10px] text-outline font-medium font-body mt-0.5">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Text>
                      </View>
                      {user?.role === 'admin' && (
                        <TouchableOpacity 
                          onPress={() => handleDelete(log._id)}
                          className="bg-red-50 p-2 rounded-full ml-1"
                        >
                          <MaterialIcons name="delete-outline" size={16} color="#ef4444" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between bg-[#f8f9ff] px-3 py-2 rounded-xl">
                    <View className="flex-row items-center gap-2">
                      <View className="w-5 h-5 rounded-full bg-slate-200" />
                      <Text className="text-xs font-medium text-on-surface-variant font-body">
                        Branch ID: {log.branchId?.slice(-6).toUpperCase() || "N/A"}
                      </Text>
                    </View>
                    <View className="bg-primary/10 px-2 py-0.5 rounded-full">
                      <Text className="text-[10px] font-bold text-primary uppercase tracking-wider font-body">
                        Verified
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB - Add Slaughter Entry */}
      <TouchableOpacity
        onPress={() => router.push("/slaughter/add" as any)}
        activeOpacity={0.85}
        style={{
          shadowColor: "#006a35",
          shadowOpacity: 0.4,
          shadowRadius: 16,
          shadowOffset: { height: 6, width: 0 },
          elevation: 8,
          position: "absolute",
          bottom: insets.bottom + FAB_BOTTOM_OFFSET,
          right: 20,
          zIndex: 40,
          borderRadius: 30,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={["#006a35", "#059669"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: 60, height: 60, alignItems: "center", justifyContent: "center" }}
        >
          <MaterialIcons name="add" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <BottomNavBar />
    </View>
  );
}
