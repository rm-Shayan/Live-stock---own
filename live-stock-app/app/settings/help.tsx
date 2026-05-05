import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomNavBar } from "../../components/BottomNavBar";
import { TopAppBar } from "../../components/TopAppBar";
import { SCROLL_TOP_OFFSET, SCROLL_BOTTOM_PADDING } from "../../constants";

export default function HelpSupportScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      {/* TopAppBar */}
      <TopAppBar label="Help & Support" showBack />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + SCROLL_TOP_OFFSET,
          paddingBottom: SCROLL_BOTTOM_PADDING,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search & Hero */}
        <View className="space-y-6 pt-4 mb-10">
          <View>
            <Text className="text-4xl font-extrabold tracking-tight text-primary leading-tight font-headline">
              How can we help?
            </Text>
            <Text className="text-on-surface-variant font-body mt-2">
              Find answers to your questions about livestock management, health
              tracking, and more.
            </Text>
          </View>
          <View className="relative mt-6">
            <View className="absolute left-4 z-10 h-full justify-center">
              <MaterialIcons name="search" size={24} className="text-outline" />
            </View>
            <TextInput
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl h-16 pl-14 pr-6 text-lg font-body text-on-surface"
              placeholder="Search help topics, guides, or FAQs..."
              placeholderTextColor="#6f7a6e"
            />
          </View>
        </View>

        {/* FAQ Categories Bento Grid */}
        <View className="space-y-6 mb-10">
          <View className="flex-row justify-between items-end mb-4">
            <Text className="text-xl font-bold tracking-tight text-on-surface font-headline">
              Common FAQ Categories
            </Text>
            <TouchableOpacity>
              <Text className="text-primary font-semibold text-sm font-body">
                View all
              </Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            {/* Batches */}
            <TouchableOpacity
              className="bg-surface-container-lowest p-6 rounded-xl flex-row items-center gap-4 mt-4"
              style={{
                elevation: 2,
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 16,
                shadowOffset: { height: 4, width: 0 },
              }}

              onPress={()=>router.push("/batches")}
            >
              <View className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                <MaterialIcons
                  name="inventory-2"
                  size={24}
                  className="text-primary"
                />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-lg text-on-surface font-headline">
                  Batches
                </Text>
                <Text className="text-sm text-on-surface-variant font-body mt-1">
                  Managing arrivals, group moves, and identification.
                </Text>
              </View>
            </TouchableOpacity>

            {/* Allocation */}
            <TouchableOpacity
              className="bg-surface-container-lowest p-6 rounded-xl flex-row items-center gap-4 mt-4"
              style={{
                elevation: 2,
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 16,
                shadowOffset: { height: 4, width: 0 },
              }}
              onPress={()=>router.push(`/allocations`)}
            >
              <View className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                <MaterialIcons
                  name="grid-on"
                  size={24}
                  className="text-primary"
                />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-lg text-on-surface font-headline">
                  Allocation
                </Text>
                <Text className="text-sm text-on-surface-variant font-body mt-1">
                  Pasture rotation, feed calculations, and land use.
                </Text>
              </View>
            </TouchableOpacity>

            {/* Health Tracking */}
            <TouchableOpacity
              className="bg-surface-container-lowest p-6 rounded-xl flex-row items-center gap-4 mt-4"
              style={{
                elevation: 2,
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 16,
                shadowOffset: { height: 4, width: 0 },
              }}
              onPress={()=>router.push('/reports')}
            >
              <View className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                <MaterialIcons
                  name="medical-services"
                  size={24}
                  className="text-primary"
                />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-lg text-on-surface font-headline">
                 System Track
                </Text>
                <Text className="text-sm text-on-surface-variant font-body mt-1">
                  Animals logs, slaughter, and record keeping.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Resources Section (High-End Cards) */}
        <View className="space-y-6 mb-10">
          <Text className="text-xl font-bold tracking-tight text-on-surface font-headline mb-4">
            Learning Resources
          </Text>
          <View className="space-y-6">
            {/* Video Tutorials */}
            <TouchableOpacity
              className="relative h-64 rounded-xl overflow-hidden mt-4"
              activeOpacity={0.9}
              style={{ elevation: 4 }}
            >
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCc-ez-KmMCwYR-d-C8J8akdG7O3FFrcWaUz1p4KoJSVXaRw9KxGpxYXgbZLXxaodEtMz160kfzyuNMqDILTs7yn0qD_t8GY0CHY4rqQ7dz5moEFlGoY4p8rO9z5DLNMuWRcjntE2iZ-EJvABaCm0I8UMDRYXiPnNJTauYRizGYNPUi74-jsfYq2mw-aSfF94KMZFaOEHEllI1rYO52KhxI4GaLhy5cUib0gGCoVHhH-Jh1XZrdSoxfIiWdtFzWjCI60-zUQ0NPeh0",
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(0, 97, 44, 0.9)"]}
                className="absolute inset-0 justify-end p-6"
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons
                    name="play-circle"
                    size={16}
                    color="rgba(255,255,255,0.8)"
                  />
                  <Text className="text-white/80 text-xs font-bold uppercase tracking-widest font-body">
                    Video Tutorials
                  </Text>
                </View>
                <Text className="text-white text-2xl font-bold font-headline">
                  Mastering the Dashboard
                </Text>
                <Text className="text-white/80 text-sm mt-1 font-body">
                  15 bite-sized videos to get you started.
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* User Guide */}
            <View className="bg-secondary-container rounded-xl p-8 justify-between mt-4 border border-primary/5">
              <View>
                <MaterialIcons
                  name="menu-book"
                  size={40}
                  className="text-primary mb-4"
                />
                <Text className="text-2xl font-bold text-[#364c3d] font-headline mb-2">
                  Detailed User Guide
                </Text>
                <Text className="text-on-secondary-container leading-relaxed font-body">
                  Everything from technical specs to deep-dives on predictive
                  welfare analytics.
                </Text>
              </View>
              <TouchableOpacity className="mt-8 bg-primary flex-row items-center justify-center gap-2 px-6 py-4 rounded-full active:opacity-90 self-start">
                <Text className="text-on-primary font-bold font-body">
                  Download PDF
                </Text>
                <MaterialIcons name="download" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Support Options */}
        <View className="bg-surface-container-low rounded-2xl p-8 mb-10">
          <View className="items-center mb-8">
            <Text className="text-2xl font-bold text-on-surface font-headline mb-2">
              Still need help?
            </Text>
            <Text className="text-on-surface-variant text-center font-body">
              Our support team is available 24/7 for critical livestock issues.
            </Text>
          </View>
          <View className="flex-row justify-between">
            {/* Chat */}
            <View className="flex-1 items-center pb-4">
              <View
                className="w-14 h-14 rounded-full bg-surface-container-lowest flex items-center justify-center mb-3"
                style={{ elevation: 2 }}
              >
                <MaterialIcons
                  name="chat-bubble"
                  size={24}
                  className="text-primary"
                />
              </View>
              <Text className="font-bold text-on-surface font-body mb-1">
                Live Chat
              </Text>
              <Text className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold font-body">
                Wait: 2m
              </Text>
            </View>

            {/* Email */}
            <View className="flex-1 items-center border-x border-outline-variant/20 pb-4 px-2">
              <View
                className="w-14 h-14 rounded-full bg-surface-container-lowest flex items-center justify-center mb-3"
                style={{ elevation: 2 }}
              >
                <MaterialIcons name="mail" size={24} className="text-primary" />
              </View>
              <Text className="font-bold text-on-surface font-body mb-1">
                Email
              </Text>
              <Text className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold font-body">
                Reply: 4h
              </Text>
            </View>

            {/* Call */}
            <View className="flex-1 items-center pb-4">
              <View
                className="w-14 h-14 rounded-full bg-surface-container-lowest flex items-center justify-center mb-3"
                style={{ elevation: 2 }}
              >
                <MaterialIcons name="call" size={24} className="text-primary" />
              </View>
              <Text className="font-bold text-on-surface font-body mb-1">
                Call Us
              </Text>
              <Text className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold font-body">
                Direct Line
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNavBar />
    </View>
  );
}
