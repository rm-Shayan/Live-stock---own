import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { createBatch,fetchBatches } from "../../store/batchSlice";
import { TopAppBar } from "../../components/TopAppBar";
import { InputField } from "../../components/InputField";
import { SCROLL_TOP_OFFSET } from "../../constants";

const CATEGORIES = ["cow", "goat", "bull", "sheep"];

export default function AddBatchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { loading: batchLoading } = useSelector((state: RootState) => state.batches);

  const [batchNum, setBatchNum] = useState("");
  const [category, setCategory] = useState("cow");
  const [totalAnimals, setTotalAnimals] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [supplier, setSupplier] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!batchNum.trim()) e.batchNum = "Batch number is required";
    if (!totalAnimals.trim() || isNaN(Number(totalAnimals))) e.totalAnimals = "Valid animal count required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const batchData = {
      BatchNum: batchNum,
      TotalAnimals: Number(totalAnimals),
      Category: category,
      costPrice: parseFloat(costPrice) || 0,
      supplier: supplier || "Direct Farm"
    };

    try {
      const resultAction = await dispatch(createBatch(batchData));
      if (createBatch.fulfilled.match(resultAction)) {
        // Re-fetch batches so the list is updated
        dispatch(fetchBatches());
        Alert.alert("Success", "Batch added successfully!", [
          { text: "OK", onPress: () => router.replace("/batches") },
        ]);
      } else {
        Alert.alert("Error", (resultAction.payload as string) || "Failed to create batch");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f0fbf3" }}>
      <TopAppBar label="Add Batch" showBack backPath="/batches" />
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
            <Text className="text-secondary font-semibold text-xs uppercase tracking-widest mb-1 font-body">Inventory Setup</Text>
            <Text className="text-3xl font-extrabold text-on-surface tracking-tight leading-tight font-headline">New Livestock Batch</Text>
            <Text className="text-sm text-outline font-body mt-1">Register incoming livestock to the central warehouse.</Text>
          </View>

          <View className="bg-white rounded-[2rem] p-6 mb-6 shadow-sm shadow-black/5">
            <Text className="text-base font-bold text-on-surface font-headline mb-4">Batch Information</Text>
            <InputField label="Batch Number *" value={batchNum} onChangeText={setBatchNum} placeholder="e.g. BATCH-2024-01" icon="tag" error={errors.batchNum} />
            <InputField label="Total Animals *" value={totalAnimals} onChangeText={setTotalAnimals} placeholder="e.g. 150" icon="pets" error={errors.totalAnimals} keyboardType="numeric" />
            
            <Text className="text-xs font-semibold text-outline uppercase tracking-widest mb-3 mt-2 font-body ml-1">Animal Category</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl border ${category === cat ? "bg-primary border-primary shadow-sm" : "bg-white border-[#00612c]/10"}`}
                >
                  <Text className={`text-xs font-bold font-body capitalize ${category === cat ? "text-white" : "text-outline"}`}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="bg-white rounded-[2rem] p-6 mb-8 shadow-sm shadow-black/5">
            <Text className="text-base font-bold text-on-surface font-headline mb-4">Sourcing Details</Text>
            <InputField label="Cost Price (Total PKR)" value={costPrice} onChangeText={setCostPrice} placeholder="e.g. 750000" icon="payments" error={errors.costPrice} keyboardType="numeric" />
            <InputField label="Supplier / Farm Name" value={supplier} onChangeText={setSupplier} placeholder="e.g. Karachi Livestock Co." icon="store" error={errors.supplier} />
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-5 z-40" style={{ paddingBottom: Math.max(insets.bottom, 20) + 8 }}>
          <LinearGradient colors={["transparent", "rgba(240,251,243,0.98)", "#f0fbf3"]} className="absolute inset-0" />
          <TouchableOpacity onPress={handleSave} className="active:scale-95" disabled={batchLoading}>
            <LinearGradient colors={["#00612c", "#007d3a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="w-full rounded-full py-4 flex-row items-center justify-center gap-3" style={{ borderRadius: 50, elevation: 8, shadowColor: "#00612c", shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { height: 4, width: 0 } }}>
              {batchLoading ? <ActivityIndicator color="white" /> : (
                <>
                  <MaterialIcons name="add-circle" size={22} color="white" />
                  <Text className="text-white font-bold text-lg font-headline">Register Batch</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
