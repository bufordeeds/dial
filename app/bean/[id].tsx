import { View, Text, ScrollView, FlatList, Pressable, Alert } from "react-native";
import { useState, useCallback } from "react";
import { useLocalSearchParams, useRouter, useFocusEffect, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, parseISO, isValid } from "date-fns";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShotCard } from "@/components/ShotCard";
import {
  getBean,
  getShots,
  getDialedShotForBean,
  setActiveBean,
  deleteBean,
} from "@/lib/queries";
import type { Bean, Shot, ShotWithBean } from "@/lib/types";

export default function BeanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [bean, setBean] = useState<Bean | null>(null);
  const [shots, setShots] = useState<ShotWithBean[]>([]);
  const [dialedShot, setDialedShot] = useState<Shot | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (id) loadBean();
    }, [id])
  );

  const loadBean = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [beanData, shotsData, dialed] = await Promise.all([
        getBean(id),
        getShots(id),
        getDialedShotForBean(id),
      ]);
      setBean(beanData);
      setShots(shotsData);
      setDialedShot(dialed);
    } finally {
      setLoading(false);
    }
  };

  const handleSetActive = async () => {
    if (!bean) return;
    await setActiveBean(bean.id);
    setBean({ ...bean, isActive: true });
    Alert.alert("Bean Active", `${bean.name} is now your active bean`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Bean",
      `Delete ${bean?.name}? This will also delete all ${shots.length} shots.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!id) return;
            await deleteBean(id);
            router.back();
          },
        },
      ]
    );
  };

  if (!bean) {
    return (
      <SafeAreaView className="flex-1 bg-coffee-900 items-center justify-center">
        <Text className="text-cream-400">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: bean.name,
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
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-cream-100 font-bold text-2xl">{bean.name}</Text>
                <Text className="text-cream-400 text-lg mt-1">{bean.roaster}</Text>
              </View>
              {bean.isActive && (
                <View className="bg-espresso/20 px-3 py-1 rounded-full">
                  <Text className="text-espresso font-medium">Active</Text>
                </View>
              )}
            </View>

            {bean.roastDate && isValid(parseISO(bean.roastDate)) && (
              <View className="mt-4">
                <Text className="text-cream-300 text-xs uppercase tracking-wider">
                  Roasted
                </Text>
                <Text className="text-cream-100 mt-1">
                  {format(parseISO(bean.roastDate), "MMMM d, yyyy")}
                </Text>
              </View>
            )}

            {bean.notes && (
              <View className="mt-4">
                <Text className="text-cream-300 text-xs uppercase tracking-wider">
                  Notes
                </Text>
                <Text className="text-cream-200 mt-1">{bean.notes}</Text>
              </View>
            )}

            {!bean.isActive && (
              <Button
                onPress={handleSetActive}
                variant="secondary"
                className="mt-4"
              >
                Set as Active Bean
              </Button>
            )}
          </Card>

          {dialedShot && (
            <Card className="mt-4 border-2 border-espresso">
              <View className="flex-row items-center mb-3">
                <Text className="text-xl mr-2">☕</Text>
                <Text className="text-espresso font-semibold text-lg">
                  Dialed Recipe
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Text className="text-cream-300 text-xs uppercase">Grind</Text>
                  <Text className="text-cream-100 text-2xl font-bold">
                    {dialedShot.grindSetting}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-cream-300 text-xs uppercase">Dose</Text>
                  <Text className="text-cream-100 text-2xl font-bold">
                    {dialedShot.doseGrams}g
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-cream-300 text-xs uppercase">Yield</Text>
                  <Text className="text-cream-100 text-2xl font-bold">
                    {dialedShot.yieldGrams}g
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-cream-300 text-xs uppercase">Time</Text>
                  <Text className="text-cream-100 text-2xl font-bold">
                    {dialedShot.timeSeconds}s
                  </Text>
                </View>
              </View>
            </Card>
          )}

          <View className="mt-6">
            <Text className="text-cream-300 text-sm uppercase tracking-wider mb-3">
              Shot History ({shots.length})
            </Text>
            {shots.length === 0 ? (
              <Card>
                <Text className="text-cream-400 text-center py-4">
                  No shots with this bean yet
                </Text>
              </Card>
            ) : (
              <View className="gap-3">
                {shots.map((shot) => (
                  <ShotCard key={shot.id} shot={shot} showBean={false} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
