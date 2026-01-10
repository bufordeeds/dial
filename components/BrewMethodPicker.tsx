import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BREW_METHODS } from "@/lib/constants";
import type { BrewMethod } from "@/lib/types";

interface BrewMethodPickerProps {
  selected: BrewMethod;
  onChange: (method: BrewMethod) => void;
}

export function BrewMethodPicker({ selected, onChange }: BrewMethodPickerProps) {
  return (
    <View>
      <Text className="text-cream-300 text-sm mb-3 uppercase tracking-wider">
        Brew Method
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {BREW_METHODS.map(({ value, label, icon }) => {
          const isSelected = selected === value;
          return (
            <Pressable
              key={value}
              onPress={() => onChange(value)}
              className={`px-3 py-2 rounded-full flex-row items-center ${
                isSelected
                  ? "bg-espresso"
                  : "bg-coffee-700 active:bg-coffee-600"
              }`}
            >
              <Ionicons
                name={icon}
                size={16}
                color={isSelected ? "#f5f0eb" : "#e8ddd4"}
                style={{ marginRight: 6 }}
              />
              <Text
                className={`text-sm font-medium ${
                  isSelected ? "text-cream-100" : "text-cream-200"
                }`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
