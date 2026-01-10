import { Tabs, useRouter } from "expo-router";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type IconName = ComponentProps<typeof Ionicons>["name"];

function TabIcon({
  icon,
  focused,
}: {
  icon: IconName;
  focused: boolean;
}) {
  return (
    <View className="items-center justify-center pt-2">
      <Ionicons
        name={icon}
        size={24}
        color={focused ? "#c17f59" : "#d4c4b5"}
        style={{ opacity: focused ? 1 : 0.6 }}
      />
    </View>
  );
}

function MenuButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/changelog")}
      className="mr-4 p-2"
      hitSlop={8}
    >
      <Ionicons name="ellipsis-horizontal" size={24} color="#d4c4b5" />
    </Pressable>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#2d2421",
          borderTopColor: "#3d322d",
          height: 80,
          paddingBottom: 20,
        },
        tabBarActiveTintColor: "#c17f59",
        tabBarInactiveTintColor: "#d4c4b5",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerStyle: { backgroundColor: "#1a1412" },
        headerTintColor: "#f5f0eb",
        headerTitleStyle: { fontWeight: "600" },
        headerRight: () => <MenuButton />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Log",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="add-circle-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="time-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="beans"
        options={{
          title: "Beans",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="cafe-outline" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
