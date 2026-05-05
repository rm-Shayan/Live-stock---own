import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { ScrollView, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchDashboardStats } from "../../store/dashboardSlice";
import { fetchBranches } from "../../store/branchSlice";
import { BottomNavBar } from "../../components/BottomNavBar";
import { TopAppBar } from "../../components/TopAppBar";
import { SCROLL_BOTTOM_PADDING, SCROLL_TOP_OFFSET } from "../../constants";
import { AnalyticsChart } from "../../components/AnalyticsChart";

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

export default function ReportsDashboardScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loading, error } = useSelector((state: RootState) => state.dashboard);
  const { branches } = useSelector((state: RootState) => state.branches);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchBranches());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchDashboardStats());
    dispatch(fetchBranches());
  };

 
  const dynamicStats = [
    {
      title: "Warehouse Stock",
      value: (stats?.warehouse?.availableInMainStock ?? 0).toString(),
      icon: "inventory" as MaterialIconName,
    },
    {
      title: "System Animals",
      value: (stats?.warehouse?.totalAnimalsInSystem ?? 0).toString(),
      icon: "pets" as MaterialIconName,
    },
    {
      title: "Total Meat",
      value: `${stats?.globalInventory?.totalMeatInStock || 0} kg`,
      icon: "restaurant" as MaterialIconName,
    },
    {
      title: "Skins Total",
      value: (stats?.globalInventory?.totalSkinsInStock ?? 0).toString(),
      icon: "layers" as MaterialIconName,
    },
    {
      title: "Trotters/Paye",
      value: (stats?.globalInventory?.totalPayeInStock ?? 0).toString(),
      icon: "animation" as MaterialIconName,
    },
    {
      title: "Active Branches",
      value: (branches?.length || stats?.branchWiseReport?.length || 0).toString(),
      icon: "storefront" as MaterialIconName,
    },
  ];

  if (loading && !stats) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#006a35" />
        <Text className="mt-4 text-outline font-body">Generating Analytics...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f8faf9" }}>
      <TopAppBar />

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: SCROLL_TOP_OFFSET,
          paddingBottom: SCROLL_BOTTOM_PADDING + 40,
          paddingHorizontal: 20,
        }}
        contentOffset={{ x: 0, y: 0 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor="#006a35" />}
      >
        <View className="mb-8 mt-4">
          <Text className="text-3xl font-headline font-extrabold tracking-tight text-primary">
            Operations Report
          </Text>
          <Text className="text-on-surface-variant font-body mt-1">
            Real-time analytics from across all branches
          </Text>
        </View>

        {/* Dynamic Summary Cards */}
        <View className="flex-row flex-wrap justify-between gap-y-4 mb-10">
          {dynamicStats.map((item, index) => {
            const isLast = index === dynamicStats.length - 1;
            return (
              <View
                key={index}
                className={`${isLast ? "w-full" : "w-[48%]"} bg-white p-5 rounded-2xl border border-[#00612c]/10`}
                style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { height: 4, width: 0 } }}
              >
                <View className="bg-[#006a35]/10 w-10 h-10 rounded-full items-center justify-center mb-3">
                  <MaterialIcons name={item.icon} size={20} color="#006a35" />
                </View>
                <Text className="text-outline text-[10px] uppercase font-semibold mb-1 font-body">{item.title}</Text>
                <Text 
                  adjustsFontSizeToFit 
                  numberOfLines={1} 
                  className="text-2xl font-bold text-on-surface font-headline"
                >
                  {item.value}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Productivity Chart (Bar) */}
        <View className="mb-8">
          <AnalyticsChart 
            title="Branch Productivity"
            subtitle="Top performing branches by volume"
            type="bar"
            data={stats?.branchWiseReport && stats.branchWiseReport.length > 0 ? stats.branchWiseReport.map(b => ({
              label: b.branchName.slice(0, 3).toUpperCase(),
              value: b.animalsSlaughtered
            })) : []}
            height={200}
          />
        </View>

        {/* Detailed Branch Analysis */}
        <View className="mb-10">
          <Text className="text-xl font-headline font-bold text-on-surface mb-4">
            Live Branch Monitoring
          </Text>

          {!stats?.branchWiseReport || stats.branchWiseReport.length === 0 ? (
            <View className="bg-white p-10 rounded-3xl items-center border border-dashed border-outline/20">
              <MaterialIcons name="analytics" size={48} color="#94a3b8" />
              <Text className="text-outline font-body mt-4">No branch data available yet</Text>
            </View>
          ) : (
            stats.branchWiseReport.map((branch, idx) => (
              <View
                key={idx}
                className="bg-white p-6 rounded-3xl mb-4 border border-[#00612c]/5"
                style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { height: 6, width: 0 } }}
              >
                <View className="flex-row justify-between items-start mb-6">
                  <View>
                    <Text className="font-headline font-bold text-lg text-on-surface">{branch.branchName}</Text>
                    <Text className="text-[10px] font-body text-outline uppercase tracking-widest font-bold mt-1">Operational Division</Text>
                  </View>
                  <View className={`rounded-full px-3 py-1 ${branch.animalsSlaughtered > 0 ? "bg-emerald-50" : "bg-amber-50"}`}>
                    <Text className={`text-[10px] font-bold uppercase font-body ${branch.animalsSlaughtered > 0 ? "text-emerald-700" : "text-amber-700"}`}>
                      {branch.animalsSlaughtered > 0 ? "Active" : "Pending Activity"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row flex-wrap justify-between gap-y-6">
                  <StatItem label="Received" value={branch.totalReceived} />
                  <StatItem label="Slaughtered" value={branch.animalsSlaughtered} isPrimary />
                  <StatItem label="Remaining" value={branch.totalReceived - branch.animalsSlaughtered} />
                  <StatItem label="Meat (KG)" value={branch.currentMeatStock} />
                  <StatItem label="Skins" value={branch.currentSkinStock} />
                  <StatItem label="Paye" value={branch.currentPayeStock} />
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <BottomNavBar />
    </View>
  );
}

const StatItem = ({ label, value, isPrimary = false }: { label: string, value: number | string, isPrimary?: boolean }) => (
  <View className="w-[30%]">
    <Text className="text-[10px] text-outline uppercase tracking-wider font-bold mb-1 font-body">{label}</Text>
    <Text className={`font-headline font-bold ${isPrimary ? "text-primary text-lg" : "text-on-surface text-base"}`}>
      {value}
    </Text>
  </View>
);
