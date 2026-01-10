import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";

interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.1.0",
    date: "January 2026",
    changes: [
      "Added brewing method selection (Espresso, Pour Over, French Press, AeroPress, Moka Pot, Cold Brew)",
      "Added shot characteristics tags to help describe your shots (Full Body, Light Crema, Tiger Stripes, and more) - great for beginners learning espresso terminology",
      "Fixed keyboard blocking notes field on bean and shot logging forms",
      "Replaced all emojis with clean icons throughout the app",
      "Added menu button and this changelog screen",
      "Thanks to Adam for the feedback!",
    ],
  },
  {
    version: "1.0.0",
    date: "December 2025",
    changes: [
      "Initial release",
      "Track your coffee beans with roaster and roast date",
      "Log espresso shots with grind, dose, yield, and time",
      "Add taste notes to track extraction quality",
      "Mark your dialed-in recipes",
      "View shot history by bean",
      "Get dial suggestions based on taste feedback",
    ],
  },
];

export default function ChangelogScreen() {
  return (
    <SafeAreaView className="flex-1 bg-coffee-900" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-cream-100 text-2xl font-bold mb-2">
          What's New
        </Text>
        <Text className="text-cream-400 mb-6">
          See what's been brewing in Dial
        </Text>

        {CHANGELOG.map((entry, index) => (
          <Card key={entry.version} className={index > 0 ? "mt-4" : ""}>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-espresso text-lg font-semibold">
                v{entry.version}
              </Text>
              <Text className="text-cream-400 text-sm">{entry.date}</Text>
            </View>
            {entry.changes.map((change, changeIndex) => (
              <View key={changeIndex} className="flex-row mb-2">
                <Text className="text-cream-300 mr-2">•</Text>
                <Text className="text-cream-200 flex-1">{change}</Text>
              </View>
            ))}
          </Card>
        ))}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
