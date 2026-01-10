import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { useLocalSearchParams, useRouter, useFocusEffect, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, parseISO, isValid } from "date-fns";
import { Card } from "@/components/ui/Card";
import { getShot, deleteShot, updateShot } from "@/lib/queries";
import { getDialSuggestions, getRatioDescription } from "@/lib/dialLogic";
import { TASTE_TAGS } from "@/lib/constants";
import type { ShotWithBean, TasteTag } from "@/lib/types";

export default function ShotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [shot, setShot] = useState<ShotWithBean | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (id) loadShot();
    }, [id])
  );

  const loadShot = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const shotData = await getShot(id);
      setShot(shotData);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Shot", "Are you sure you want to delete this shot?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (!id) return;
          await deleteShot(id);
          router.back();
        },
      },
    ]);
  };

  const toggleDialed = async () => {
    if (!shot || !id) return;
    const newDialed = !shot.isDialed;
    await updateShot(id, { isDialed: newDialed });
    setShot({ ...shot, isDialed: newDialed });
  };

  const getTagInfo = (tag: TasteTag) => {
    return TASTE_TAGS.find((t) => t.value === tag);
  };

  if (!shot) {
    return (
      <SafeAreaView className="flex-1 bg-coffee-900 items-center justify-center">
        <Text className="text-cream-400">Loading...</Text>
      </SafeAreaView>
    );
  }

  const ratio = shot.doseGrams > 0 ? shot.yieldGrams / shot.doseGrams : 0;
  const suggestions = getDialSuggestions(shot.tasteTags);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Shot Details",
          headerRight: () => (
            <Pressable onPress={handleDelete}>
              <Text className="text-red-400">Delete</Text>
            </Pressable>
          ),
        }}
      />
      <SafeAreaView className="flex-1 bg-coffee-900" edges={["bottom"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <Card>
            <View className="flex-row items-start justify-between mb-4">
              <View>
                <Text className="text-cream-100 font-semibold text-lg">
                  {shot.beanName}
                </Text>
                <Text className="text-cream-400 text-sm">
                  {isValid(parseISO(shot.createdAt)) ? format(parseISO(shot.createdAt), "EEEE, MMMM d 'at' h:mm a") : "Unknown date"}
                </Text>
              </View>
              {shot.isDialed && (
                <View className="bg-espresso/20 px-3 py-1 rounded-full flex-row items-center">
                  <Ionicons name="checkmark-circle" size={14} color="#c17f59" style={{ marginRight: 4 }} />
                  <Text className="text-espresso font-medium">Dialed</Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center py-4 border-y border-coffee-700">
              <View className="flex-1 items-center">
                <Text className="text-cream-300 text-xs uppercase">Grind</Text>
                <Text className="text-cream-100 text-3xl font-bold mt-1">
                  {shot.grindSetting}
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-cream-300 text-xs uppercase">Dose</Text>
                <Text className="text-cream-100 text-3xl font-bold mt-1">
                  {shot.doseGrams}g
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-cream-300 text-xs uppercase">Yield</Text>
                <Text className="text-cream-100 text-3xl font-bold mt-1">
                  {shot.yieldGrams}g
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-cream-300 text-xs uppercase">Time</Text>
                <Text className="text-cream-100 text-3xl font-bold mt-1">
                  {shot.timeSeconds}s
                </Text>
              </View>
            </View>

            <View className="items-center py-4">
              <Text className="text-espresso text-4xl font-bold">
                1:{ratio.toFixed(1)}
              </Text>
              <Text className="text-cream-400 mt-1">
                {getRatioDescription(ratio)}
              </Text>
            </View>
          </Card>

          {shot.tasteTags.length > 0 && (
            <Card className="mt-4">
              <Text className="text-cream-300 text-sm uppercase tracking-wider mb-3">
                Taste Notes
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {shot.tasteTags.map((tag) => {
                  const tagInfo = getTagInfo(tag);
                  return (
                    <View
                      key={tag}
                      className="bg-coffee-700 px-3 py-2 rounded-full flex-row items-center"
                    >
                      {tagInfo?.icon && (
                        <Ionicons
                          name={tagInfo.icon}
                          size={14}
                          color="#e8ddd4"
                          style={{ marginRight: 6 }}
                        />
                      )}
                      <Text className="text-cream-100 font-medium">
                        {tagInfo?.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Card>
          )}

          {suggestions.length > 0 && (
            <Card className="mt-4 border border-espresso/50">
              <View className="flex-row items-center mb-3">
                <Ionicons name="bulb-outline" size={20} color="#c17f59" style={{ marginRight: 8 }} />
                <Text className="text-espresso font-semibold">Dial Assistant</Text>
              </View>
              <View className="gap-3">
                {suggestions.map((suggestion, index) => (
                  <View
                    key={index}
                    className="bg-coffee-700/50 rounded-xl p-3"
                  >
                    <Text className="text-cream-100 font-medium">
                      {suggestion.issue}
                    </Text>
                    <Text className="text-cream-400 text-sm mt-1">
                      {suggestion.cause}
                    </Text>
                    <Text className="text-cream-200 mt-2">
                      → {suggestion.suggestion}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          )}

          {shot.notes && (
            <Card className="mt-4">
              <Text className="text-cream-300 text-sm uppercase tracking-wider mb-2">
                Notes
              </Text>
              <Text className="text-cream-200">{shot.notes}</Text>
            </Card>
          )}

          <Pressable
            onPress={toggleDialed}
            className={`mt-4 p-4 rounded-2xl border-2 ${
              shot.isDialed
                ? "bg-espresso/20 border-espresso"
                : "bg-coffee-800 border-coffee-600"
            }`}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name={shot.isDialed ? "checkmark-circle" : "checkmark-circle-outline"}
                size={24}
                color={shot.isDialed ? "#c17f59" : "#e8ddd4"}
                style={{ marginRight: 8 }}
              />
              <Text
                className={`text-lg font-semibold ${
                  shot.isDialed ? "text-espresso" : "text-cream-200"
                }`}
              >
                {shot.isDialed ? "Dialed In!" : "Mark as Dialed"}
              </Text>
            </View>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
