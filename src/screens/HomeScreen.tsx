import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import { logout } from "../services/authService";
import { addTodo, deleteTodo, listTodos, type Todo } from "../services/todoService";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const canAdd = useMemo(() => newTitle.trim().length > 0 && !isSaving, [newTitle, isSaving]);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await listTodos();
        setTodos(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido";
        Toast.show({ type: "error", text1: "Error", text2: message });
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const handleAdd = async () => {
    try {
      setIsSaving(true);
      const created = await addTodo(newTitle);
      setTodos((prev) => [created, ...prev]);
      setNewTitle("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      Toast.show({ type: "error", text1: "Error", text2: message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      Toast.show({ type: "error", text1: "Error", text2: message });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace("Login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      Toast.show({ type: "error", text1: "Error", text2: message });
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-gray-800"
      style={{ paddingBottom: insets.bottom + 12 }}
    >
      <View className="flex-1 p-5 gap-2.5">
      <View className="gap-1 mt-4">
        <Text className="text-3xl font-bold text-white">Home</Text>
        <Text className="text-md font-light text-neutral-300">
          Crea y administra tus todos
        </Text>
      </View>

      <View className="gap-3 mt-8">
        <Text className="text-sm text-neutral-200 font-semibold">Nuevo todo</Text>
        <View className="flex-row items-center border border-neutral-700 rounded-[10px] px-4 py-3 bg-white">
          <MaterialIcons name="checklist" size={25} color="#E5E7EB" />
          <TextInput
            placeholder="Escribe un todo..."
            value={newTitle}
            onChangeText={setNewTitle}
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-neutral-900 placeholder:text-gray-400"
          />
        </View>
      </View>

      <Pressable
        onPress={handleAdd}
        disabled={!canAdd}
        className="mt-6 bg-black rounded-full py-4 border border-neutral-600"
        style={{ opacity: canAdd ? 1 : 0.5 }}
      >
        <Text className="text-white text-center font-semibold text-base">
          {isSaving ? "Agregando..." : "Agregar"}
        </Text>
      </Pressable>

      {isLoading ? (
        <Text className="text-neutral-300 mt-4">Cargando...</Text>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={
            <Text className="text-neutral-300 mt-4">No hay todos todavía.</Text>
          }
          renderItem={({ item }) => (
            <View
              className="flex-row items-center justify-between py-3 border-b border-neutral-700"
            >
              <Text className="flex-1 text-white">{item.title}</Text>
              <Pressable onPress={() => handleDelete(item.id)}>
                <Text style={{ color: "#DC2626", paddingHorizontal: 10 }}>
                  Eliminar
                </Text>
              </Pressable>
            </View>
          )}
        />
      )}

      <Pressable
        onPress={handleLogout}
        className="mt-4 bg-red-600 rounded-full py-4 flex-row items-center justify-center"
      >
        <MaterialIcons name="logout" size={20} color="#FFFFFF" />
        <Text className="text-white font-semibold text-base ml-2">
          Cerrar sesión
        </Text>
      </Pressable>
      </View>
    </SafeAreaView>
  );
}
