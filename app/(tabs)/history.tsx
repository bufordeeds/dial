import { View, Text, FlatList, Pressable } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShotCard } from "@/components/ShotCard";
import { getShots, getBeans } from "@/lib/queries";
import type { ShotWithBean, Bean } from "@/lib/types";

export default function HistoryScreen() {
  const [shots, setShots] = useState<ShotWithBean[]>([]);
  const [beans, setBeans] = useState<Bean[]>([]);
  const [selectedBeanId, setSelectedBeanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [allShots, allBeans] = await Promise.all([
        getShots(selectedBeanId ?? undefined),
        getBeans(),
      ]);
      setShots(allShots);
      setBeans(allBeans);
    } finally {
      setLoading(false);
    }
  };

  const handleBeanFilter = async (beanId: string | null) => {
    setSelectedBeanId(beanId);
    const filteredShots = await getShots(beanId ?? undefined);
    setShots(filteredShots);
  };

  return (
    <SafeAreaView className="flex-1 bg-coffee-900" edges={["bottom"]}>
      <View className="px-4 py-3">
        <FlatList
          horizontal
          data={[{ id: null, name: "All" }, ...beans]}
          keyExtractor={(item) => item.id ?? "all"}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleBeanFilter(item.id)}
              className={`px-4 py-2 mr-2 rounded-full ${
                selectedBeanId === item.id
                  ? "bg-espresso"
                  : "bg-coffee-700"
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedBeanId === item.id ? "text-cream-100" : "text-cream-200"
                }`}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>

      <FlatList
        data={shots}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Text className="text-4xl mb-3">☕</Text>
            <Text className="text-cream-400 text-center">
              {selectedBeanId
                ? "No shots with this bean yet"
                : "No shots logged yet"}
            </Text>
            <Text className="text-cream-400 text-center text-sm mt-1">
              Start logging from the Log tab
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ShotCard shot={item} showBean={!selectedBeanId} />
        )}
      />
    </SafeAreaView>
  );
}
