import { View, Text, Pressable } from "react-native";
import { useState, useEffect, useRef } from "react";

interface ShotTimerProps {
  onTimeUpdate: (seconds: number) => void;
}

export function ShotTimer({ onTimeUpdate }: ShotTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedMs;
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedMs(Date.now() - startTimeRef.current);
        }
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const toggle = () => {
    if (isRunning) {
      setIsRunning(false);
      const seconds = Math.round(elapsedMs / 1000);
      onTimeUpdate(seconds);
    } else {
      setIsRunning(true);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setElapsedMs(0);
    startTimeRef.current = null;
  };

  const seconds = Math.floor(elapsedMs / 1000);
  const tenths = Math.floor((elapsedMs % 1000) / 100);

  return (
    <View className="items-center">
      <View className="flex-row items-baseline mb-3">
        <Text className="text-5xl font-bold text-cream-100 tabular-nums">
          {seconds.toString().padStart(2, "0")}
        </Text>
        <Text className="text-2xl text-cream-300 tabular-nums">.{tenths}</Text>
        <Text className="text-cream-400 text-lg ml-1">s</Text>
      </View>

      <View className="flex-row gap-3">
        <Pressable
          onPress={toggle}
          className={`px-8 py-3 rounded-xl ${
            isRunning
              ? "bg-espresso-dark active:bg-espresso"
              : "bg-espresso active:bg-espresso-dark"
          }`}
        >
          <Text className="text-cream-100 font-semibold text-lg">
            {isRunning ? "Stop" : elapsedMs > 0 ? "Resume" : "Start"}
          </Text>
        </Pressable>

        {elapsedMs > 0 && !isRunning && (
          <Pressable
            onPress={reset}
            className="px-6 py-3 rounded-xl bg-coffee-700 active:bg-coffee-600"
          >
            <Text className="text-cream-200 font-semibold text-lg">Reset</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
