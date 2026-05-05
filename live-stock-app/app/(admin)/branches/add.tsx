import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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
import { AppDispatch, RootState } from "../../../store";
import { createBranch, fetchBranches } from "../../../store/branchSlice";
import { fetchUsers } from "../../../store/userSlice";
import { TopAppBar } from "../../../components/TopAppBar";
import { InputField } from "../../../components/InputField";
import { SCROLL_TOP_OFFSET } from "../../../constants";

export default function AddBranchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { loading: branchLoading } = useSelector((state: RootState) => state.branches);
  const { users, loading: userLoading } = useSelector((state: RootState) => state.users);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [managerId, setManagerId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const managers = users.filter(u => u.role === 'manager');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Branch name is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!capacity.trim() || isNaN(Number(capacity))) newErrors.capacity = "Valid capacity is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const branchData = {
      name,
      location,
      capacity: parseInt(capacity, 10),
      managerId: managerId || null
    };

    try {
      const resultAction = await dispatch(createBranch(branchData));
      if (createBranch.fulfilled.match(resultAction)) {
        // Re-fetch branches so the list is updated
        dispatch(fetchBranches());
        Alert.alert("Success", `"${name}" branch has been added successfully!`, [
          { text: "OK", onPress: () => router.replace("/(admin)/branches") },
        ]);
      } else {
        const errorMsg = (resultAction.payload as string) || "Failed to create branch";
        Alert.alert("Error", errorMsg);
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f0fbf3" }}>
      <TopAppBar label="Add Branch" showBack backPath="/(admin)/branches" />
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
            <Text className="text-secondary font-semibold text-xs uppercase tracking-widest mb-1 font-body">
              Branch Setup
            </Text>
            <Text className="text-3xl font-extrabold text-on-surface tracking-tight leading-tight font-headline">
              Add New Branch
            </Text>
            <Text className="text-sm text-outline font-body mt-1">
              Define a new distribution point for livestock management.
            </Text>
          </View>

          <View
            className="bg-white rounded-[2rem] p-6 mb-6 shadow-sm shadow-black/5"
          >
            <Text className="text-base font-bold text-on-surface font-headline mb-4">
              Branch Details
            </Text>

            <InputField
              label="Branch Name *"
              value={name}
              onChangeText={setName}
              placeholder="e.g. North Karachi Branch"
              icon="account-tree"
              error={errors.name}
            />
            <InputField
              label="Location / Address *"
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Sector 11-B, North Karachi"
              icon="place"
              error={errors.location}
            />
            <InputField
              label="Storage Capacity *"
              value={capacity}
              onChangeText={setCapacity}
              placeholder="e.g. 500"
              icon="straighten"
              error={errors.capacity}
              keyboardType="numeric"
            />

            <View className="mt-2">
              <Text className="text-xs font-semibold text-outline uppercase tracking-widest mb-3 font-body ml-1">
                Assign Manager (Optional)
              </Text>
              {userLoading ? (
                <ActivityIndicator color="#00612c" size="small" />
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1" contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}>
                  <TouchableOpacity
                    onPress={() => setManagerId("")}
                    className={`px-5 py-2.5 rounded-xl border ${
                      managerId === "" ? "bg-primary border-primary shadow-sm" : "bg-[#f8faf9] border-slate-100"
                    }`}
                  >
                    <Text className={`text-xs font-bold font-body ${managerId === "" ? "text-white" : "text-outline"}`}>
                      None
                    </Text>
                  </TouchableOpacity>
                  {managers.map((m) => (
                    <TouchableOpacity
                      key={m._id}
                      onPress={() => setManagerId(m._id)}
                      className={`px-5 py-2.5 rounded-xl border ${
                        managerId === m._id ? "bg-primary border-primary shadow-sm" : "bg-[#f8faf9] border-slate-100"
                      }`}
                    >
                      <Text className={`text-xs font-bold font-body ${managerId === m._id ? "text-white" : "text-outline"}`}>
                        {m.username}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>

          <View className="bg-secondary-container/30 p-5 rounded-3xl border border-secondary/10 flex-row gap-4 mb-8">
            <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
              <MaterialIcons name="lightbulb-outline" size={20} color="#00612c" />
            </View>
            <View className="flex-1">
              <Text className="text-on-secondary-container font-bold text-sm mb-1">Management Tip</Text>
              <Text className="text-on-secondary-container/70 text-xs leading-relaxed">
                Assigning a manager now allows them to record slaughters and manage stock for this branch immediately.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View
          className="absolute bottom-0 left-0 right-0 px-5 z-40"
          style={{ paddingBottom: Math.max(insets.bottom, 20) + 8 }}
        >
          <LinearGradient
            colors={["transparent", "rgba(240,251,243,0.98)", "#f0fbf3"]}
            className="absolute inset-0"
          />
          <TouchableOpacity
            onPress={handleSave}
            className="active:scale-95"
            disabled={branchLoading}
          >
            <LinearGradient
              colors={branchLoading ? ["#9ca3af", "#6b7280"] : ["#00612c", "#007d3a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="w-full rounded-full py-4 flex-row items-center justify-center gap-3"
              style={{
                borderRadius: 50,
                elevation: 8,
                shadowColor: "#00612c",
                shadowOpacity: 0.35,
                shadowRadius: 16,
                shadowOffset: { height: 4, width: 0 },
              }}
            >
              {branchLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialIcons name="add-circle" size={22} color="white" />
                  <Text className="text-white font-bold text-lg font-headline">
                    Save Branch
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
