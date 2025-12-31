import { View, Text, Pressable } from "react-native";
import { TASTE_TAGS } from "@/lib/constants";
import type { TasteTag } from "@/lib/types";

interface TasteTagPickerProps {
  selected: TasteTag[];
  onChange: (tags: TasteTag[]) => void;
}

export function TasteTagPicker({ selected, onChange }: TasteTagPickerProps) {
  const toggleTag = (tag: TasteTag) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <View>
      <Text className="text-cream-300 text-sm mb-3 uppercase tracking-wider">
        Taste Notes
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {TASTE_TAGS.map(({ value, label, emoji }) => {
          const isSelected = selected.includes(value);
          return (
            <Pressable
              key={value}
              onPress={() => toggleTag(value)}
              className={`px-3 py-2 rounded-full flex-row items-center ${
                isSelected
                  ? "bg-espresso"
                  : "bg-coffee-700 active:bg-coffee-600"
              }`}
            >
              <Text className="mr-1">{emoji}</Text>
              <Text
                className={`text-sm font-medium ${
                  isSelected ? "text-cream-100" : "text-cream-200"
                }`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
