import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { logoutUser } from "../../store/authSlice";
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomNavBar } from "../../components/BottomNavBar";
import { TopAppBar } from "../../components/TopAppBar";
import {
  DEFAULT_AVATAR_URL,
  SCROLL_BOTTOM_PADDING,
  SCROLL_TOP_OFFSET,
} from "../../constants";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English (US)");
  const [notifMode, setNotifMode] = useState("All Notifications");

  return (
    <View className="flex-1 bg-background">
      {/* Use the shared TopAppBar component */}
      <TopAppBar label="Settings" showBack backPath="/" />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + SCROLL_TOP_OFFSET,
          paddingBottom: SCROLL_BOTTOM_PADDING,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Section */}
        <View
          className="mb-6 flex-row flex-wrap items-center gap-6 bg-surface-container-lowest p-6 rounded-xl mt-4"
          style={{
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 16,
            shadowOffset: { height: 4, width: 0 },
          }}
        >
          <View className="relative md:mx-0">
            <View className="w-24 h-24 rounded-full overflow-hidden bg-surface-container-high border-4 border-surface-container-low">
              <Image
                source={{
                  uri: DEFAULT_AVATAR_URL,
                }}
                className="w-full h-full object-cover"
              />
            </View>
            <TouchableOpacity
              onPress={() => router.push("/profile/edit")}
              className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-white"
              style={{ overflow: "hidden", borderRadius: 16 }}
            >
              <MaterialIcons name="edit" size={14} color="white" />
            </TouchableOpacity>
          </View>
          <View className="flex-1 items-start mt-2 md:mt-0">
            <Text className="text-2xl font-headline font-extrabold tracking-tight text-on-background">
              {user?.username || "Guest User"}
            </Text>
            <Text className="text-outline font-body text-sm mt-1">
              {user?.email || "No email provided"}
            </Text>
            <View className="mt-3 flex-row flex-wrap gap-2 ">
              <View className="bg-secondary-container rounded-full px-4 py-2 self-start">
                <Text className="text-on-secondary-container text-[10px] font-semibold tracking-wide uppercase font-body">
                  {user?.role || "User"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Groups */}
        <View className="space-y-4">
          {/* Account Section */}
          <View className="space-y-4 mb-4">
            <Text className="text-xs font-headline font-bold text-primary tracking-widest uppercase px-2 mb-2">
              Account
            </Text>
            <View
              className="bg-surface-container-lowest rounded-xl overflow-hidden"
              style={{ elevation: 1 }}
            >
              <TouchableOpacity
                className="w-full flex-row items-center justify-between p-5 active:bg-surface-container-low transition-colors"
                onPress={() => router.push("/profile")}
              >
                <View className="flex-row items-center gap-4">
                  <MaterialIcons
                    name="person"
                    size={24}
                    className="text-outline"
                  />
                  <Text className="font-body font-medium text-on-surface">
                    Profile Info
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  className="text-outline-variant"
                />
              </TouchableOpacity>
              <View className="h-[1px] bg-background w-full" />
              <TouchableOpacity
                className="w-full flex-row items-center justify-between p-5 active:bg-surface-container-low transition-colors"
                onPress={() => router.push("/profile/edit")}
              >
                <View className="flex-row items-center gap-4">
                  <MaterialIcons
                    name="edit"
                    size={24}
                    className="text-outline"
                  />
                  <Text className="font-body font-medium text-on-surface">
                    Edit Profile
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  className="text-outline-variant"
                />
              </TouchableOpacity>
              <View className="h-[1px] bg-background w-full" />
              <TouchableOpacity
                className="w-full flex-row items-center justify-between p-5 active:bg-surface-container-low transition-colors"
                onPress={() => router.push("/settings/change-password")}
              >
                <View className="flex-row items-center gap-4">
                  <MaterialIcons
                    name="lock-reset"
                    size={24}
                    className="text-outline"
                  />
                  <Text className="font-body font-medium text-on-surface">
                    Change Password
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  className="text-outline-variant"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* App Settings Section */}
          <View className="space-y-4 mb-4">
            <Text className="text-xs font-headline font-bold text-primary tracking-widest uppercase px-2 mb-2">
              App Settings
            </Text>
            <View
              className="bg-surface-container-lowest rounded-xl overflow-hidden"
              style={{ elevation: 1 }}
            >
              <View>
                <TouchableOpacity
                  onPress={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="w-full flex-row items-center justify-between p-5 active:bg-surface-container-low transition-colors"
                >
                  <View className="flex-row items-center gap-4">
                    <MaterialIcons
                      name="notifications"
                      size={24}
                      className="text-primary"
                    />
                    <Text className="font-body font-medium text-on-surface">
                      Notifications
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xs text-outline font-medium font-body">
                      {notifMode}
                    </Text>
                    <MaterialIcons
                      name={notifDropdownOpen ? "expand-less" : "expand-more"}
                      size={24}
                      className="text-outline-variant"
                    />
                  </View>
                </TouchableOpacity>
                {notifDropdownOpen && (
                  <View className="bg-surface-container-low/30 px-5 pb-4 space-y-2">
                    {["All Notifications", "Critical Only", "Muted"].map(
                      (mode) => (
                        <TouchableOpacity
                          key={mode}
                          onPress={() => {
                            setNotifMode(mode);
                            setNotifDropdownOpen(false);
                          }}
                          className={`py-3 px-4 rounded-xl flex-row items-center justify-between ${notifMode === mode ? "bg-primary/10 border border-primary/20" : ""}`}
                        >
                          <Text
                            className={`font-body text-sm ${notifMode === mode ? "text-primary font-bold" : "text-outline"}`}
                          >
                            {mode}
                          </Text>
                          {notifMode === mode && (
                            <MaterialIcons
                              name="check"
                              size={18}
                              color="#00612c"
                            />
                          )}
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                )}
              </View>

              <View className="h-[1px] bg-background w-full" />

              <View>
                <TouchableOpacity
                  onPress={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="w-full flex-row items-center justify-between p-5 active:bg-surface-container-low transition-colors"
                >
                  <View className="flex-row items-center gap-4">
                    <MaterialIcons
                      name="language"
                      size={24}
                      className="text-primary"
                    />
                    <Text className="font-body font-medium text-on-surface">
                      Language
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xs text-outline font-medium font-body">
                      {selectedLang}
                    </Text>
                    <MaterialIcons
                      name={langDropdownOpen ? "expand-less" : "expand-more"}
                      size={24}
                      className="text-outline-variant"
                    />
                  </View>
                </TouchableOpacity>
                {langDropdownOpen && (
                  <View className="bg-surface-container-low/30 px-5 pb-4 space-y-2">
                    {["English (US)", "Urdu", "Sindhi", "Pashto"].map(
                      (lang) => (
                        <TouchableOpacity
                          key={lang}
                          onPress={() => {
                            setSelectedLang(lang);
                            setLangDropdownOpen(false);
                          }}
                          className={`py-3 px-4 rounded-xl flex-row items-center justify-between ${selectedLang === lang ? "bg-primary/10 border border-primary/20" : ""}`}
                        >
                          <Text
                            className={`font-body text-sm ${selectedLang === lang ? "text-primary font-bold" : "text-outline"}`}
                          >
                            {lang}
                          </Text>
                          {selectedLang === lang && (
                            <MaterialIcons
                              name="check"
                              size={18}
                              color="#00612c"
                            />
                          )}
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Log Out */}
          <TouchableOpacity
            onPress={() => {
              dispatch(logoutUser()).then(() => {
                router.replace("/login");
              });
            }}
            className="w-full py-5 flex-row items-center justify-center gap-2 rounded-xl active:bg-error-container/20 transition-colors mb-4"
          >
            <MaterialIcons name="logout" size={20} className="text-error" />
            <Text className="text-error font-headline font-bold text-sm tracking-widest uppercase">
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavBar />
    </View>
  );
}
