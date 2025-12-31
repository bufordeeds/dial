import { View, Text } from "react-native";
import { getRatioDescription } from "@/lib/dialLogic";

interface RatioDisplayProps {
  dose: number;
  yieldGrams: number;
}

export function RatioDisplay({ dose, yieldGrams }: RatioDisplayProps) {
  const ratio = dose > 0 ? yieldGrams / dose : 0;
  const description = getRatioDescription(ratio);

  return (
    <View className="items-center py-3">
      <Text className="text-cream-300 text-xs uppercase tracking-wider mb-1">
        Ratio
      </Text>
      <View className="flex-row items-baseline">
        <Text className="text-3xl font-bold text-espresso">1:{ratio.toFixed(1)}</Text>
      </View>
      <Text className="text-cream-400 text-sm mt-1">{description}</Text>
    </View>
  );
}
