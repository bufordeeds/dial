import { View, Text, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { GrindStepper } from "@/components/GrindStepper";
import { NumericInput } from "@/components/NumericInput";
import { TasteTagPicker } from "@/components/TasteTagPicker";
import { ShotTimer } from "@/components/ShotTimer";
import { RatioDisplay } from "@/components/RatioDisplay";
import { BeanSelector } from "@/components/BeanSelector";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getActiveBean, getLastShotForBean, createShot } from "@/lib/queries";
import { DEFAULT_SHOT_VALUES } from "@/lib/constants";
import type { Bean, TasteTag } from "@/lib/types";

export default function QuickLogScreen() {
  const [activeBean, setActiveBean] = useState<Bean | null>(null);
  const [grindSetting, setGrindSetting] = useState(DEFAULT_SHOT_VALUES.grindSetting);
  const [doseGrams, setDoseGrams] = useState(DEFAULT_SHOT_VALUES.doseGrams);
  const [yieldGrams, setYieldGrams] = useState(DEFAULT_SHOT_VALUES.yieldGrams);
  const [timeSeconds, setTimeSeconds] = useState(DEFAULT_SHOT_VALUES.timeSeconds);
  const [tasteTags, setTasteTags] = useState<TasteTag[]>([]);
  const [isDialed, setIsDialed] = useState(false);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadActiveBean();
    }, [])
  );

  const loadActiveBean = async () => {
    const bean = await getActiveBean();
    setActiveBean(bean);
    if (bean) {
      loadLastShot(bean.id);
    }
  };

  const loadLastShot = async (beanId: string) => {
    const lastShot = await getLastShotForBean(beanId);
    if (lastShot) {
      setGrindSetting(lastShot.grindSetting);
      setDoseGrams(lastShot.doseGrams);
      setYieldGrams(lastShot.yieldGrams);
      setTimeSeconds(lastShot.timeSeconds);
    } else {
      setGrindSetting(DEFAULT_SHOT_VALUES.grindSetting);
      setDoseGrams(DEFAULT_SHOT_VALUES.doseGrams);
      setYieldGrams(DEFAULT_SHOT_VALUES.yieldGrams);
      setTimeSeconds(DEFAULT_SHOT_VALUES.timeSeconds);
    }
    setTasteTags([]);
    setIsDialed(false);
    setNotes("");
    setShowNotes(false);
  };

  const handleBeanChange = async (bean: Bean) => {
    setActiveBean(bean);
    await loadLastShot(bean.id);
  };

  const handleSave = async () => {
    if (!activeBean) {
      Alert.alert("No bean selected", "Please add a bean first");
      return;
    }

    setSaving(true);
    try {
      await createShot({
        beanId: activeBean.id,
        grindSetting,
        doseGrams,
        yieldGrams,
        timeSeconds,
        tasteTags,
        isDialed,
        notes: notes.trim() || undefined,
      });

      Alert.alert(
        isDialed ? "Dialed! ☕" : "Shot Saved",
        "Ready for your next shot",
        [{ text: "OK" }]
      );

      setTasteTags([]);
      setIsDialed(false);
      setNotes("");
      setShowNotes(false);
    } catch (error) {
      Alert.alert("Error", "Failed to save shot");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-coffee-900" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <BeanSelector activeBean={activeBean} onBeanChange={handleBeanChange} />

        <Card className="mt-4">
          <ShotTimer onTimeUpdate={setTimeSeconds} />
        </Card>

        <Card className="mt-4">
          <GrindStepper value={grindSetting} onChange={setGrindSetting} />
        </Card>

        <Card className="mt-4">
          <View className="flex-row gap-4">
            <NumericInput
              label="Dose"
              value={doseGrams}
              onChange={setDoseGrams}
              unit="g"
              step={0.5}
              min={10}
              max={30}
            />
            <NumericInput
              label="Yield"
              value={yieldGrams}
              onChange={setYieldGrams}
              unit="g"
              step={1}
              min={15}
              max={80}
            />
            <NumericInput
              label="Time"
              value={timeSeconds}
              onChange={setTimeSeconds}
              unit="s"
              step={1}
              min={10}
              max={120}
              decimals={0}
            />
          </View>
          <RatioDisplay dose={doseGrams} yieldGrams={yieldGrams} />
        </Card>

        <Card className="mt-4">
          <TasteTagPicker selected={tasteTags} onChange={setTasteTags} />
        </Card>

        <Pressable
          onPress={() => setIsDialed(!isDialed)}
          className={`mt-4 p-4 rounded-2xl border-2 ${
            isDialed
              ? "bg-espresso/20 border-espresso"
              : "bg-coffee-800 border-coffee-600"
          }`}
        >
          <View className="flex-row items-center justify-center">
            <Text className="text-2xl mr-2">☕</Text>
            <Text
              className={`text-lg font-semibold ${
                isDialed ? "text-espresso" : "text-cream-200"
              }`}
            >
              {isDialed ? "Dialed In!" : "Mark as Dialed"}
            </Text>
          </View>
        </Pressable>

        {showNotes ? (
          <Card className="mt-4">
            <Text className="text-cream-300 text-sm mb-2 uppercase tracking-wider">
              Notes
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Any observations..."
              placeholderTextColor="#7a5f52"
              multiline
              className="text-cream-100 text-base min-h-[80px]"
            />
          </Card>
        ) : (
          <Pressable
            onPress={() => setShowNotes(true)}
            className="mt-4 py-3 items-center"
          >
            <Text className="text-cream-400">+ Add Notes</Text>
          </Pressable>
        )}

        <View className="mt-6 mb-8">
          <Button
            onPress={handleSave}
            size="lg"
            disabled={!activeBean}
            loading={saving}
            className="w-full"
          >
            Save Shot
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
