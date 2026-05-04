import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { login } from "../services/authService";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      Toast.show({ type: "error", text1: "Error al iniciar sesión", text2: "Email inválido o contraseña incorrecta" });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "La contraseña debe tener al menos 6 caracteres",
      });
      return;
    }

    try {
      await login(normalizedEmail, password);
      navigation.replace("Home");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error desconocido";
      Toast.show({ type: "error", text1: "Error", text2: message });
    }
  };

  return (
    <View className="flex-1 bg-gray-800 p-5 gap-2.5">
      <View className="gap-1 mt-4">
        <Text className="text-3xl font-bold text-white">Iniciar sesión</Text>
        <Text className="text-md font-light text-neutral-300">
          Usa tu correo y contraseña para iniciar sesión
        </Text>
      </View>

      <View className="gap-3 mt-8">
        <Text className="text-sm text-neutral-200 font-semibold">Correo electrónico</Text>
        <View className="flex-row items-center border border-neutral-700 rounded-[10px] px-4 py-3 bg-white">
          <MaterialIcons className="ml-4" name="email" size={25} color="#E5E7EB" />
          <TextInput
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-neutral-900 placeholder:text-gray-400"
          />
        </View>

        <Text className="text-sm text-neutral-200 font-semibold">Contraseña</Text>
        <View className="flex-row items-center border border-neutral-700 rounded-[10px] px-4 py-3 bg-white">
          <MaterialIcons className="ml-4" name="lock" size={25} color="#E5E7EB" />
          <TextInput
            placeholder="Ingresa tu contraseña"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-neutral-900 placeholder:text-gray-400"
          />
        </View>
      </View>

      <Pressable
        onPress={handleLogin}
        className="mt-6 bg-black rounded-full py-4 border border-neutral-600"
      >
        <Text className="text-white text-center font-semibold text-base">
          Ingresar
        </Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Register")}
        className="mt-4"
      >
        <Text className="text-center text-md text-neutral-300">
          No tienes cuenta?{" "}
          <Text className="text-white text-md font-semibold underline">Regístrate</Text>
        </Text>
      </Pressable>
    </View>
  );
}
