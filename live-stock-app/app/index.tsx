import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useCallback } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchBatches } from "../store/batchSlice";
import { fetchBranches } from "../store/branchSlice";
import { fetchDashboardStats } from "../store/dashboardSlice";
import { BottomNavBar } from "../components/BottomNavBar";
import { TopAppBar } from "../components/TopAppBar";
import { AnalyticsChart } from "../components/AnalyticsChart";
import {
  FAB_BOTTOM_OFFSET,
  SCROLL_BOTTOM_PADDING,
  SCROLL_TOP_OFFSET,
} from "../constants";
import { LinearGradient } from "expo-linear-gradient";

// --------------- Skeleton Components ---------------
function SkeletonBox({ width, height, borderRadius = 8, style = {} }: any) {
  const anim = React.useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#d1fae5",
          opacity: anim,
        },
        style,
      ]}
    />
  );
}

function MetricCardSkeleton() {
  return (
    <View className="w-[48%] bg-white rounded-xl p-4 border-b-4 border-[#d1fae5]" style={{ elevation: 2 }}>
      <SkeletonBox width={24} height={24} borderRadius={4} style={{ marginBottom: 8 }} />
      <SkeletonBox width={70} height={10} borderRadius={4} style={{ marginBottom: 6 }} />
      <SkeletonBox width={50} height={28} borderRadius={6} />
    </View>
  );
}

function BatchCardSkeleton() {
  return (
    <View className="bg-white p-4 rounded-xl flex-row items-center gap-4 mb-3" style={{ elevation: 1 }}>
      <SkeletonBox width={48} height={48} borderRadius={10} />
      <View className="flex-1 gap-2">
        <SkeletonBox width="60%" height={14} borderRadius={4} />
        <SkeletonBox width="40%" height={11} borderRadius={4} />
      </View>
      <SkeletonBox width={50} height={22} borderRadius={20} />
    </View>
  );
}

