import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { loginUser, loadUser } from "../store/authSlice";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InputField } from "../components/InputField";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
    // Clear any previous errors when mounting the login screen
    dispatch({ type: 'auth/clearError' });
    setLocalError(null);
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const handleLogin = () => {
    setLocalError(null);
    if (!email || !password) {
      setLocalError("Please enter both email and password");
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  const handleInputChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    if (localError) setLocalError(null);
    if (error) dispatch({ type: 'auth/clearError' });
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-[#fcfdfc]"
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 40}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-sm self-center">
          <View
            className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100"
            style={{ elevation: 5 }}
          >
            {/* Logo Section */}
            <View className="flex-row items-center mb-8">
              <View
                className="bg-[#006a35] rounded-2xl items-center justify-center mr-4"
                style={{
                  width: 52,
                  height: 52,
                  elevation: 8,
                  shadowColor: "#006a35",
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                }}
              >
                <Image
                  source={require("../assets/logo_icon.png")}
                  style={{ width: 34, height: 34 }}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text className="text-[#006a35] text-2xl font-black tracking-tight font-headline">
                  LiveStock
                </Text>
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest font-body">
                  Management Hub
                </Text>
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-gray-900 text-2xl font-black font-headline">Welcome back</Text>
              <Text className="text-gray-500 text-sm mt-1 font-body">Sign in to manage your livestock operations.</Text>
            </View>

            <InputField
              label="Email Address"
              value={email}
              onChangeText={(val) => handleInputChange(setEmail, val)}
              placeholder="e.g. usman@saylani.org"
              icon="mail-outline"
              keyboardType="email-address"
            />

            <View className="mb-2">
              <InputField
                label="Security Password"
                value={password}
                onChangeText={(val) => handleInputChange(setPassword, val)}
                placeholder="••••••••"
                icon="lock-outline"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px]"
              >
                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {(error || localError) && (
              <View className="mb-6 bg-red-50 p-3 rounded-2xl border border-red-100 flex-row items-center gap-2">
                <MaterialIcons name="error-outline" size={16} color="#dc2626" />
                <Text className="text-red-600 text-xs font-bold font-body flex-1">
                  {localError || error}
                </Text>
              </View>
            )}

            <TouchableOpacity onPress={handleLogin} activeOpacity={0.9} disabled={loading} className="mt-2">
              <LinearGradient
                colors={loading ? ["#9ca3af", "#6b7280"] : ["#006a35", "#008a4c"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-full py-4 items-center justify-center flex-row shadow-lg shadow-[#006a35]/30"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="text-white font-black text-lg mr-2 font-headline">Login to System</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="white" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View className="mt-8 pt-6 border-t border-gray-50 items-center">
              <TouchableOpacity><Text className="text-[#006a35] font-bold font-body">Request System Access</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-10 left-0 right-0 items-center"
      >
        <Text className="text-gray-400 text-[10px] font-bold tracking-widest uppercase font-body">
          Saylani Welfare International Trust
        </Text>
        <Text className="text-gray-300 text-[9px] mt-1 uppercase tracking-tighter font-body">
          © 2024 Pastoral Management System
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}