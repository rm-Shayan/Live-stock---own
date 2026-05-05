import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { BarChart, LineChart, PieChart } from 'react-native-gifted-charts';
import { LinearGradient } from "expo-linear-gradient";

const SCREEN_WIDTH = Dimensions.get('window').width;

interface ChartProps {
  title: string;
  subtitle?: string;
  type: 'bar' | 'line' | 'pie';
  data: any[];
  height?: number;
}

const formatYLabel = (val: string) => {
  const value = parseFloat(val);
  if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
  if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
  return value.toString();
};

export const AnalyticsChart: React.FC<ChartProps> = ({
  title,
  subtitle,
  type,
  data,
  height = 200,
}) => {
  const primaryColor = '#006a35';
  const secondaryColor = '#059669';

  // Handle empty or invalid data gracefully
  const hasData = data && data.length > 0 && data.some(d => d.value > 0);

  // Generate realistic dummy data for preview if no real data exists
  const getDummyData = () => {
    if (type === 'bar') {
      return [
        { label: 'KHI', value: 450, frontColor: '#059669' },
        { label: 'LHR', value: 320, frontColor: '#059669' },
        { label: 'ISL', value: 280, frontColor: '#059669' },
        { label: 'FSD', value: 150, frontColor: '#059669' },
        { label: 'PEW', value: 90, frontColor: '#059669' },
      ];
    }
    if (type === 'line') {
      return [
        { label: 'Mon', value: 40 },
        { label: 'Tue', value: 55 },
        { label: 'Wed', value: 45 },
        { label: 'Thu', value: 70 },
        { label: 'Fri', value: 85 },
        { label: 'Sat', value: 120 },
        { label: 'Sun', value: 95 },
      ];
    }
    return [
      { label: 'Meat', value: 65, color: '#006a35' },
      { label: 'Skins', value: 20, color: '#059669' },
      { label: 'Other', value: 15, color: '#10b981' },
    ];
  };

  const activeData = hasData ? data : getDummyData();
  const chartWidth = SCREEN_WIDTH - 100;
  
  // Calculate dynamic sizing based on item count
  const itemCount = activeData.length;
  const barWidth = itemCount > 12 ? 16 : itemCount > 8 ? 20 : itemCount > 5 ? 28 : 35;
  const barSpacing = itemCount > 12 ? 14 : itemCount > 8 ? 18 : itemCount > 5 ? 25 : 35;
  const dynamicWidth = itemCount > 4 
    ? itemCount * (barWidth + barSpacing) + 60
    : chartWidth;

  // Calculate max value for better Y-axis scaling
  const maxValue = Math.max(...activeData.map(d => d.value), 1);
  // If max value is small, ensure we show integer steps
  const noOfSections = maxValue > 0 && maxValue <= 5 ? maxValue : 3;

  // Truncate labels safely for bar/line charts
  const truncatedData = activeData.map(d => ({
    ...d,
    label: d.label ? (d.label.length > 4 ? d.label.substring(0, 4) : d.label) : '',
  }));

  return (
    <View 
      className="bg-white rounded-[2.5rem] p-6 mb-4 border border-[#00612c]/5"
      style={{
        elevation: 5,
        shadowColor: '#006a35',
        shadowOpacity: 0.1,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 10 },
      }}
    >
      <View className="mb-6 flex-row justify-between items-start">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-xl font-headline font-extrabold text-on-surface tracking-tight">{title}</Text>
            {!hasData && (
              <View className="bg-amber-100 px-2 py-0.5 rounded-md">
                <Text className="text-[8px] font-black text-amber-700 uppercase">Demo</Text>
              </View>
            )}
          </View>
          {subtitle && (
            <Text className="text-[11px] text-outline font-body mt-1 leading-4 font-medium">{subtitle}</Text>
          )}
        </View>
        <View className="bg-emerald-50 p-2.5 rounded-2xl">
          <MaterialIcons name="analytics" size={20} color="#006a35" />
        </View>
      </View>

      <View className="items-center justify-center" style={{ minHeight: height }}>
        <View style={{ width: '100%', alignItems: 'center', overflow: 'hidden' }}>
          {type === 'bar' && (
            <BarChart
              data={truncatedData}
              height={height}
              width={dynamicWidth}
              barWidth={barWidth}
              spacing={barSpacing}
              noOfSections={noOfSections}
              barBorderRadius={8}
              frontColor={primaryColor}
              gradientColor={secondaryColor}
              showGradient
              yAxisThickness={0}
              xAxisThickness={0}
              rulesType="solid"
              rulesColor="#f1f5f9"
              yAxisLabelWidth={45}
              formatYLabel={formatYLabel}
              yAxisTextStyle={{ color: '#94a3b8', fontSize: 10, fontWeight: '600' }}
              xAxisLabelTextStyle={{ color: '#64748b', fontSize: 9, fontWeight: '700' }}
              isAnimated
              animationDuration={1000}
              hideRules={false}
              yAxisIndicesColor="#f1f5f9"
              rotateLabel={itemCount > 5}
              labelsExtraHeight={itemCount > 5 ? 30 : 0}
              initialSpacing={20}
              endSpacing={15}
              scrollRef={undefined}
              scrollToEnd={false}
              disableScroll={itemCount <= 5}
              showScrollIndicator={itemCount > 5}
            />
          )}

          {type === 'line' && (
            <LineChart
              data={truncatedData}
              height={height}
              width={dynamicWidth}
              color={primaryColor}
              thickness={4}
              dataPointsColor={secondaryColor}
              dataPointsRadius={5}
              areaChart
              startFillColor={primaryColor}
              startOpacity={0.25}
              endOpacity={0.01}
              initialSpacing={25}
              endSpacing={15}
              noOfSections={noOfSections}
              yAxisThickness={0}
              xAxisThickness={0}
              rulesType="solid"
              rulesColor="#f1f5f9"
              yAxisLabelWidth={45}
              formatYLabel={formatYLabel}
              yAxisTextStyle={{ color: '#94a3b8', fontSize: 10, fontWeight: '600' }}
              xAxisLabelTextStyle={{ color: '#64748b', fontSize: 9, fontWeight: '700' }}
              isAnimated
              animateOnDataChange
              animationDuration={1200}
              curved
              disableScroll={itemCount <= 7}
              showScrollIndicator={itemCount > 7}
            />
          )}

          {type === 'pie' && (
            <PieChart
              data={activeData}
              donut
              radius={90}
              innerRadius={70}
              innerCircleColor={'white'}
              centerLabelComponent={() => {
                const total = activeData.reduce((acc, curr) => acc + curr.value, 0);
                return (
                  <View className="items-center justify-center p-2">
                    <Text 
                      adjustsFontSizeToFit 
                      numberOfLines={1} 
                      className="text-2xl font-headline font-black text-on-surface text-center"
                      style={{ maxWidth: 100 }}
                    >
                      {total}
                    </Text>
                    <Text className="text-[10px] text-outline font-extrabold uppercase tracking-widest">Total</Text>
                  </View>
                );
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
};
