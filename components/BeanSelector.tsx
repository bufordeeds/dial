import { View, Text, Pressable, Modal, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { getBeans, setActiveBean } from "@/lib/queries";
import type { Bean } from "@/lib/types";

interface BeanSelectorProps {
  activeBean: Bean | null;
  onBeanChange: (bean: Bean) => void;
}

export function BeanSelector({ activeBean, onBeanChange }: BeanSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [beans, setBeans] = useState<Bean[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (modalVisible) {
      loadBeans();
    }
  }, [modalVisible]);

  const loadBeans = async () => {
    const allBeans = await getBeans();
    setBeans(allBeans);
  };

  const selectBean = async (bean: Bean) => {
    await setActiveBean(bean.id);
    onBeanChange({ ...bean, isActive: true });
    setModalVisible(false);
  };

  const addNewBean = () => {
    setModalVisible(false);
    router.push("/bean/new");
  };

  if (!activeBean) {
    return (
      <Pressable
        onPress={addNewBean}
        className="bg-coffee-800 rounded-2xl p-4 items-center border-2 border-dashed border-coffee-600"
      >
        <Text className="text-espresso font-semibold text-lg">+ Add Your First Bean</Text>
        <Text className="text-cream-400 text-sm mt-1">
          Tap to get started
        </Text>
      </Pressable>
    );
  }

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        className="bg-coffee-800 rounded-2xl p-4 active:bg-coffee-700"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-cream-100 font-semibold text-lg">
              {activeBean.name}
            </Text>
            <Text className="text-cream-400 text-sm">{activeBean.roaster}</Text>
          </View>
          <Text className="text-cream-400 text-2xl">{">"}</Text>
        </View>
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-coffee-900 pt-4">
          <View className="flex-row items-center justify-between px-4 pb-4 border-b border-coffee-700">
            <Text className="text-cream-100 text-xl font-bold">Select Bean</Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text className="text-espresso text-lg">Done</Text>
            </Pressable>
          </View>

          <FlatList
            data={beans}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            ItemSeparatorComponent={() => <View className="h-3" />}
            ListEmptyComponent={
              <Text className="text-cream-400 text-center py-8">
                No beans yet
              </Text>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => selectBean(item)}
                className={`bg-coffee-800 rounded-xl p-4 ${
                  item.id === activeBean.id ? "border-2 border-espresso" : ""
                }`}
              >
                <Text className="text-cream-100 font-semibold text-lg">
                  {item.name}
                </Text>
                <Text className="text-cream-400 text-sm">{item.roaster}</Text>
              </Pressable>
            )}
            ListFooterComponent={
              <Pressable
                onPress={addNewBean}
                className="bg-coffee-700 rounded-xl p-4 mt-3 items-center"
              >
                <Text className="text-espresso font-semibold">+ Add New Bean</Text>
              </Pressable>
            }
          />
        </View>
      </Modal>
    </>
  );
}
