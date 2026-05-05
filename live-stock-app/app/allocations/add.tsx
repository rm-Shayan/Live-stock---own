import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { createAllocation, fetchAllocations } from "../../store/allocationSlice";
import { fetchBatches } from "../../store/batchSlice";
import { fetchBranches } from "../../store/branchSlice";
import { TopAppBar } from "../../components/TopAppBar";
import { InputField } from "../../components/InputField";
import { SCROLL_TOP_OFFSET } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";

export default function AllocateBatchScreen() {
  const router = useRouter();
  const { batchId: paramBatchId } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();

  const { batches } = useSelector((state: RootState) => state.batches);
  const { branches } = useSelector((state: RootState) => state.branches);
  const { loading: allocating } = useSelector((state: RootState) => state.allocations);

  const [selectedBatchId, setSelectedBatchId] = useState<string>((paramBatchId as string) || "");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchBatches());
    dispatch(fetchBranches());
  }, [dispatch]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!selectedBatchId) e.batch = "Please select a batch";
    if (!selectedBranchId) e.branch = "Please select a branch";
    if (!quantity.trim() || isNaN(Number(quantity))) e.quantity = "Valid quantity is required";
    
    if (selectedBatchId) {
      const batch = batches.find(b => b._id === selectedBatchId);
      if (batch && parseInt(quantity, 10) > batch.remainingAnimals) {
        e.quantity = `Max available: ${batch.remainingAnimals}`;
      }
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const allocationData = {
      batchId: selectedBatchId,
      branchId: selectedBranchId,
      quantity: parseInt(quantity, 10),
    };

    try {
      const resultAction = await dispatch(createAllocation(allocationData));
      if (createAllocation.fulfilled.match(resultAction)) {
        // Re-fetch data so lists are updated
        dispatch(fetchAllocations());
        dispatch(fetchBatches());
        Alert.alert("Success", "Allocation created successfully", [
          { text: "OK", onPress: () => router.replace("/allocations") }
        ]);
      } else {
        Alert.alert("Error", (resultAction.payload as string) || "Failed to create allocation");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const selectedBatch = batches.find(b => b._id === selectedBatchId);

  return (
    <View style={{ flex: 1, backgroundColor: "#f0fbf3" }}>
      <TopAppBar label="Add Allocation" showBack backPath="/allocations" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80}
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: SCROLL_TOP_OFFSET,
            paddingBottom: 140,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-6">
            <Text className="text-secondary font-semibold text-xs uppercase tracking-widest mb-1 font-body">Distribution</Text>
            <Text className="text-3xl font-extrabold text-on-surface tracking-tight leading-tight font-headline">New Allocation</Text>
            <Text className="text-sm text-outline font-body mt-1">Move livestock from central batch to branch stock.</Text>
          </View>

          {/* Batch Selection */}
          <View className="bg-white rounded-[2rem] p-6 mb-6 shadow-sm shadow-black/5">
            <Text className="text-xs font-semibold text-outline uppercase tracking-widest mb-4 font-body ml-1">
              1. Select Batch *
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1" contentContainerStyle={{ paddingHorizontal: 4, gap: 8 }}>
              {batches.filter(b => b.remainingAnimals > 0).map((batch) => (
                <TouchableOpacity
                  key={batch._id}
                  onPress={() => setSelectedBatchId(batch._id)}
                  className={`px-5 py-3 rounded-2xl border ${selectedBatchId === batch._id ? "bg-primary border-primary shadow-sm shadow-primary/20" : "bg-[#f8faf9] border-[#00612c]/10"}`}
                >
                  <View className="flex-row items-center gap-3">
                    <MaterialIcons name="inventory-2" size={16} color={selectedBatchId === batch._id ? "white" : "#00612c"} />
                    <View>
                      <Text className={`font-bold font-body text-sm ${selectedBatchId === batch._id ? "text-white" : "text-on-surface"}`}>
                        {batch.BatchNum}
                      </Text>
                      <Text className={`text-[10px] font-bold font-body ${selectedBatchId === batch._id ? "text-white/70" : "text-outline"}`}>
                        {batch.remainingAnimals} Units Left
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {errors.batch && <Text className="text-red-500 text-[10px] mt-2 ml-1 font-body font-bold">{errors.batch}</Text>}
          </View>

          {/* Branch Selection */}
          <View className="bg-white rounded-[2rem] p-6 mb-6 shadow-sm shadow-black/5">
            <Text className="text-xs font-semibold text-outline uppercase tracking-widest mb-4 font-body ml-1">
              2. Select Destination Branch *
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {branches.map((branch) => (
                <TouchableOpacity
                  key={branch._id}
                  onPress={() => setSelectedBranchId(branch._id)}
                  className={`px-5 py-2.5 rounded-xl border ${selectedBranchId === branch._id ? "bg-primary border-primary shadow-sm" : "bg-[#f8faf9] border-[#00612c]/10"}`}
                >
                  <Text className={`text-xs font-bold font-body ${selectedBranchId === branch._id ? "text-white" : "text-outline"}`}>
                    {branch.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.branch && <Text className="text-red-500 text-[10px] mt-2 ml-1 font-body font-bold">{errors.branch}</Text>}
          </View>

          {/* Quantity Input */}
          <View className="bg-white rounded-[2rem] p-6 mb-8 shadow-sm shadow-black/5">
            <Text className="text-base font-bold text-on-surface font-headline mb-4">Allocation Detail</Text>
            <InputField 
              label="Quantity to Allocate *" 
              value={quantity} 
              onChangeText={setQuantity} 
              placeholder="e.g. 50" 
              icon="pets" 
              keyboardType="numeric" 
              error={errors.quantity}
            />
            {selectedBatch && (
              <View className="bg-primary/5 p-3 rounded-xl border border-primary/10 mt-1 flex-row items-center gap-2">
                <MaterialIcons name="info-outline" size={14} color="#00612c" />
                <Text className="text-[10px] text-primary font-bold font-body">
                  Batch Capacity: {selectedBatch.remainingAnimals} units available.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-5 z-40" style={{ paddingBottom: Math.max(insets.bottom, 20) + 8 }}>
          <TouchableOpacity onPress={handleSave} className="active:scale-95" disabled={allocating}>
            <LinearGradient 
              colors={allocating ? ["#9ca3af", "#6b7280"] : ["#00612c", "#007d3a"]} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }} 
              className="w-full rounded-full py-4 flex-row items-center justify-center gap-3" 
              style={{ borderRadius: 50, elevation: 8, shadowColor: "#00612c", shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { height: 4, width: 0 } }}
            >
              {allocating ? <ActivityIndicator color="white" /> : (
                <>
                  <MaterialIcons name="call-split" size={22} color="white" />
                  <Text className="text-white font-bold text-lg font-headline">Confirm Allocation</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