// --------------- Main Dashboard ---------------
export default function MobileDashboard() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();

  const { batches, loading: batchesLoading } = useSelector((state: RootState) => state.batches);
  const { branches } = useSelector((state: RootState) => state.branches);
  const { stats, loading: statsLoading, error } = useSelector((state: RootState) => state.dashboard);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const loading = batchesLoading || statsLoading;

  const scrollRef = useRef<ScrollView>(null);

  const loadData = () => {
    dispatch(fetchBatches());
    dispatch(fetchBranches());
    dispatch(fetchDashboardStats());
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const totalAnimals = stats?.warehouse.totalAnimalsInSystem ?? 0;
  const totalAllocated = stats?.warehouse.totalSentToBranches ?? 0;
  const remaining = stats?.warehouse.availableInMainStock ?? 0;
  const totalSlaughtered = stats?.globalInventory.totalSlaughtered ?? 0;
  const activeBranches = branches.length || stats?.branchWiseReport?.length || 0;
  const pendingAllocations = stats?.statusCounts.pending ?? 0;
  const receivedAllocations = stats?.statusCounts.received ?? 0;
  const totalCost = totalAnimals * 50000;

  const metricCards = [
    {
      label: "Total Animals",
      value: totalAnimals,
      icon: "pets" as const,
      borderColor: "border-primary",
      iconClass: "text-primary",
    },
    {
      label: "Sent to Branches",
      value: totalAllocated,
      icon: "call-split" as const,
      borderColor: "border-secondary",
      iconClass: "text-secondary",
    },
    {
      label: "Main Stock",
      value: remaining,
      icon: "inventory-2" as const,
      borderColor: "border-tertiary",
      iconClass: "text-tertiary",
    },
    {
      label: "Total Slaughtered",
      value: totalSlaughtered,
      icon: "content-cut" as const,
      borderColor: "border-red-400",
      iconClass: "text-red-400",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#f8faf9" }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <TopAppBar />

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: SCROLL_TOP_OFFSET,
          paddingBottom: SCROLL_BOTTOM_PADDING + 20,
          paddingHorizontal: 16,
        }}
        contentOffset={{ x: 0, y: 0 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} colors={["#006a35"]} tintColor="#006a35" />}
      >
        {error && (
          <View className="bg-red-50 p-4 rounded-xl mb-4 border border-red-100 flex-row items-center gap-3">
            <MaterialIcons name="error-outline" size={20} color="#dc2626" />
            <Text className="text-red-700 text-xs font-body flex-1">{error}</Text>
          </View>
        )}
        {/* Welcome Header */}
        <View className="mb-6 px-1">
          <Text className="text-outline text-sm font-body">
            Welcome back,
          </Text>
          <Text className="font-headline font-bold text-2xl text-on-background tracking-tight">
            {user?.username || "Admin"} 👋
          </Text>
        </View>

        {/* -------- Key Metrics -------- */}
        <View className="mb-6">
          <View className="flex-row items-end justify-between mb-4 px-1">
            <Text className="font-headline font-bold text-xl text-on-background tracking-tight">
              Live Stock Overview
            </Text>
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-primary" />
              <Text className="font-label text-xs text-primary font-semibold">Live</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-4">
            {loading
              ? [0, 1, 2, 3].map((i) => <MetricCardSkeleton key={i} />)
              : metricCards.map((card) => (
                  <View
                    key={card.label}
                    className={`w-[48%] bg-white rounded-xl p-4 border-b-4 ${card.borderColor}`}
                    style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { height: 4, width: 0 } }}
                  >
                    <MaterialIcons name={card.icon} size={24} className={`${card.iconClass} mb-2`} />
                    <Text className="text-outline text-[10px] font-bold uppercase tracking-wider mb-1">
                      {card.label}
                    </Text>
                    <Text 
                      adjustsFontSizeToFit 
                      numberOfLines={1} 
                      className="font-headline font-extrabold text-2xl text-on-surface"
                    >
                      {card.value.toLocaleString()}
                    </Text>
                  </View>
                ))}

            {/* Investment Card */}
            {loading ? (
              <View className="w-[48%] bg-[#d1fae5] rounded-xl p-4" style={{ elevation: 2 }}>
                <SkeletonBox width={24} height={24} borderRadius={4} style={{ marginBottom: 8 }} />
                <SkeletonBox width={70} height={10} borderRadius={4} style={{ marginBottom: 6 }} />
                <SkeletonBox width={60} height={28} borderRadius={6} />
              </View>
            ) : (
              <View
                className="w-[48%] bg-[#006a35] rounded-xl p-4 relative overflow-hidden"
                style={{ elevation: 4, shadowColor: "#006a35", shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { height: 6, width: 0 } }}
              >
                <View className="absolute -right-4 -top-4 opacity-10">
                  <MaterialIcons name="payments" size={80} color="white" />
                </View>
                <MaterialIcons name="account-balance" size={24} color="white" className="mb-2" />
                <Text className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Investment
                </Text>
                <View className="flex-row items-baseline gap-1">
                  <Text 
                    adjustsFontSizeToFit 
                    numberOfLines={1} 
                    className="font-headline font-extrabold text-xl text-white flex-1"
                  >
                    {totalCost > 1000000
                      ? (totalCost / 1000000).toFixed(1) + "M"
                      : (totalCost / 1000).toFixed(0) + "k"}
                  </Text>
                  <Text className="text-[10px] font-bold text-white opacity-80">PKR</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* -------- Allocation Status -------- */}
        <View className="mb-6">
          <Text className="font-headline font-bold text-xl text-on-background tracking-tight px-1 mb-4">
            Allocation Status
          </Text>
          {loading ? (
            <View className="flex-row gap-3">
              <SkeletonBox width="48%" height={90} borderRadius={14} />
              <SkeletonBox width="48%" height={90} borderRadius={14} />
            </View>
          ) : (
            <View className="flex-row gap-3">
              <View className="flex-1 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <MaterialIcons name="hourglass-empty" size={20} color="#f59e0b" />
                <Text className="text-amber-800 font-bold text-2xl font-headline mt-1">
                  {pendingAllocations}
                </Text>
                <Text className="text-amber-600 text-xs font-bold uppercase tracking-wider">Pending</Text>
              </View>
              <View className="flex-1 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                <MaterialIcons name="check-circle" size={20} color="#059669" />
                <Text className="text-emerald-800 font-bold text-2xl font-headline mt-1">
                  {receivedAllocations}
                </Text>
                <Text className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Received</Text>
              </View>
            </View>
          )}
        </View>

        {/* -------- Chart -------- */}
        <AnalyticsChart
          title="Branch Distribution"
          subtitle="Livestock received across active branches"
          type="bar"
          data={stats?.branchWiseReport && stats.branchWiseReport.length > 0 ? stats.branchWiseReport.map(b => ({
            value: b.totalReceived || 0,
            label: b.branchName.substring(0, 3).toUpperCase()
          })) : []}
        />

        {/* -------- Branch Network -------- */}
        <View className="mb-6 mt-2">
          <Text className="font-headline font-bold text-xl text-on-background tracking-tight px-1 mb-4">
            Branch Network
          </Text>
          {loading ? (
            <SkeletonBox width="100%" height={72} borderRadius={16} />
          ) : (
            <View className="bg-emerald-50 p-5 rounded-2xl flex-row items-center justify-between border border-emerald-100">
              <View className="flex-row items-center gap-4 flex-1">
                <View className="w-12 h-12 bg-white rounded-full items-center justify-center" style={{ elevation: 1 }}>
                  <MaterialIcons name="storefront" size={24} color="#006a35" />
                </View>
                <View className="flex-1">
                  <Text className="text-emerald-900 font-headline font-bold text-lg leading-tight">
                    {activeBranches} Active {activeBranches === 1 ? "Branch" : "Branches"}
                  </Text>
                  <Text className="text-emerald-700 opacity-70 text-xs font-medium">
                    Monitoring in real-time
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="bg-[#006a35] px-4 py-2 rounded-full ml-2"
                onPress={() => router.push("/(admin)/branches")}
              >
                <Text className="text-white text-xs font-bold uppercase tracking-widest">View</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* -------- Recent Batches -------- */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between px-1 mb-4">
            <Text className="font-headline font-bold text-xl text-on-background tracking-tight">
              Recent Batches
            </Text>
            <TouchableOpacity className="flex-row items-center gap-1 active:opacity-70" onPress={() => router.push("/batches")}>
              <Text className="text-primary text-sm font-bold">See All</Text>
              <MaterialIcons name="arrow-forward" size={16} className="text-primary" />
            </TouchableOpacity>
          </View>

          {batchesLoading
            ? [0, 1, 2].map((i) => <BatchCardSkeleton key={i} />)
            : batches.slice(0, 3).map((batch) => (
                <View
                  key={batch._id}
                  className="bg-white p-4 rounded-xl flex-row items-center gap-4 mb-3 border border-[#00612c]/5"
                  style={{ elevation: 1 }}
                >
                  <View className="w-12 h-12 bg-emerald-50 rounded-lg items-center justify-center">
                    <MaterialIcons name="inventory" size={24} color="#006a35" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-1">
                      <Text className="font-bold text-on-surface font-headline">{batch.BatchNum}</Text>
                      <View className="bg-emerald-100 px-2 py-0.5 rounded-full">
                        <Text className="text-emerald-800 text-[10px] font-bold uppercase">
                          {batch.Category}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-1 mt-1">
                      <MaterialIcons name="schedule" size={14} color="#64748b" />
                      <Text className="text-outline text-xs">
                        {new Date(batch.ArrivalDate).toLocaleDateString()}
                      </Text>
                      <Text className="text-outline text-xs mx-1">•</Text>
                      <MaterialIcons 
                        name={batch.remainingAnimals === 0 ? "check-circle" : "pie-chart"} 
                        size={14} 
                        color={batch.remainingAnimals === 0 ? "#10b981" : "#64748b"} 
                      />
                      <Text className={`text-xs font-bold ${batch.remainingAnimals === 0 ? "text-emerald-600" : "text-outline"}`}>
                        {batch.remainingAnimals} / {batch.TotalAnimals} left
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

          {batches.length === 0 && !batchesLoading && (
            <View className="items-center py-10 bg-white rounded-xl border border-dashed border-outline/20">
              <MaterialIcons name="inventory-2" size={40} color="#94a3b8" />
              <Text className="text-outline font-body mt-2">No batches registered yet.</Text>
            </View>
          )}
        </View>

        {/* -------- Visual Anchor -------- */}
        <View className="rounded-2xl overflow-hidden h-32 relative mb-4">
          <Image
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIkZfNRsOcKMOaUcdnplSawhlMIfjQ6IyRfQ1J5w2tvIcRHQlRZ-2M60iXuwL1SuvOCgQ3RIUYSXyEX81cIQetEQYETXNe5NgDYTh2_TEUfUGsQtN7C8mYU3aDqsdtsAzm3oH21_cQC-mro1ll7Y_qEd8c87u7HMO8x0VMXGMe-pbVKKwLFMf10PXC6xdavHuLof2CZhPtteXi4cjg-dXLbKDA4IEN_LQXCIZhBXQnpoculAnuurc4YX_zSTUWCUxqkM_2ATdtses" }}
            className="w-full h-full"
            style={{ resizeMode: 'cover' }}
          />
          <View className="absolute inset-0 bg-black/40 justify-end p-6">
            <Text className="text-white font-headline font-bold text-lg">Saylani Live Stock</Text>
            <Text className="text-white/80 text-xs">Optimizing livestock distribution & management</Text>
          </View>
        </View>
      </ScrollView>

      <BottomNavBar />

      {/* FAB */}
      <TouchableOpacity
        className="absolute right-6 bg-[#006a35] rounded-full items-center justify-center active:scale-95 shadow-2xl z-40"
        style={{
          width: 60,
          height: 60,
          bottom: insets.bottom + FAB_BOTTOM_OFFSET,
          elevation: 8,
          shadowColor: "#006a35",
          shadowOpacity: 0.4,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          borderRadius: 30,
          overflow: "hidden",
        }}
        onPress={() => router.push("/batches/add")}
      >
        <MaterialIcons name="add" size={32} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
} 