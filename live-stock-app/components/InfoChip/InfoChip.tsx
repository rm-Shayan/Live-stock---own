import React, { useState, useRef } from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function InfoChip({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        width: "45%",
      }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          backgroundColor: "#eef4ee",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons name={icon} size={15} color="#007D3A" />
      </View>
      <View>
        <Text style={{ fontSize: 10, color: "#7a9179", marginBottom: 1 }}>
          {label}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: "700", color: "#1a2e1c" }}>
          {value}
        </Text>
      </View>
    </View>
  );
}
