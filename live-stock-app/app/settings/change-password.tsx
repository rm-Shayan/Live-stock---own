import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TopAppBar } from "../../components/TopAppBar";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Password updated successfully");
      router.back();
    }, 1500);
  };

  const PasswordField = ({ 
    label, 
    value, 
    onChangeText, 
    show, 
    setShow, 
    placeholder 
  }: { 
    label: string; 
    value: string; 
    onChangeText: (text: string) => void; 
    show: boolean; 
    setShow: (show: boolean) => void; 
    placeholder: string;
  }) => (
    <View className="mb-6">
      <Text className="text-outline text-[11px] font-bold mb-2 ml-1 uppercase tracking-wider font-headline">
        {label}
      </Text>
      <View className="flex-row items-center bg-surface-container-lowest border border-surface-container-high rounded-2xl px-4 py-1">
        <MaterialIcons name="lock" size={20} color="#00612c" />
        <TextInput
          className="flex-1 h-12 ml-3 text-on-surface font-body"
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          secureTextEntry={!show}
          value={value}
          onChangeText={onChangeText}
        />
        <TouchableOpacity onPress={() => setShow(!show)}>
          <MaterialIcons
            name={show ? "visibility" : "visibility-off"}
            size={20}
            color="#94a3b8"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <TopAppBar label="Change Password" showBack backPath="/settings" />

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: insets.bottom + 40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mt-4">
            <View className="mb-8">
              <Text className="text-on-surface text-2xl font-headline font-extrabold tracking-tight">
                Secure Your Account
              </Text>
              <Text className="text-outline text-sm mt-1 font-body">
                Set a strong password to protect your livestock data.
              </Text>
            </View>

            <View className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-container-low" style={{ elevation: 2 }}>
              <PasswordField
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                show={showCurrent}
                setShow={setShowCurrent}
                placeholder="••••••••"
              />

              <View className="h-[1px] bg-surface-container-high w-full mb-6" />

              <PasswordField
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                show={showNew}
                setShow={setShowNew}
                placeholder="••••••••"
              />

              <PasswordField
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                show={showConfirm}
                setShow={setShowConfirm}
                placeholder="••••••••"
              />

              <TouchableOpacity 
                onPress={handleUpdatePassword} 
                activeOpacity={0.9}
                disabled={loading}
              >
                <LinearGradient
                  colors={["#00612c", "#007d3a"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="rounded-2xl py-4 items-center justify-center flex-row shadow-lg"
                  style={{ elevation: 4 }}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Text className="text-white font-bold text-base mr-2 font-body">
                        Update Password
                      </Text>
                      <MaterialIcons name="security" size={18} color="white" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View className="mt-8 p-6 bg-secondary-container/20 rounded-2xl border border-secondary-container/30">
              <View className="flex-row items-center gap-3 mb-2">
                <MaterialIcons name="info" size={20} color="#00612c" />
                <Text className="text-on-secondary-container font-bold text-sm font-headline">
                  Password Requirements
                </Text>
              </View>
              <Text className="text-on-secondary-container/70 text-xs leading-relaxed font-body">
                • Minimum 8 characters long{"\n"}
                • Include at least one special character{"\n"}
                • Mix of uppercase and lowercase letters
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
