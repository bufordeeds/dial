import { Tabs } from "expo-router";
import { View, Text } from "react-native";

function TabIcon({
  icon,
  focused,
}: {
  icon: string;
  focused: boolean;
}) {
  return (
    <View className="items-center justify-center pt-2">
      <Text
        className={`text-2xl ${focused ? "opacity-100" : "opacity-50"}`}
        style={{ color: focused ? "#c17f59" : "#d4c4b5" }}
      >
        {icon}
      </Text>
    </View>
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Log",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="+" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="☰" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="beans"
        options={{
          title: "Beans",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="◉" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
