import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from 
"react-native-safe-area-context";
import { fetchUsers } from "../../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { createUser } from "../../../store/userSlice";
import { fetchBranches } from "../../../store/branchSlice";
import { TopAppBar } from "../../../components/TopAppBar";
import { InputField } from "../../../components/InputField";
import { SCROLL_TOP_OFFSET } from "../../../constants";

const ROLES = ["admin", "manager", "staff"];

export default function AddUserScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { branches } = useSelector((state: RootState) => state.branches);
  const { loading: userLoading } = useSelector((state: RootState) => state.users);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("staff");
  const [branchId, setBranchId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!username.trim()) e.username = "Username is required";
    if (!email.trim() || !email.includes("@")) e.email = "Valid email is required";
    if (!password.trim() || password.length < 6) e.password = "Password must be at least 6 chars";
    if (password !== confirm) e.confirm = "Passwords do not match";
    if ((role === "manager" || role === "staff") && !branchId) e.branch = "Please assign a branch";
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    const userData = {
      username,
      email,
      password,
      role,
      branchId: (role === "admin") ? null : branchId,
    };

    try {
      const resultAction = await dispatch(createUser(userData));
      if (createUser.fulfilled.match(resultAction)) {
        // Re-fetch users so the list is updated
        dispatch(fetchUsers());
        Alert.alert("Success", `${username} has been added successfully!`, [
          { text: "OK", onPress: () => router.replace("/(admin)/users") },
        ]);
      } else {
        const errorMsg = (resultAction.payload as string) || "Failed to create user";
        Alert.alert("Error", errorMsg);
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f0fbf3" }}>
      <TopAppBar label="Add User" showBack backPath="/(admin)/users" />
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
              User Management
            </Text>
            <Text className="text-3xl font-extrabold text-on-surface tracking-tight leading-tight font-headline">
              Create Account
            </Text>
            <Text className="text-sm text-outline font-body mt-1">
              Register a new team member with specific permissions.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-xs font-semibold text-outline uppercase tracking-widest mb-3 font-body ml-1">
              User Role
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {ROLES.map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRole(r)}
                  className={`px-6 py-3 rounded-full border ${
                    role === r
                      ? "bg-primary border-primary shadow-sm"
                      : "bg-white border-[#00612c]/10"
                  }`}
                >
                  <Text
                    className={`text-sm font-bold font-body capitalize ${
                      role === r ? "text-white" : "text-outline"
                    }`}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View
            className="bg-white rounded-[2rem] p-6 mb-6 shadow-sm shadow-black/5"
          >
            <Text className="text-base font-bold text-on-surface font-headline mb-4">
              Account Details
            </Text>

            <InputField
              label="Full Username *"
              value={username}
              onChangeText={setUsername}
              placeholder="e.g. usman_khan"
              icon="person-outline"
              error={errors.username}
            />
            <InputField
              label="Email Address *"
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. usman@saylani.org"
              icon="mail-outline"
              error={errors.email}
              keyboardType="email-address"
            />

            {(role === "manager" || role === "staff") && (
              <View className="mb-4">
                <Text className="text-xs font-semibold text-outline uppercase tracking-widest mb-3 font-body ml-1">
                  Assign to Branch *
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1" contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}>
                  {branches.map((b) => (
                    <TouchableOpacity
                      key={b._id}
                      onPress={() => setBranchId(b._id)}
                      className={`px-5 py-2.5 rounded-xl border ${
                        branchId === b._id ? "bg-primary border-primary shadow-sm" : "bg-[#f8faf9] border-slate-100"
                      }`}
                    >
                      <Text className={`text-xs font-bold font-body ${branchId === b._id ? "text-white" : "text-outline"}`}>
                        {b.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {errors.branch && <Text className="text-red-500 text-xs mt-2 ml-1 font-body">{errors.branch}</Text>}
              </View>
            )}

            <InputField
              label="Security Password *"
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 6 characters"
              icon="lock-outline"
              error={errors.password}
              secureTextEntry
            />
            <InputField
              label="Confirm Password *"
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Repeat password"
              icon="verified-user"
              error={errors.confirm}
              secureTextEntry
            />
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
            onPress={handleCreate}
            className="active:scale-95"
            disabled={userLoading}
          >
            <LinearGradient
              colors={userLoading ? ["#9ca3af", "#6b7280"] : ["#00612c", "#007d3a"]}
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
              {userLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialIcons name="person-add" size={22} color="white" />
                  <Text className="text-white font-bold text-lg font-headline">
                    Register User
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
