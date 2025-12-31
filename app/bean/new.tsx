import { View, Text, TextInput, ScrollView, Pressable, Alert } from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createBean, setActiveBean } from "@/lib/queries";

export default function NewBeanScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [roaster, setRoaster] = useState("");
  const [roastDate, setRoastDate] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter a name for this bean");
      return;
    }
    if (!roaster.trim()) {
      Alert.alert("Roaster required", "Please enter the roaster name");
      return;
    }

    setSaving(true);
    try {
      const bean = await createBean({
        name: name.trim(),
        roaster: roaster.trim(),
        roastDate: roastDate.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      await setActiveBean(bean.id);
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to save bean");
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
        keyboardShouldPersistTaps="handled"
      >
        <Card>
          <View className="mb-4">
            <Text className="text-cream-300 text-sm mb-2 uppercase tracking-wider">
              Bean Name *
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., Yirgacheffe"
              placeholderTextColor="#7a5f52"
              className="text-cream-100 text-lg bg-coffee-700 rounded-xl px-4 py-3"
              autoFocus
            />
          </View>

          <View className="mb-4">
            <Text className="text-cream-300 text-sm mb-2 uppercase tracking-wider">
              Roaster *
            </Text>
            <TextInput
              value={roaster}
              onChangeText={setRoaster}
              placeholder="e.g., Counter Culture"
              placeholderTextColor="#7a5f52"
              className="text-cream-100 text-lg bg-coffee-700 rounded-xl px-4 py-3"
            />
          </View>

          <View className="mb-4">
            <Text className="text-cream-300 text-sm mb-2 uppercase tracking-wider">
              Roast Date
            </Text>
            <TextInput
              value={roastDate}
              onChangeText={setRoastDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#7a5f52"
              className="text-cream-100 text-lg bg-coffee-700 rounded-xl px-4 py-3"
            />
          </View>

          <View>
            <Text className="text-cream-300 text-sm mb-2 uppercase tracking-wider">
              Notes
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Tasting notes, origin, etc."
              placeholderTextColor="#7a5f52"
              multiline
              className="text-cream-100 text-base bg-coffee-700 rounded-xl px-4 py-3 min-h-[100px]"
            />
          </View>
        </Card>

        <View className="mt-6">
          <Button onPress={handleSave} size="lg" loading={saving}>
            Add Bean
          </Button>
        </View>

        <Pressable
          onPress={() => router.back()}
          className="mt-4 py-3 items-center"
        >
          <Text className="text-cream-400">Cancel</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
