import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchBatches, deleteBatch } from "../../store/batchSlice";
import { BottomNavBar } from "../../components/BottomNavBar";
import { TopAppBar } from "../../components/TopAppBar";
import { CardSkeleton, StatCardSkeleton } from "../../components/SkeletonLoader";
import {
  SCROLL_TOP_OFFSET,
  SCROLL_BOTTOM_PADDING,
  FAB_BOTTOM_OFFSET,
} from "../../constants";

import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function BatchesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { batches, loading, error } = useSelector((state: RootState) => state.batches);
  const [filterType, setFilterType] = useState<string>("all");

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchBatches());
    }, [dispatch])
  );

  const filtered = filterType === "all"
    ? batches
    : batches.filter((b) => b.Category.toLowerCase() === filterType.toLowerCase());

  const totalAnimals = batches.reduce((s, b) => s + (b.TotalAnimals || 0), 0);

  const handleDelete = (batch: any) => {
    Alert.alert(
      "Delete Batch",
      `Delete batch "${batch.BatchNum}"? This cannot be undone and will fail if animals are allocated.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteBatch(batch._id)).then((action: any) => {
              if (action.error) {
                Alert.alert("Error", action.payload || "Failed to delete batch");
              } else {
                Alert.alert("Success", "Batch deleted successfully");
              }
            });
          },
        },
      ],
    );
  };

  const handleEdit = (batch: any) => {
    router.push({
      pathname: "/batches/edit",
      params: { id: batch._id },
    });
  };

  const ANIMAL_TYPES = ["all", "cow", "goat"];

  return (
    <View className="flex-1 bg-[#f8faf9]">
      <TopAppBar label="Batches" showBack />

      <ScrollView
        contentContainerStyle={{
          paddingTop: SCROLL_TOP_OFFSET,
          paddingBottom: SCROLL_BOTTOM_PADDING + 20,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => dispatch(fetchBatches())} />
        }
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-secondary font-semibold text-xs uppercase tracking-widest mb-1 font-body">
            Livestock Management
          </Text>
          <Text className="text-3xl font-extrabold text-on-surface tracking-tight leading-tight font-headline">
            Batch Inventory
          </Text>
        </View>

        {/* Stats Row */}
        <View className="flex-row gap-3 mb-6">
          {loading && batches.length === 0 ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <View
                className="flex-1 bg-white rounded-3xl p-4 items-center"
                style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { height: 2, width: 0 } }}
              >
                <View className="w-10 h-10 rounded-2xl bg-[#e0f2e9] items-center justify-center mb-2">
                  <MaterialIcons name="inventory-2" size={20} color="#006a35" />
                </View>
                <Text className="text-2xl font-black text-[#006a35] font-headline">{batches.length}</Text>
                <Text className="text-xs text-outline font-medium font-body mt-0.5">Batches</Text>
              </View>
              <View
                className="flex-1 bg-white rounded-3xl p-4 items-center"
                style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { height: 2, width: 0 } }}
              >
                <View className="w-10 h-10 rounded-2xl bg-amber-100 items-center justify-center mb-2">
                  <MaterialIcons name="pets" size={20} color="#d97706" />
                </View>
                <Text className="text-2xl font-black text-amber-600 font-headline">{totalAnimals}</Text>
                <Text className="text-xs text-outline font-medium font-body mt-0.5">Animals</Text>
              </View>
            </>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-5 -mx-1"
          contentContainerStyle={{ paddingHorizontal: 4, gap: 8 }}
        >
          {ANIMAL_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full border ${
                filterType === type
                  ? "bg-primary border-primary"
                  : "bg-white border-[#00612c]/15"
              }`}
            >
              <Text
                className={`text-xs font-bold font-body capitalize ${
                  filterType === type ? "text-white" : "text-outline"
                }`}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Batch Cards */}
        <View>
          {loading && batches.length === 0 ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : filtered.length > 0 ? (
            filtered.map((batch) => (
              <View
                key={batch._id}
                className="bg-white rounded-[2rem] overflow-hidden mb-4"
                style={{
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOpacity: 0.07,
                  shadowRadius: 12,
                  shadowOffset: { height: 3, width: 0 },
                }}
              >
                <View className="p-5">
                  {/* Top Row */}
                  <View className="flex-row items-start justify-between mb-4">
                    <View className="flex-row items-center gap-3 flex-1">
                      <LinearGradient
                        colors={["#006a35", "#059669"]}
                        className="w-12 h-12 rounded-2xl items-center justify-center"
                      >
                        <MaterialIcons
                          name="inventory-2"
                          size={22}
                          color="white"
                        />
                      </LinearGradient>
                      <View className="flex-1">
                        <Text className="font-bold text-base text-on-surface font-headline">
                          {batch.BatchNum}
                        </Text>
                        <Text className="text-xs text-outline font-body mt-0.5">
                          Arrival: {new Date(batch.ArrivalDate).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <View className="px-3 py-1 rounded-full bg-primary/10">
                      <Text className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {batch.remainingAnimals > 0 ? 'Active' : 'Allocated'}
                      </Text>
                    </View>
                  </View>

                  {/* Info Grid */}
                  <View className="flex-row flex-wrap gap-y-3 mb-4 bg-[#f8faf9] rounded-2xl p-3 border border-slate-100">
                    <View className="w-1/2 flex-row items-center gap-2">
                      <MaterialIcons name="pets" size={14} color="#64748b" />
                      <View>
                        <Text className="text-[10px] text-outline font-body">
                          Total
                        </Text>
                        <Text className="text-sm font-bold text-on-surface font-body">
                          {batch.TotalAnimals} Units
                        </Text>
                      </View>
                    </View>
                    <View className="w-1/2 flex-row items-center gap-2">
                      <MaterialIcons
                        name="pie-chart"
                        size={14}
                        color="#6f7a6e"
                      />
                      <View>
                        <Text className="text-[10px] text-outline font-body">
                          Remaining
                        </Text>
                        <Text className="text-sm font-bold text-primary font-body">
                          {batch.remainingAnimals} Units
                        </Text>
                      </View>
                    </View>
                    <View className="w-full flex-row items-center gap-2">
                      <MaterialIcons
                        name="category"
                        size={14}
                        color="#6f7a6e"
                      />
                      <View>
                        <Text className="text-[10px] text-outline font-body">
                          Type
                        </Text>
                        <Text className="text-sm font-bold text-on-surface font-body capitalize">
                          {batch.Category}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleEdit(batch)}
                      className="flex-1 flex-row items-center justify-center gap-3 py-2.5 px-3 min-h-[44px] rounded-2xl border border-[#006a35]/20 bg-[#e0f2e9]/30 active:scale-95"
                    >
                      <MaterialIcons name="edit" size={15} color="#006a35" />
                      <Text className="text-[#006a35] text-sm font-bold font-body">
                        Edit
                      </Text>
                    </TouchableOpacity>
                    {batch.remainingAnimals > 0 && !batch.isAllocated ? (
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/allocations/add",
                            params: { batchId: batch._id, batchNumber: batch.BatchNum },
                          })
                        }
                        className="flex-1 flex-row items-center justify-center gap-3 py-2.5 px-3 min-h-[44px] rounded-2xl border border-amber-200 bg-amber-50 active:scale-95"
                      >
                        <MaterialIcons
                          name="call-split"
                          size={15}
                          color="#d97706"
                        />
                        <Text className="text-amber-600 text-sm font-bold font-body" numberOfLines={1}>
                          Allocate
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View className="flex-1 flex-row items-center justify-center gap-2 py-2.5 px-3 min-h-[44px] rounded-2xl border border-slate-200 bg-slate-50">
                        <MaterialIcons name="check-circle" size={15} color="#64748b" />
                        <Text className="text-slate-500 text-sm font-bold font-body">
                          Distributed
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={() => handleDelete(batch)}
                      className="w-11 h-11 items-center justify-center rounded-2xl border border-red-200 bg-red-50 active:scale-95"
                    >
                      <MaterialIcons
                        name="delete-outline"
                        size={18}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="items-center py-16">
              <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-4">
                <MaterialIcons name="inventory-2" size={36} color="#00612c" />
              </View>
              <Text className="text-lg font-bold text-on-surface font-headline mb-2">
                No Batches Found
              </Text>
              <Text className="text-sm text-outline font-body text-center px-8">
                No batches match the selected criteria. Add a new batch to start.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB – Add Batch */}
      <TouchableOpacity
        onPress={() => router.push("/batches/add")}
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
          style={{
            width: 60,
            height: 60,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcons name="add" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <BottomNavBar />
    </View>
  );
}
