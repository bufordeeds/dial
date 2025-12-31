import { View, Text, Pressable } from "react-native";
import { GRIND_RANGE } from "@/lib/constants";

interface GrindStepperProps {
  value: number;
  onChange: (value: number) => void;
}

export function GrindStepper({ value, onChange }: GrindStepperProps) {
  const increment = () => {
    if (value < GRIND_RANGE.max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > GRIND_RANGE.min) {
      onChange(value - 1);
    }
  };

  return (
    <View className="items-center">
      <Text className="text-cream-300 text-sm mb-2 uppercase tracking-wider">
        Grind Setting
      </Text>
      <View className="flex-row items-center">
        <Pressable
          onPress={decrement}
          className="w-16 h-16 bg-coffee-700 rounded-xl items-center justify-center active:bg-coffee-600"
          disabled={value <= GRIND_RANGE.min}
        >
          <Text
            className={`text-3xl font-bold ${
              value <= GRIND_RANGE.min ? "text-coffee-600" : "text-cream-100"
            }`}
          >
            -
          </Text>
        </Pressable>

        <View className="mx-6 items-center">
          <Text className="text-5xl font-bold text-cream-100">{value}</Text>
          <Text className="text-cream-400 text-xs mt-1">
            {GRIND_RANGE.min}-{GRIND_RANGE.max}
          </Text>
        </View>

        <Pressable
          onPress={increment}
          className="w-16 h-16 bg-coffee-700 rounded-xl items-center justify-center active:bg-coffee-600"
          disabled={value >= GRIND_RANGE.max}
        >
          <Text
            className={`text-3xl font-bold ${
              value >= GRIND_RANGE.max ? "text-coffee-600" : "text-cream-100"
            }`}
          >
            +
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
