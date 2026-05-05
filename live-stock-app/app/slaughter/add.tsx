import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchInventory } from "../../store/inventorySlice";
import { createSlaughter } from "../../store/slaughterSlice";
import { TopAppBar } from "../../components/TopAppBar";
import { InputField } from "../../components/InputField";
import { SCROLL_TOP_OFFSET } from "../../constants";
import { fetchSlaughters } from "../../store/slaughterSlice";

export default function AddSlaughterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { inventory, loading: inventoryLoading } = useSelector((state: RootState) => state.inventory);
  const { loading: saving } = useSelector((state: RootState) => state.slaughter);

  const [count, setCount] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const availableAnimals = inventory ? (inventory.totalAnimalsReceived - inventory.totalSlaughtered) : 0;

  const handleSave = async () => {
    const numCount = parseInt(count, 10);
    if (isNaN(numCount) || numCount <= 0) {
      Alert.alert("Error", "Please enter a valid count");
      return;
    }

    if (numCount > availableAnimals) {
      Alert.alert("Error", "Count exceeds available animals");
      return;
    }

    const resultAction = await dispatch(createSlaughter({ count: numCount }));
    if (createSlaughter.fulfilled.match(resultAction)) {
      // Re-fetch data so list is updated
      dispatch(fetchSlaughters());
      Alert.alert("Success", "Slaughter recorded successfully", [
        { text: "OK", onPress: () => router.replace("/slaughter") }
      ]);
    } else {
      Alert.alert("Error", (resultAction.payload as string) || "Failed to record slaughter");
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#f0fbf3" }}>
      <TopAppBar label="Slaughter" showBack />
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
            <Text className="text-secondary font-semibold text-xs uppercase tracking-widest mb-1 font-body">Production</Text>
            <Text className="text-3xl font-extrabold text-on-surface tracking-tight leading-tight font-headline">Record Slaughter</Text>
            <Text className="text-sm text-outline font-body mt-1">Update the daily slaughter count for your branch.</Text>
          </View>

          <View className="bg-white rounded-[2rem] p-6 mb-6 shadow-sm shadow-black/5">
            <View className="bg-[#f0fbf3] p-4 rounded-2xl border border-[#00612c]/10 mb-6 flex-row items-center justify-between">
              <View>
                <Text className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Available Live Stock</Text>
                <Text className="text-2xl font-black text-primary font-headline">
                  {inventoryLoading ? "..." : `${availableAnimals} Units`}
                </Text>
              </View>
              <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                <MaterialIcons name="inventory" size={24} color="#00612c" />
              </View>
            </View>

            <InputField 
              label="Quantity to Slaughter *" 
              value={count} 
              onChangeText={setCount} 
              placeholder="e.g. 50" 
              icon="pets" 
              keyboardType="numeric" 
            />

            <InputField 
              label="Notes / Observations" 
              value={notes} 
              onChangeText={setNotes} 
              placeholder="Health status, weight details..." 
              icon="event-note" 
              multiline 
            />

            {count ? (
              <View className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex-row items-center gap-2 mb-2">
                <MaterialIcons name="info-outline" size={16} color="#d97706" />
                <Text className="text-xs font-bold text-amber-700 font-body">
                  Estimated Remaining: {availableAnimals - (parseInt(count, 10) || 0)} Units
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-5 z-40" style={{ paddingBottom: Math.max(insets.bottom, 20) + 8 }}>
          <LinearGradient colors={["transparent", "rgba(240,251,243,0.98)", "#f0fbf3"]} className="absolute inset-0" />
          <TouchableOpacity onPress={handleSave} className="active:scale-95" disabled={saving}>
            <LinearGradient colors={["#00612c", "#007d3a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="w-full rounded-full py-4 flex-row items-center justify-center gap-3" style={{ borderRadius: 50, elevation: 8, shadowColor: "#00612c", shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { height: 4, width: 0 } }}>
              {saving ? <ActivityIndicator color="white" /> : (
                <>
                  <MaterialIcons name="check-circle" size={22} color="white" />
                  <Text className="text-white font-bold text-lg font-headline">Record & Update</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
