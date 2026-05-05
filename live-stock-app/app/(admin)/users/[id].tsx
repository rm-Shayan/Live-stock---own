import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { updateUser, deleteUser, fetchUsers } from "../../../store/userSlice";
import { fetchBranches } from "../../../store/branchSlice";
import { TopAppBar } from "../../../components/TopAppBar";
import { InputField } from "../../../components/InputField";
import { SCROLL_TOP_OFFSET } from "../../../constants";

const ROLES = ["admin", "manager", "staff"];

export default function EditUserScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { users, loading: userLoading } = useSelector((state: RootState) => state.users);
  const { branches } = useSelector((state: RootState) => state.branches);
  const user = users.find((u) => u._id === id);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [branchId, setBranchId] = useState("");
  const [password, setPassword] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!users.length) dispatch(fetchUsers());
    dispatch(fetchBranches());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setRole(user.role);
      setBranchId(user.branchId?._id || user.branchId || "");
      setIsBlocked(user.isBlocked || false);
    }
  }, [user]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!username.trim()) e.username = "Username is required";
    if (!email.trim() || !email.includes("@")) e.email = "Valid email required";
    if (role !== "admin" && !branchId) e.branch = "Please assign a branch";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const userData: any = { username, email, role, branchId: role === "admin" ? null : branchId, isBlocked };
    if (password) userData.password = password;

    const resultAction = await dispatch(updateUser({ id: id as string, userData }));
    if (updateUser.fulfilled.match(resultAction)) {
      dispatch(fetchUsers());
      Alert.alert("Success", "User details updated!", [
        { text: "OK", onPress: () => router.replace("/(admin)/users") }
      ]);
    } else {
      Alert.alert("Error", (resultAction.payload as string) || "Update failed");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to permanently delete "${username}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const resultAction = await dispatch(deleteUser(id as string));
            if (deleteUser.fulfilled.match(resultAction)) {
              Alert.alert("Deleted", "User has been removed successfully", [
                { text: "OK", onPress: () => router.replace("/(admin)/users") }
              ]);
            } else {
              Alert.alert("Error", (resultAction.payload as string) || "Delete failed");
            }
          },
        },
      ]
    );
  };

  if (userLoading && !user) {
    return <View className="flex-1 justify-center items-center bg-[#f0fbf3]"><ActivityIndicator size="large" color="#006a35" /></View>;
  }

  if (!user) {
    return <View className="flex-1 justify-center items-center bg-[#f0fbf3]"><Text className="text-on-surface font-body">User not found</Text></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f0fbf3" }}>
      <TopAppBar label="Edit User" showBack backPath="/(admin)/users" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80}
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: SCROLL_TOP_OFFSET,
            paddingBottom: insets.bottom + 140, // Increased to account for floating button
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-6 items-center">
            <View className={`w-24 h-24 rounded-[2.5rem] items-center justify-center border-4 ${isBlocked ? "bg-red-50 border-red-100" : "bg-white border-primary/20 shadow-sm"}`}>
               <Text className={`text-4xl font-extrabold ${isBlocked ? "text-red-300" : "text-primary"}`}>
                  {username.slice(0, 1).toUpperCase()}
               </Text>
               {isBlocked && (
                 <View className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 border-2 border-white">
                   <MaterialIcons name="block" size={16} color="white" />
                 </View>
               )}
            </View>
            <Text className="mt-4 text-2xl font-extrabold text-on-surface font-headline">{username}</Text>
            <Text className="text-xs text-outline font-body uppercase tracking-widest">{role}</Text>
          </View>

          <View className="bg-white rounded-[2rem] p-6 mb-6 shadow-sm shadow-black/5">
             <Text className="text-base font-bold text-on-surface font-headline mb-4">Account Profile</Text>
             <InputField label="Username *" value={username} onChangeText={setUsername} icon="person-outline" error={errors.username} placeholder="e.g. usman_admin" />
             <InputField label="Email Address *" value={email} onChangeText={setEmail} icon="mail-outline" error={errors.email} placeholder="e.g. usman@example.com" />
             <InputField label="Change Password" value={password} onChangeText={setPassword} icon="lock-outline" secureTextEntry placeholder="••••••••" />
          </View>

          <View className="bg-white rounded-[2rem] p-6 mb-6 shadow-sm shadow-black/5">
             <Text className="text-base font-bold text-on-surface font-headline mb-4">Permissions & Access</Text>
             
             <Text className="text-xs font-semibold text-outline uppercase tracking-widest mb-3 font-body ml-1">Access Level</Text>
             <View className="flex-row flex-wrap gap-2 mb-6">
                {ROLES.map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setRole(r)}
                    className={`px-5 py-2.5 rounded-xl border ${role === r ? "bg-primary border-primary shadow-sm" : "bg-[#f8faf9] border-slate-100"}`}
                  >
                    <Text className={`text-xs font-bold font-body capitalize ${role === r ? "text-white" : "text-outline"}`}>{r}</Text>
                  </TouchableOpacity>
                ))}
             </View>

             {role !== "admin" && (
               <View className="mb-6">
                  <Text className="text-xs font-semibold text-outline uppercase tracking-widest mb-3 font-body ml-1">Assigned Branch</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1" contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}>
                    {branches.map((b) => (
                      <TouchableOpacity
                        key={b._id}
                        onPress={() => setBranchId(b._id)}
                        className={`px-5 py-2.5 rounded-xl border ${branchId === b._id ? "bg-primary border-primary shadow-sm" : "bg-[#f8faf9] border-slate-100"}`}
                      >
                        <Text className={`text-xs font-bold font-body ${branchId === b._id ? "text-white" : "text-outline"}`}>{b.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  {errors.branch && <Text className="text-red-500 text-[10px] mt-2 ml-1 font-body font-bold">{errors.branch}</Text>}
               </View>
             )}

             <View className="flex-row items-center justify-between py-4 border-t border-slate-50">
                <View className="flex-1 mr-4">
                   <Text className="text-sm font-bold text-on-surface font-body">Restrict Account</Text>
                   <Text className="text-[10px] text-outline font-body">Suspend user access without deleting data.</Text>
                </View>
                <Switch
                  value={isBlocked}
                  onValueChange={setIsBlocked}
                  trackColor={{ false: "#e2e8f0", true: "#fecaca" }}
                  thumbColor={isBlocked ? "#dc2626" : "#f8fafc"}
                />
             </View>
          </View>

          <View className="bg-red-50 p-6 rounded-[2rem] border border-red-100 mb-8 items-center">
            <MaterialIcons name="person-remove" size={32} color="#ef4444" className="mb-2" />
            <Text className="text-red-800 font-bold font-headline mb-1">Administrative Deletion</Text>
            <Text className="text-red-600/70 text-xs font-body text-center mb-4">Permanently remove this user from the system. This cannot be undone.</Text>
            <TouchableOpacity
              onPress={handleDelete}
              className="w-full py-3.5 rounded-2xl bg-white border border-red-200 items-center active:bg-red-100"
            >
              <Text className="text-red-600 font-bold font-body">Delete Permanently</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-5 z-40" style={{ paddingBottom: Math.max(insets.bottom, 20) + 8 }}>
          <LinearGradient colors={["transparent", "rgba(240,251,243,0.98)", "#f0fbf3"]} className="absolute inset-0" />
          <TouchableOpacity onPress={handleSave} className="active:scale-95" disabled={userLoading}>
            <LinearGradient colors={["#00612c", "#007d3a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="w-full rounded-full py-4 flex-row items-center justify-center gap-3" style={{ borderRadius: 50, elevation: 8, shadowColor: "#00612c", shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { height: 4, width: 0 } }}>
              {userLoading ? <ActivityIndicator color="white" /> : (
                <>
                  <MaterialIcons name="how-to-reg" size={22} color="white" />
                  <Text className="text-white font-bold text-lg font-headline">Save Profile</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
