import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// ─── InfoChip (inline — no separate import needed) ───────────────────────────
function InfoChip({
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

// ─── BatchCard ────────────────────────────────────────────────────────────────
interface BatchCardProps {
  id: string;
  status: string;
  statusBg: string;
  statusColor: string;
  animals: string;
  category: string;
  arrival?: string;
  accent?: string | null;
  defaultAllocated?: boolean;
}

export default function BatchCard({
  id,
  status,
  statusBg,
  statusColor,
  animals,
  category,
  arrival,
  accent,
  defaultAllocated = false,
}: BatchCardProps) {
  const [allocated, setAllocated] = useState(defaultAllocated);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const toggleAllocate = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.88,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 8,
      }),
    ]).start();
    setAllocated((prev) => !prev);
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 20,
        marginBottom: 12,
        borderLeftWidth: accent ? 4 : 0,
        borderLeftColor: accent ?? "transparent",
        shadowColor: "#181d1b",
        shadowOpacity: 0.04,
        shadowRadius: 24,
        shadowOffset: { height: 10, width: 0 },
        elevation: 2,
      }}
    >
      {/* Top row: ID + status badge */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "700",
              color: "#7a9179",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 3,
            }}
          >
            Batch ID
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "900",
              color: "#1a2e1c",
              letterSpacing: -0.3,
            }}
          >
            {id}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: statusBg,
            paddingHorizontal: 12,
            paddingVertical: 5,
            borderRadius: 50,
          }}
        >
          <Text
            style={{
              color: statusColor,
              fontSize: 10,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            {status}
          </Text>
        </View>
      </View>

      {/* Info chips */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <InfoChip icon="pets" label="Animals" value={animals} />
        <InfoChip icon="category" label="Category" value={category} />
        {arrival ? (
          <InfoChip icon="calendar-today" label="Arrival" value={arrival} />
        ) : null}
      </View>

      <View
        style={{ borderTopWidth: 1, borderTopColor: "#f0f5f0", paddingTop: 14 }}
      >
        <TouchableOpacity
          disabled={status === "pending" || status === "completed"}
          onPress={() => {
            if (status === "progress") {
              // 👉 UNALLOCATE (back to pending)
              console.log("Unallocate batch:", id);
            }
          }}
          activeOpacity={0.85}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: status === "pending" || status === "completed" ? 0.5 : 1,
          }}
        >
          {/* Left: Icon + Label */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor:
                  status === "progress"
                    ? "#fdecea"
                    : status === "completed"
                      ? "#e6f4ea"
                      : "#f0f5f0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons
                name={
                  status === "progress"
                    ? "close"
                    : status === "completed"
                      ? "check"
                      : "hourglass-empty"
                }
                size={18}
                color={
                  status === "progress"
                    ? "#d32f2f"
                    : status === "completed"
                      ? "#007D3A"
                      : "#aabcaa"
                }
              />
            </View>

            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color:
                  status === "progress"
                    ? "#d32f2f"
                    : status === "completed"
                      ? "#007D3A"
                      : "#aabcaa",
              }}
            >
              {status === "progress"
                ? "Unallocate"
                : status === "completed"
                  ? "Completed"
                  : "Pending"}
            </Text>
          </View>

          {/* Right Badge */}
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 50,
              backgroundColor:
                status === "progress"
                  ? "#fdecea"
                  : status === "completed"
                    ? "#e6f4ea"
                    : "#f0f5f0",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "800",
                letterSpacing: 0.5,
                color:
                  status === "progress"
                    ? "#d32f2f"
                    : status === "completed"
                      ? "#007D3A"
                      : "#aabcaa",
              }}
            >
              {status.toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
