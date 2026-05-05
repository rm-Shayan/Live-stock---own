import { TopAppBar } from "@/components/TopAppBar";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useEffect, useCallback } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { fetchBranches, deleteBranch } from "../../../store/branchSlice";
import { BottomNavBar } from "../../../components/BottomNavBar";
import { CardSkeleton, StatCardSkeleton } from "../../../components/SkeletonLoader";
import {
  SCROLL_TOP_OFFSET,
  SCROLL_BOTTOM_PADDING,
  FAB_BOTTOM_OFFSET,
} from "../../../constants";

export default function BranchListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { branches, loading, error } = useSelector((state: RootState) => state.branches);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchBranches());
    }, [dispatch])
  );

  const handleDelete = (branch: any) => {
    Alert.alert(
      "Delete Branch",
      `Are you sure you want to delete "${branch.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteBranch(branch._id)).then((action: any) => {
              if (action.error) {
                Alert.alert("Error", action.payload || "Failed to delete branch");
              } else {
                Alert.alert("Success", "Branch deleted successfully");
              }
            });
          },
        },
      ]
    );
  };

  const handleEdit = (branch: any) => {
    router.push({
      pathname: "/(admin)/branches/edit",
      params: { id: branch._id, data: JSON.stringify(branch) },
    });
  };

  return (
    <View className="flex-1 bg-[#f0fbf3]">
      <TopAppBar />

      <ScrollView
        contentContainerStyle={{
          paddingTop: SCROLL_TOP_OFFSET,
          paddingBottom: SCROLL_BOTTOM_PADDING,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchBranches())}
            colors={["#006a35"]}
            tintColor="#006a35"
          />
        }
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-secondary font-semibold text-xs uppercase tracking-widest mb-1 font-body">
            Branch Management
          </Text>
          <Text className="text-3xl font-extrabold text-on-surface tracking-tight leading-tight font-headline">
            All Branches
          </Text>
        </View>

        {/* Summary Stats Row */}
        <View className="flex-row gap-3 mb-6">
          {loading && branches.length === 0 ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <View
                className="flex-1 bg-white rounded-3xl p-4 items-center"
                style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { height: 2, width: 0 } }}
              >
                <View className="w-10 h-10 rounded-2xl bg-primary/10 items-center justify-center mb-2">
                  <MaterialIcons name="account-tree" size={20} color="#00612c" />
                </View>
                <Text className="text-2xl font-black text-primary font-headline">{branches.length}</Text>
                <Text className="text-xs text-outline font-medium font-body mt-0.5">Total</Text>
              </View>
              <View
                className="flex-1 bg-white rounded-3xl p-4 items-center"
                style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { height: 2, width: 0 } }}
              >
                <View className="w-10 h-10 rounded-2xl bg-green-100 items-center justify-center mb-2">
                  <MaterialIcons name="check-circle" size={20} color="#16a34a" />
                </View>
                <Text className="text-2xl font-black text-green-600 font-headline">{branches.length}</Text>
                <Text className="text-xs text-outline font-medium font-body mt-0.5">Active</Text>
              </View>
              <View
                className="flex-1 bg-white rounded-3xl p-4 items-center"
                style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { height: 2, width: 0 } }}
              >
                <View className="w-10 h-10 rounded-2xl bg-amber-100 items-center justify-center mb-2">
                  <MaterialIcons name="view-compact" size={20} color="#d97706" />
                </View>
                <Text className="text-2xl font-black text-amber-600 font-headline">-</Text>
                <Text className="text-xs text-outline font-medium font-body mt-0.5">Stats</Text>
              </View>
            </>
          )}
        </View>

        {/* Branch Cards */}
        <View className="space-y-4">
          {loading && branches.length === 0 ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : branches.length > 0 ? (
            branches.map((branch) => (
              <View
                key={branch._id}
                className="bg-white rounded-[2rem] overflow-hidden mb-4"
                style={{ elevation: 3, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { height: 3, width: 0 } }}
              >
                <View className="p-5">
                  {/* Card Top */}
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-row items-center gap-3 flex-1">
                      <LinearGradient
                        colors={["#00612c", "#007d3a"]}
                        className="w-12 h-12 rounded-2xl items-center justify-center"
                      >
                        <MaterialIcons name="location-on" size={22} color="white" />
                      </LinearGradient>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-on-surface font-headline" numberOfLines={1}>
                          {branch.name}
                        </Text>
                        <Text className="text-xs text-outline font-medium font-body mt-0.5" numberOfLines={1}>
                          {branch.location}
                        </Text>
                      </View>
                    </View>
                    <View className="px-3 py-1 rounded-full bg-green-100">
                      <Text className="text-[10px] font-bold uppercase tracking-wider text-green-600">
                        Active
                      </Text>
                    </View>
                  </View>

                  {/* Info Row */}
                  <View className="flex-row gap-4 mb-4 bg-[#f0fbf3] rounded-2xl p-3">
                    <View className="flex-row items-center gap-1.5 flex-1">
                      <MaterialIcons name="straighten" size={14} color="#6f7a6e" />
                      <Text className="text-xs text-outline font-medium font-body">
                        Capacity: {branch.capacity}
                      </Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleEdit(branch)}
                      className="flex-1 flex-row items-center justify-center gap-2 py-2.5 rounded-2xl border border-primary/20 bg-primary/5 active:scale-95"
                    >
                      <MaterialIcons name="edit" size={16} color="#00612c" />
                      <Text className="text-primary text-sm font-bold font-body">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(branch)}
                      className="flex-1 flex-row items-center justify-center gap-2 py-2.5 rounded-2xl border border-red-200 bg-red-50 active:scale-95"
                    >
                      <MaterialIcons name="delete-outline" size={16} color="#ef4444" />
                      <Text className="text-red-500 text-sm font-bold font-body">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="items-center py-16">
              <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-4">
                <MaterialIcons name="account-tree" size={36} color="#00612c" />
              </View>
              <Text className="text-lg font-bold text-on-surface font-headline mb-2">No Branches Yet</Text>
              <Text className="text-sm text-outline font-body text-center px-8">
                Add your first branch to start managing livestock distribution.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB - Add Branch */}
      <View
        className="absolute z-40"
        style={{ bottom: insets.bottom + FAB_BOTTOM_OFFSET, right: 20 }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(admin)/branches/add" as any)}
          className="shadow-2xl active:scale-95"
          style={{
            shadowColor: "#00612c",
            shadowOpacity: 0.4,
            shadowRadius: 16,
            shadowOffset: { height: 6, width: 0 },
            overflow: "hidden",
            borderRadius: 24,
          }}
        >
          <LinearGradient
            colors={["#00612c", "#007d3a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-row items-center gap-2 px-6 py-4 rounded-full"
            style={{ borderRadius: 24 }}
          >
            <MaterialIcons name="add" size={22} color="white" />
            <Text className="text-white font-bold text-base font-headline">Add Branch</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <BottomNavBar />
    </View>
  );
}
