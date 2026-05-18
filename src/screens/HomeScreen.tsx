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
import {
  addTodo,
  deleteTodo,
  listTodos,
  updateTodo,
  type Todo,
} from "../services/todoService";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const canAdd = useMemo(() => newTitle.trim().length > 0 && !isSaving, [newTitle, isSaving]);
  const canSaveEdit = useMemo(
    () => editingTitle.trim().length > 0 && !isSaving,
    [editingTitle, isSaving],
  );

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
      if (editingId === id) {
        setEditingId(null);
        setEditingTitle("");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      Toast.show({ type: "error", text1: "Error", text2: message });
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleUpdate = async () => {
    if (!editingId || !canSaveEdit) return;

    try {
      setIsSaving(true);
      const updated = await updateTodo(editingId, editingTitle);
      setTodos((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      );
      cancelEditing();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      Toast.show({ type: "error", text1: "Error", text2: message });
    } finally {
      setIsSaving(false);
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
          renderItem={({ item }) => {
            const isEditing = editingId === item.id;

            return (
              <View className="py-3 border-b border-neutral-700 gap-2">
                {isEditing ? (
                  <>
                    <TextInput
                      value={editingTitle}
                      onChangeText={setEditingTitle}
                      placeholder="Editar todo..."
                      placeholderTextColor="#9CA3AF"
                      className="rounded-[10px] border border-neutral-600 bg-white px-4 py-3 text-neutral-900 placeholder:text-gray-400"
                      autoFocus
                    />
                    <View className="flex-row justify-end gap-4">
                      <Pressable onPress={cancelEditing} disabled={isSaving}>
                        <Text className="text-neutral-300 font-semibold">
                          Cancelar
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={handleUpdate}
                        disabled={!canSaveEdit}
                        style={{ opacity: canSaveEdit ? 1 : 0.5 }}
                      >
                        <Text className="text-white font-semibold">
                          {isSaving ? "Guardando..." : "Guardar"}
                        </Text>
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 text-white">{item.title}</Text>
                    <View className="flex-row items-center">
                      <Pressable onPress={() => startEditing(item)}>
                        <Text className="text-neutral-300 font-semibold px-2">
                          Editar
                        </Text>
                      </Pressable>
                      <Pressable onPress={() => handleDelete(item.id)}>
                        <Text className="text-red-600 font-semibold px-2">
                          Eliminar
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            );
          }}
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
