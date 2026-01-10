import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { format, isValid, parseISO } from "date-fns";
import type { Bean } from "@/lib/types";

interface BeanCardProps {
  bean: Bean;
  shotCount?: number;
  hasDialedShot?: boolean;
}

function formatRoastDate(dateString?: string): string | null {
  if (!dateString) return null;
  const date = parseISO(dateString);
  if (!isValid(date)) return null;
  return format(date, "MMM d");
}

export function BeanCard({ bean, shotCount = 0, hasDialedShot = false }: BeanCardProps) {
  const router = useRouter();
  const roastDateFormatted = formatRoastDate(bean.roastDate);

  return (
    <Pressable
      onPress={() => router.push(`/bean/${bean.id}`)}
      className={`bg-coffee-800 rounded-xl p-4 active:bg-coffee-700 ${
        bean.isActive ? "border-2 border-espresso" : ""
      }`}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-cream-100 font-semibold text-lg">
              {bean.name}
            </Text>
            {bean.isActive && (
              <View className="bg-espresso/20 px-2 py-0.5 rounded-full ml-2">
                <Text className="text-espresso text-xs font-medium">Active</Text>
              </View>
            )}
          </View>
          <Text className="text-cream-400 text-sm mt-1">{bean.roaster}</Text>
        </View>
        {hasDialedShot && (
          <Ionicons name="checkmark-circle" size={24} color="#c17f59" />
        )}
      </View>

      {(roastDateFormatted || shotCount > 0) && (
        <View className="flex-row items-center mt-3">
          {roastDateFormatted && (
            <View className="flex-row items-center">
              <Text className="text-cream-300 text-xs">Roasted</Text>
              <Text className="text-cream-400 text-xs ml-1">
                {roastDateFormatted}
              </Text>
            </View>
          )}
          {shotCount > 0 && (
            <>
              {roastDateFormatted && <Text className="text-coffee-600 mx-2">•</Text>}
              <Text className="text-cream-400 text-xs">
                {shotCount} shot{shotCount !== 1 ? "s" : ""}
              </Text>
            </>
          )}
        </View>
      )}
    </Pressable>
  );
}
