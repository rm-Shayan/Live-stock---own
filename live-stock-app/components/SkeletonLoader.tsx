import React, { useEffect, useRef } from "react";
import { Animated, View, ViewStyle } from "react-native";

interface SkeletonBoxProps {
  width?: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonBox({ width = "100%", height, borderRadius = 8, style }: SkeletonBoxProps) {
  const anim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.35, duration: 750, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
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

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { height: 3, width: 0 },
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <SkeletonBox width={48} height={48} borderRadius={14} style={{ marginRight: 12 }} />
        <View style={{ flex: 1, gap: 6 }}>
          <SkeletonBox width="60%" height={14} borderRadius={6} />
          <SkeletonBox width="40%" height={11} borderRadius={6} />
        </View>
        <SkeletonBox width={60} height={24} borderRadius={20} />
      </View>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBox key={i} height={11} borderRadius={6} style={{ marginBottom: 8, width: `${80 - i * 15}%` as any }} />
      ))}
    </View>
  );
}

export function StatCardSkeleton() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 16,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { height: 2, width: 0 },
      }}
    >
      <SkeletonBox width={40} height={40} borderRadius={12} style={{ marginBottom: 8 }} />
      <SkeletonBox width={50} height={28} borderRadius={8} style={{ marginBottom: 4 }} />
      <SkeletonBox width={60} height={10} borderRadius={6} />
    </View>
  );
}

export function UserCardSkeleton() {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { height: 2, width: 0 },
      }}
    >
      <SkeletonBox width={48} height={48} borderRadius={24} />
      <View style={{ flex: 1, gap: 6 }}>
        <SkeletonBox width="55%" height={13} borderRadius={6} />
        <SkeletonBox width="75%" height={10} borderRadius={6} />
      </View>
      <SkeletonBox width={64} height={26} borderRadius={20} />
    </View>
  );
}
