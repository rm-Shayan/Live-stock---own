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
import { AppDispatch, RootState } from "../../../store";
import { updateBranch, deleteBranch, fetchBranches } from "../../../store/branchSlice";
import { fetchUsers } from "../../../store/userSlice";
import { TopAppBar } from "../../../components/TopAppBar";
import { InputField } from "../../../components/InputField";
import { SCROLL_TOP_OFFSET } from "../../../constants";

export default function EditBranchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { branches, loading: branchLoading } = useSelector((state: RootState) => state.branches);
  const { users, loading: userLoading } = useSelector((state: RootState) => state.users);
  const branch = branches.find((b) => b._id === id);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("500");
  const [managerId, setManagerId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!branches.length) dispatch(fetchBranches());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (branch) {
      setName(branch.name);
      setLocation(branch.location);
      setCapacity(branch.capacity?.toString() || "500");
      setManagerId(branch.managerId?._id || branch.managerId || "");
    }
  }, [branch]);

  const managers = users.filter(u => u.role === 'manager');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Branch name is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!capacity.trim() || isNaN(Number(capacity))) newErrors.capacity = "Valid capacity required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const resultAction = await dispatch(updateBranch({
      id: id as string,
      branchData: { 
        name, 
        location, 
        capacity: Number(capacity),
        managerId: managerId === "" ? "" : managerId
      }
    }));

    if (updateBranch.fulfilled.match(resultAction)) {
      dispatch(fetchBranches());
      Alert.alert("Success", "Branch updated successfully!", [
        { text: "OK", onPress: () => router.replace("/(admin)/branches") },
      ]);
    } else {
      Alert.alert("Error", (resultAction.payload as string) || "Update failed");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Branch",
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const resultAction = await dispatch(deleteBranch(id as string));
            if (deleteBranch.fulfilled.match(resultAction)) {
              Alert.alert("Deleted", "Branch has been removed successfully", [
                { text: "OK", onPress: () => router.replace("/(admin)/branches") }
              ]);
            } else {
              Alert.alert("Error", (resultAction.payload as string) || "Delete failed");
            }
          },
        },
      ]
    );
  };

  if (!branch && branchLoading) {
    return <View className="flex-1 justify-center items-center bg-[#f0fbf3]"><ActivityIndicator size="large" color="#006a35" /></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f0fbf3" }}>
      <TopAppBar label="Edit Branch" showBack backPath="/(admin)/branches" />
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
            <Text className="text-secondary font-semibold text-xs uppercase tracking-widest mb-1 font-body">Location Settings</Text>
            <Text className="text-3xl font-extrabold text-on-surface tracking-tight leading-tight font-headline">{name || "Branch Details"}</Text>
          </View>

          <View className="bg-white rounded-[2rem] p-6 mb-6 shadow-sm shadow-black/5">
            <Text className="text-base font-bold text-on-surface font-headline mb-4">Core Settings</Text>
            <InputField label="Branch Name *" value={name} onChangeText={setName} placeholder="e.g. North Nazimabad" icon="store" error={errors.name} />
            <InputField label="Location Address *" value={location} onChangeText={setLocation} placeholder="e.g. Block H, Karachi" icon="place" error={errors.location} />
            <InputField label="Total Capacity *" value={capacity} onChangeText={setCapacity} placeholder="e.g. 1000" icon="straighten" error={errors.capacity} keyboardType="numeric" />

            {/* Manager Selection */}
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

          <View className="bg-red-50 p-6 rounded-[2rem] border border-red-100 mb-8 items-center">
            <MaterialIcons name="delete-sweep" size={32} color="#ef4444" className="mb-2" />
            <Text className="text-red-800 font-bold font-headline mb-1">Archive Branch</Text>
            <Text className="text-red-600/70 text-xs font-body text-center mb-4">Deleting a branch will remove all its historical data and cannot be undone.</Text>
            <TouchableOpacity
              onPress={handleDelete}
              className="w-full py-3.5 rounded-2xl bg-white border border-red-200 items-center active:bg-red-100"
            >
              <Text className="text-red-600 font-bold font-body">Permanently Remove</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-5 z-40" style={{ paddingBottom: Math.max(insets.bottom, 20) + 8 }}>
          <LinearGradient colors={["transparent", "rgba(240,251,243,0.98)", "#f0fbf3"]} className="absolute inset-0" />
          <TouchableOpacity onPress={handleSave} className="active:scale-95" disabled={branchLoading}>
            <LinearGradient colors={["#00612c", "#007d3a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="w-full rounded-full py-4 flex-row items-center justify-center gap-3" style={{ borderRadius: 50, elevation: 8, shadowColor: "#00612c", shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { height: 4, width: 0 } }}>
              {branchLoading ? <ActivityIndicator color="white" /> : (
                <>
                  <MaterialIcons name="save" size={22} color="white" />
                  <Text className="text-white font-bold text-lg font-headline">Update Branch</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
