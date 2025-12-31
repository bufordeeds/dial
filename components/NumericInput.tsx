import { View, Text, TextInput, Pressable } from "react-native";
import { useState, useEffect } from "react";

interface NumericInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  step?: number;
  min?: number;
  max?: number;
  decimals?: number;
}

export function NumericInput({
  label,
  value,
  onChange,
  unit,
  step = 1,
  min = 0,
  max = 999,
  decimals = 1,
}: NumericInputProps) {
  const [inputValue, setInputValue] = useState(value.toFixed(decimals));

  useEffect(() => {
    setInputValue(value.toFixed(decimals));
  }, [value, decimals]);

  const handleBlur = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const clamped = Math.min(Math.max(parsed, min), max);
      onChange(clamped);
      setInputValue(clamped.toFixed(decimals));
    } else {
      setInputValue(value.toFixed(decimals));
    }
  };

  const increment = () => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
  };

  return (
    <View className="flex-1 items-center">
      <Text className="text-cream-300 text-xs mb-2 uppercase tracking-wider">
        {label}
      </Text>

      <Pressable
        onPress={increment}
        className="w-full py-2 items-center active:bg-coffee-600 rounded-lg"
      >
        <Text className="text-cream-300 text-2xl font-bold">+</Text>
      </Pressable>

      <View className="items-center py-1">
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          onBlur={handleBlur}
          keyboardType="decimal-pad"
          className="text-3xl font-bold text-cream-100 text-center"
          selectTextOnFocus
        />
        <Text className="text-cream-400 text-sm">{unit}</Text>
      </View>

      <Pressable
        onPress={decrement}
        className="w-full py-2 items-center active:bg-coffee-600 rounded-lg"
      >
        <Text className="text-cream-300 text-2xl font-bold">-</Text>
      </Pressable>
    </View>
  );
}
