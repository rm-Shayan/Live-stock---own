import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View, RefreshControl, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { createAllocation, fetchAllocations, updateAllocation, deleteAllocation, updateAllocationStatus } from "../../store/allocationSlice";
import { fetchBatches } from "../../store/batchSlice";
import { BottomNavBar } from "../../components/BottomNavBar";
import { TopAppBar } from "../../components/TopAppBar";
import { CardSkeleton } from "../../components/SkeletonLoader";
import {
  FAB_BOTTOM_OFFSET,
  SCROLL_BOTTOM_PADDING,
  SCROLL_TOP_OFFSET,
} from "../../constants";

export default function AllocationHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { allocations, loading } = useSelector((state: RootState) => state.allocations);
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedStatus, setSelectedStatus] = useState("All");

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchAllocations());
    }, [dispatch])
  );

  const statusOptions = [
    { label: "All", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Received", value: "Received" },
  ];

  const filteredAllocations = selectedStatus === "All"
    ? allocations
    : allocations.filter(a => a.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Received": return "bg-green-100 text-green-700";
      case "Pending": return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleReceive = (id: string) => {
    const allocation = allocations.find(a => a._id === id);
    Alert.alert(
      "Receive Animals",
      `Mark ${allocation?.quantity} animals as received for ${allocation?.branchId?.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, Received", 
          onPress: async () => {
            const res = await dispatch(updateAllocationStatus({ 
              id, 
              status: 'Received', 
              receivedAnimals: allocation?.quantity || 0 
            }));
            if (updateAllocationStatus.fulfilled.match(res)) {
              dispatch(fetchAllocations());
              Alert.alert("Success", "Animals received and inventory updated!");
            } else {
              Alert.alert("Error", (res.payload as string) || "Update failed");
            }
          } 
        }
      ]
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Allocation",
      "Are you sure you want to delete this allocation? This will return the stock to the batch.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            const res = await dispatch(deleteAllocation(id));
            if (deleteAllocation.fulfilled.match(res)) {
              dispatch(fetchAllocations());
              Alert.alert("Deleted", "Allocation removed successfully");
            } else {
              Alert.alert("Error", (res.payload as string) || "Delete failed");
            }
          } 
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-background">
      <TopAppBar label="Allocations" showBack />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + SCROLL_TOP_OFFSET,
          paddingBottom: SCROLL_BOTTOM_PADDING + 30,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => dispatch(fetchAllocations())} />
        }
      >
        {/* Header & Greeting */}
        <View className="mt-4 mb-6">
          <Text className="font-headline text-3xl font-extrabold text-on-surface tracking-tight leading-tight">
            Allocations
          </Text>
          <Text className="font-body text-outline text-sm mt-1">
            Manage livestock distribution across your branch network.
          </Text>
        </View>

        {/* Filter Chips Section */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-8 -mx-1"
          contentContainerStyle={{ paddingHorizontal: 4, gap: 8 }}
        >
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setSelectedStatus(option.value)}
              className={`px-5 py-2.5 rounded-full border ${
                selectedStatus === option.value
                  ? "bg-primary border-primary"
                  : "bg-surface-container-lowest border-outline-variant/20"
              }`}
              style={{ elevation: selectedStatus === option.value ? 2 : 1 }}
            >
              <Text
                className={`font-bold text-sm font-body ${
                  selectedStatus === option.value ? "text-white" : "text-on-surface-variant"
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Allocation Cards List */}
        <View className="space-y-4">
          {loading && allocations.length === 0 ? (
            <>
              <CardSkeleton rows={2} />
              <CardSkeleton rows={2} />
              <CardSkeleton rows={2} />
            </>
          ) : filteredAllocations.length > 0 ? (
            filteredAllocations.map((item) => (
              <TouchableOpacity
                key={item._id}
                onPress={() => handleReceive(item._id)}
                className="bg-white rounded-[2rem] p-5 mb-4 border border-outline-variant/10"
                activeOpacity={0.9}
                style={{
                  elevation: 2,
                  shadowColor: "#000",
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  shadowOffset: { height: 4, width: 0 },
                }}
              >
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1">
                    <Text className="font-body text-[10px] uppercase tracking-widest text-outline font-bold">
                      {item._id.slice(-8).toUpperCase()}
                    </Text>
                    <Text className="font-headline font-bold text-lg text-on-surface" numberOfLines={1}>
                      Batch: {item.batchId?.BatchNum || "N/A"}
                    </Text>
                  </View>
                  <View className="flex-row gap-2">
                    <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status).split(' ')[0]}`}>
                      <Text className={`text-[10px] font-bold uppercase tracking-wider font-body ${getStatusColor(item.status).split(' ')[1]}`}>
                        {item.status}
                      </Text>
                    </View>
                    {user?.role === 'admin' && (
                      <TouchableOpacity 
                        onPress={() => handleDelete(item._id)}
                        className="bg-red-50 p-2 rounded-full"
                      >
                        <MaterialIcons name="delete-outline" size={16} color="#ef4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View className="flex-row items-center gap-2 mb-6">
                  <MaterialIcons name="store" size={20} color="#64748b" />
                  <Text className="font-body text-sm text-on-surface-variant font-medium">
                    Branch: {item.branchId?.name || "N/A"}
                  </Text>
                </View>

                <View className="flex-row items-end justify-between bg-[#f8faf9] rounded-2xl p-4 border border-slate-100">
                  <View>
                    <Text className="font-body text-[10px] uppercase text-outline mb-1 font-bold">
                      Quantity
                    </Text>
                    <View className="flex-row items-baseline gap-1">
                      <Text className="text-2xl font-headline font-extrabold text-primary">
                        {item.quantity}
                      </Text>
                      <Text className="text-outline text-xs font-body">
                        Units
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-[10px] text-outline font-body mb-1">Date</Text>
                    <Text className="text-sm font-bold text-on-surface font-body">
                      {item?.allocationDate || item?.createdAt ? new Date(item.allocationDate || item.createdAt).toLocaleDateString() : "N/A"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="items-center py-16">
              <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-4">
                <MaterialIcons name="call-split" size={36} color="#00612c" />
              </View>
              <Text className="text-lg font-bold text-on-surface font-headline mb-2">
                No Allocations Found
              </Text>
              <Text className="text-sm text-outline font-body text-center px-8">
                No allocation records match the selected filter.
              </Text>
            </View>
          )}
        </View>

        {/* Summary Section */}
        <View className="mt-8 mb-8">
          <Text className="font-headline text-lg font-bold text-on-surface mb-4">
            Network Summary
          </Text>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            <View className="w-full bg-secondary-container p-6 rounded-[2rem] min-h-[100px] justify-between flex-row items-center">
              <View>
                <Text className="text-3xl font-headline font-extrabold text-on-secondary-container leading-none">
                  {allocations.length}
                </Text>
                <Text className="text-[10px] font-body uppercase font-bold text-on-secondary-container mt-1 tracking-wider">
                  Total Records
                </Text>
              </View>
              <MaterialIcons
                name="analytics"
                size={40}
                className="text-on-secondary-container opacity-40"
              />
            </View>

            <View className="w-[48%] bg-surface-container-high p-5 rounded-[2rem] min-h-[100px] justify-between">
              <Text className="text-2xl font-headline font-extrabold text-on-surface leading-none">
                {allocations.filter(a => a.status === 'Received').length}
              </Text>
              <Text className="text-[10px] font-body uppercase font-bold text-on-surface-variant mt-1 tracking-wider">
                Received
              </Text>
            </View>

            <View className="w-[48%] bg-amber-50 p-5 rounded-[2rem] min-h-[100px] justify-between border border-amber-100">
              <Text className="text-2xl font-headline font-extrabold text-amber-700 leading-none">
                {allocations.filter(a => a.status === 'Pending').length}
              </Text>
              <Text className="text-[10px] font-body uppercase font-bold text-amber-600 mt-1 tracking-wider">
                Pending
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FAB: Create Allocation */}
      <TouchableOpacity
        className="absolute w-14 h-14 rounded-full justify-center items-center overflow-hidden z-40 active:scale-90 transition-transform"
        style={{
          bottom: insets.bottom + FAB_BOTTOM_OFFSET,
          right: 24,
          elevation: 8,
          shadowColor: "#006a35",
          shadowOpacity: 0.3,
          shadowRadius: 12,
          shadowOffset: { height: 6, width: 0 },
        }}
        onPress={() => router.push("/allocations/add")}
      >
        <LinearGradient
          colors={["#006a35", "#059669"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full h-full items-center justify-center"
          style={{ borderRadius: 28 }}
        >
          <MaterialIcons name="add" size={32} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <BottomNavBar />
    </View>
  );
}
