import React, { useRef, useEffect } from "react";
import { View, Text, TextInput, Platform, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  error?: string;
  keyboardType?: "default" | "numeric" | "email-address";
  secureTextEntry?: boolean;
  multiline?: boolean;
}

// Using React.memo to prevent unnecessary re-renders of the entire component
export const InputField = React.memo(({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  keyboardType = "default",
  secureTextEntry = false,
  multiline = false,
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = useRef<TextInput>(null);

  // Focus preservation logic is usually not needed for external components,
  // but we'll ensure the TextInput stays mounted by keeping styles stable.

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={[
          styles.inputContainer,
          error ? styles.borderError : isFocused ? styles.borderFocused : styles.borderDefault,
          isFocused ? styles.shadowFocused : null
        ]}
      >
        <MaterialIcons
          name={icon}
          size={18}
          color={error ? "#ef4444" : isFocused ? "#00612c" : "#6f7a6e"}
        />
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          underlineColorAndroid="transparent"
          numberOfLines={multiline ? 3 : 1}
          style={[
            styles.input,
            multiline && { height: 80, textAlignVertical: 'top' },
            Platform.OS === 'web' && ({ outlineStyle: 'none' } as unknown as import('react-native').TextStyle)
          ]}
        />
      </Pressable>
      {error ? (
        <Text style={styles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6f7a6e",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fbf3",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  borderDefault: {
    borderColor: "rgba(0, 97, 44, 0.1)",
  },
  borderFocused: {
    borderColor: "#00612c",
  },
  borderError: {
    borderColor: "#fca5a5",
  },
  shadowFocused: Platform.select({
    ios: {
      shadowColor: "#00612c",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 3,
    },
    web: {
      shadowColor: "#00612c",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    default: {}
  }),
  input: {
    flex: 1,
    marginLeft: 12,
    color: "#1a1c1e",
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 10,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "bold",
  }
});
