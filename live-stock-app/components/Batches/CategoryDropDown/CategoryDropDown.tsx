import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// ─── Dropdown Component ───────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "Beef Cattle", icon: "pets" },
  { label: "Dairy Cows", icon: "pets" },
  { label: "Merino Sheep", icon: "pets" },
  { label: "Goats", icon: "pets" },
  { label: "Poultry", icon: "egg" },
  { label: "Pigs", icon: "pets" },
];

export default function CategoryDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    Animated.spring(rotateAnim, {
      toValue: open ? 0 : 1,
      useNativeDriver: true,
      tension: 180,
      friction: 12,
    }).start();
    setOpen((prev) => !prev);
  };

  const select = (label: string) => {
    onChange(label);
    Animated.spring(rotateAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 180,
      friction: 12,
    }).start();
    setOpen(false);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 10,
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: 1.2,
          color: "#7a9179",
          paddingHorizontal: 4,
          marginBottom: 6,
        }}
      >
        Category
      </Text>

      {/* Trigger */}
      <TouchableOpacity
        onPress={toggle}
        activeOpacity={0.85}
        style={{
          backgroundColor: "#eef4ee",
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 13,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: open ? 1.5 : 1,
          borderColor: open ? "#007D3A" : "transparent",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialIcons name="pets" size={16} color="#007D3A" />
          <Text style={{ fontWeight: "600", color: "#1a2e1c", fontSize: 14 }}>
            {value || "Select…"}
          </Text>
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#7a9179" />
        </Animated.View>
      </TouchableOpacity>

      {/* Dropdown Panel */}
      {open && (
        <View
          style={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderRadius: 16,
            zIndex: 9999,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#d6e8d5",
            // shadow
            shadowColor: "#00612c",
            shadowOpacity: 0.13,
            shadowRadius: 20,
            shadowOffset: { height: 8, width: 0 },
            elevation: 14,
          }}
        >
          {CATEGORIES.map((cat, idx) => (
            <TouchableOpacity
              key={cat.label}
              onPress={() => select(cat.label)}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 16,
                paddingVertical: 13,
                backgroundColor:
                  value === cat.label ? "#eef7ee" : "transparent",
                borderBottomWidth: idx < CATEGORIES.length - 1 ? 1 : 0,
                borderBottomColor: "#f0f5f0",
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: value === cat.label ? "#c8e6c9" : "#eef4ee",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons
                  name={cat.icon as any}
                  size={16}
                  color="#007D3A"
                />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: value === cat.label ? "700" : "500",
                  color: value === cat.label ? "#007D3A" : "#2d3d2e",
                  flex: 1,
                }}
              >
                {cat.label}
              </Text>
              {value === cat.label && (
                <MaterialIcons name="check-circle" size={18} color="#007D3A" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
