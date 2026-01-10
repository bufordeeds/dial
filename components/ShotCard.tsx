import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO, isValid } from "date-fns";
import { TASTE_TAGS } from "@/lib/constants";
import type { ShotWithBean, TasteTag } from "@/lib/types";

interface ShotCardProps {
  shot: ShotWithBean;
  showBean?: boolean;
}

function formatDate(dateString: string, formatStr: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "Unknown date";
    return format(date, formatStr);
  } catch {
    return "Unknown date";
  }
}

export function ShotCard({ shot, showBean = true }: ShotCardProps) {
  const router = useRouter();
  const ratio = shot.doseGrams > 0 ? shot.yieldGrams / shot.doseGrams : 0;

  const getTagIcon = (tag: TasteTag) => {
    return TASTE_TAGS.find((t) => t.value === tag)?.icon;
  };

  return (
    <Pressable
      onPress={() => router.push(`/shot/${shot.id}`)}
      className="bg-coffee-800 rounded-xl p-4 active:bg-coffee-700"
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          {showBean && (
            <Text className="text-cream-100 font-semibold">{shot.beanName}</Text>
          )}
          <Text className="text-cream-400 text-sm">
            {formatDate(shot.createdAt, "MMM d, h:mm a")}
          </Text>
        </View>
        {shot.isDialed && (
          <View className="bg-espresso/20 px-2 py-1 rounded-full flex-row items-center">
            <Ionicons name="checkmark-circle" size={12} color="#c17f59" style={{ marginRight: 4 }} />
            <Text className="text-espresso text-xs font-medium">Dialed</Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center mt-2">
        <View className="flex-row items-baseline">
          <Text className="text-cream-100 font-medium">
            {shot.grindSetting}
          </Text>
          <Text className="text-cream-400 text-xs ml-1">grind</Text>
        </View>
        <Text className="text-coffee-600 mx-2">|</Text>
        <View className="flex-row items-baseline">
          <Text className="text-cream-100 font-medium">
            {shot.doseGrams.toFixed(1)}g
          </Text>
          <Text className="text-cream-400 mx-1">→</Text>
          <Text className="text-cream-100 font-medium">
            {shot.yieldGrams.toFixed(1)}g
          </Text>
        </View>
        <Text className="text-coffee-600 mx-2">|</Text>
        <View className="flex-row items-baseline">
          <Text className="text-cream-100 font-medium">{shot.timeSeconds}s</Text>
        </View>
      </View>

      <View className="flex-row items-center mt-2">
        <Text className="text-espresso font-semibold">1:{ratio.toFixed(1)}</Text>
        {shot.tasteTags.length > 0 && (
          <View className="flex-row ml-3">
            {shot.tasteTags.map((tag) => {
              const icon = getTagIcon(tag);
              return icon ? (
                <Ionicons
                  key={tag}
                  name={icon}
                  size={14}
                  color="#a89485"
                  style={{ marginRight: 4 }}
                />
              ) : null;
            })}
          </View>
        )}
      </View>
    </Pressable>
  );
}
