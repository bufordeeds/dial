import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SHOT_CHARACTERISTICS } from "@/lib/constants";
import type { ShotCharacteristic } from "@/lib/types";

interface ShotCharacteristicPickerProps {
  selected: ShotCharacteristic[];
  onChange: (characteristics: ShotCharacteristic[]) => void;
}

export function ShotCharacteristicPicker({
  selected,
  onChange,
}: ShotCharacteristicPickerProps) {
  const toggleCharacteristic = (characteristic: ShotCharacteristic) => {
    if (selected.includes(characteristic)) {
      onChange(selected.filter((c) => c !== characteristic));
    } else {
      onChange([...selected, characteristic]);
    }
  };

  return (
    <View>
      <Text className="text-cream-300 text-sm mb-1 uppercase tracking-wider">
        Shot Characteristics
      </Text>
      <Text className="text-cream-400 text-xs mb-3">
        Tap to describe your shot's appearance and texture
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {SHOT_CHARACTERISTICS.map(({ value, label, icon }) => {
          const isSelected = selected.includes(value);
          return (
            <Pressable
              key={value}
              onPress={() => toggleCharacteristic(value)}
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
