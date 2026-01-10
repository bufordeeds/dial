import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { initDatabase } from "@/lib/db";

export default function RootLayout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#1a1412" },
          headerTintColor: "#f5f0eb",
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: "#1a1412" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="bean/[id]"
          options={{ title: "Bean Details", presentation: "card" }}
        />
        <Stack.Screen
          name="bean/new"
          options={{ title: "Add Bean", presentation: "modal" }}
        />
        <Stack.Screen
          name="shot/[id]"
          options={{ title: "Shot Details", presentation: "card" }}
        />
        <Stack.Screen
          name="changelog"
          options={{ title: "What's New", presentation: "modal" }}
        />
      </Stack>
    </>
  );
}
