import { View, Text, FlatList, Pressable } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BeanCard } from "@/components/BeanCard";
import { getBeans, getShots, getDialedShotForBean } from "@/lib/queries";
import type { Bean } from "@/lib/types";

interface BeanWithStats extends Bean {
  shotCount: number;
  hasDialedShot: boolean;
}

export default function BeansScreen() {
  const [beans, setBeans] = useState<BeanWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadBeans();
    }, [])
  );

  const loadBeans = async () => {
    setLoading(true);
    try {
      const allBeans = await getBeans();
      const beansWithStats = await Promise.all(
        allBeans.map(async (bean) => {
          const shots = await getShots(bean.id);
          const dialedShot = await getDialedShotForBean(bean.id);
          return {
            ...bean,
            shotCount: shots.length,
            hasDialedShot: !!dialedShot,
          };
        })
      );
      setBeans(beansWithStats);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-coffee-900" edges={["bottom"]}>
      <FlatList
        data={beans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Text className="text-4xl mb-3">◉</Text>
            <Text className="text-cream-400 text-center">No beans yet</Text>
            <Pressable
              onPress={() => router.push("/bean/new")}
              className="mt-4 bg-espresso px-6 py-3 rounded-xl"
            >
              <Text className="text-cream-100 font-semibold">Add Your First Bean</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <BeanCard
            bean={item}
            shotCount={item.shotCount}
            hasDialedShot={item.hasDialedShot}
          />
        )}
        ListFooterComponent={
          beans.length > 0 ? (
            <Pressable
              onPress={() => router.push("/bean/new")}
              className="bg-coffee-700 rounded-xl p-4 mt-3 items-center active:bg-coffee-600"
            >
              <Text className="text-espresso font-semibold">+ Add New Bean</Text>
            </Pressable>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
