import "../global.css"; // Import NativeWind global css
import React, { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import { Provider } from "react-redux";
import { store } from "../store";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CustomDrawerContent } from "../components/CustomDrawerContent";
import { View, ActivityIndicator, Text, Image, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import {
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import { cssInterop } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useSegments } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { getProfile, loadUser } from "../store/authSlice";

cssInterop(LinearGradient, {
  className: "style",
});

SplashScreen.preventAutoHideAsync();

function StartupLoader() {
  return (
    <View className="flex-1 bg-[#f8faf9] items-center justify-center">
      <LinearGradient
        colors={["#f8faf9", "#e0f2e9"]}
        className="absolute inset-0"
      />
      <View className="items-center justify-center">
        <View 
          className="w-24 h-24 bg-white rounded-[2rem] items-center justify-center mb-6 shadow-xl border border-[#006a35]/10"
          style={{
            elevation: 12,
            shadowColor: "#006a35",
            shadowOpacity: 0.2,
            shadowRadius: 15,
            shadowOffset: { height: 8, width: 0 },
          }}
        >
          <Image 
            source={require("../assets/logo_icon.png")} 
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
        </View>
        <Text className="text-[#006a35] font-black text-2xl tracking-tighter mb-4 font-headline text-center">
          SAYLANI LIVE STOCK
        </Text>
        <View className="flex-row items-center gap-3 bg-white/50 px-4 py-2 rounded-full">
          <ActivityIndicator size="small" color="#006a35" />
          <Text className="text-[#006a35]/60 font-bold text-xs uppercase tracking-widest font-body">
            Syncing session...
          </Text>
        </View>
      </View>
    </View>
  );
}

function RootLayoutContent() {
  const { isAppLoading, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const segments = useSegments();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      if (!isAppLoading) {
        SplashScreen.hideAsync();
      }
    }
  }, [fontsLoaded, fontError, isAppLoading]);

  useEffect(() => {
    if (isAppLoading || !fontsLoaded) return;

    const timeout = setTimeout(() => {
      const inAuthGroup = segments[0] === "login";

      if (!isAuthenticated && !inAuthGroup) {
        router.replace("/login");
      } else if (isAuthenticated && inAuthGroup) {
        router.replace("/");
      }
    }, 1);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, segments[0], isAppLoading, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const inAuthGroup = segments[0] === "login";
  const showLoader = isAppLoading || (!isAuthenticated && !inAuthGroup);

  return (
    <View style={{ flex: 1 }}>
      <Drawer 
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen 
          name="index" 
          options={{ 
            drawerItemStyle: { display: 'none' } 
          }} 
        />
        <Drawer.Screen 
          name="login" 
          options={{ 
            swipeEnabled: false, 
            drawerItemStyle: { display: 'none' } 
          }} 
        />
      </Drawer>
      
      {showLoader && (
        <View 
          style={[
            StyleSheet.absoluteFill, 
            { zIndex: 999 }
          ]}
        >
          <StartupLoader />
        </View>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <RootLayoutContent />
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
