import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
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
import { updateBatch, deleteBatch, fetchBatches } from "../../store/batchSlice";
import { TopAppBar } from "../../components/TopAppBar";
import { InputField } from "../../components/InputField";
import { SCROLL_TOP_OFFSET } from "../../constants";

const CATEGORIES = ["cow", "goat", "bull", "sheep"];

export default function EditBatchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { batches, loading: batchLoading } = useSelector((state: RootState) => state.batches);
  const batch = batches.find((b) => b._id === id);

  const [batchNum, setBatchNum] = useState("");
  const [category, setCategory] = useState("cow");
  const [totalAnimals, setTotalAnimals] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [supplier, setSupplier] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!batches.length) dispatch(fetchBatches());
  }, [dispatch]);

  useEffect(() => {
    if (batch) {
      setBatchNum(batch.BatchNum);
      setCategory(batch.Category);
      setTotalAnimals(batch.TotalAnimals.toString());
      setCostPrice(batch.costPrice?.toString() || "0");
      setSupplier(batch.supplier || "");
    }
  }, [batch]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!batchNum.trim()) e.batchNum = "Batch number is required";
    if (!totalAnimals.trim() || isNaN(Number(totalAnimals))) e.totalAnimals = "Valid animal count required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const resultAction = await dispatch(updateBatch({
      id: id as string,
      batchData: { 
        BatchNum: batchNum, 
        TotalAnimals: Number(totalAnimals), 
        Category: category,
        costPrice: parseFloat(costPrice),
        supplier
      }
    }));

    if (updateBatch.fulfilled.match(resultAction)) {
      dispatch(fetchBatches());
      Alert.alert("Success", "Batch updated successfully!", [
        { text: "OK", onPress: () => router.replace("/batches") },
      ]);
    } else {
      const errorMsg = (resultAction.payload as string) || "Update failed";
      Alert.alert("Error", errorMsg);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Batch",
      `Are you sure you want to delete batch "${batchNum}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const resultAction = await dispatch(deleteBatch(id as string));
            if (deleteBatch.fulfilled.match(resultAction)) {
              Alert.alert("Deleted", "Batch has been removed successfully", [
                { text: "OK", onPress: () => router.replace("/batches") }
              ]);
            } else {
              Alert.alert("Error", (resultAction.payload as string) || "Delete failed");
            }
          },
        },
      ]
    );
  };

  if (!batch && batchLoading) {
    return <View className="flex-1 justify-center items-center bg-[#f0fbf3]"><ActivityIndicator size="large" color="#006a35" /></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f0fbf3" }}>
      <TopAppBar label="Edit Batch" showBack backPath="/batches" />
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
            <Text className="text-secondary font-semibold text-xs uppercase tracking-widest mb-1 font-body">Livestock Detail</Text>
            <Text className="text-3xl font-extrabold text-on-surface tracking-tight leading-tight font-headline">{batchNum || "Edit Batch"}</Text>
          </View>

          <View className="bg-white rounded-[2rem] p-6 mb-6 shadow-sm shadow-black/5">
            <Text className="text-base font-bold text-on-surface font-headline mb-4">Core Information</Text>
            <InputField label="Batch Number *" value={batchNum} onChangeText={setBatchNum} placeholder="e.g. BATCH-001" icon="tag" error={errors.batchNum} />
            <InputField label="Total Animals *" value={totalAnimals} onChangeText={setTotalAnimals} placeholder="e.g. 100" icon="pets" error={errors.totalAnimals} keyboardType="numeric" />
            
            <Text className="text-xs font-semibold text-outline uppercase tracking-widest mb-3 mt-2 font-body ml-1">Animal Category</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl border ${category === cat ? "bg-primary border-primary" : "bg-white border-[#00612c]/10"}`}
                >
                  <Text className={`text-xs font-bold font-body capitalize ${category === cat ? "text-white" : "text-outline"}`}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="bg-white rounded-[2rem] p-6 mb-8 shadow-sm shadow-black/5">
            <Text className="text-base font-bold text-on-surface font-headline mb-4">Financials & Sourcing</Text>
            <InputField label="Cost Price (PKR)" value={costPrice} onChangeText={setCostPrice} placeholder="e.g. 50000" icon="payments" error={errors.costPrice} keyboardType="numeric" />
            <InputField label="Supplier Name" value={supplier} onChangeText={setSupplier} placeholder="e.g. Sindh Farm Co." icon="store" error={errors.supplier} />
          </View>

          <View className="bg-red-50 p-6 rounded-[2rem] border border-red-100 mb-8 items-center">
            <MaterialIcons name="error-outline" size={32} color="#ef4444" className="mb-2" />
            <Text className="text-red-800 font-bold font-headline mb-1">Danger Zone</Text>
            <Text className="text-red-600/70 text-xs font-body text-center mb-4">Deleting a batch is permanent and cannot be reversed if animals are in branch stock.</Text>
            <TouchableOpacity
              onPress={handleDelete}
              className="w-full py-3.5 rounded-2xl bg-white border border-red-200 items-center active:bg-red-100"
            >
              <Text className="text-red-600 font-bold font-body">Permanently Delete</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-5 z-40" style={{ paddingBottom: Math.max(insets.bottom, 20) + 8 }}>
          <LinearGradient colors={["transparent", "rgba(240,251,243,0.98)", "#f0fbf3"]} className="absolute inset-0" />
          <TouchableOpacity onPress={handleSave} className="active:scale-95" disabled={batchLoading}>
            <LinearGradient colors={["#00612c", "#007d3a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="w-full rounded-full py-4 flex-row items-center justify-center gap-3" style={{ borderRadius: 50, elevation: 8, shadowColor: "#00612c", shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { height: 4, width: 0 } }}>
              {batchLoading ? <ActivityIndicator color="white" /> : (
                <>
                  <MaterialIcons name="save" size={22} color="white" />
                  <Text className="text-white font-bold text-lg font-headline">Save Changes</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
