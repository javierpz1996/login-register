import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import { register } from "../services/authService";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      Toast.show({ type: "error", text1: "Error al registrar usuario", text2: "Email inválido o contraseña menor a 6 caracteres" });
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
      await register(normalizedEmail, password);
      Alert.alert("Éxito", "Usuario creado");
      navigation.navigate("Login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      Toast.show({ type: "error", text1: "Error", text2: message });
    }
  };

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <View className="flex-1 bg-gray-800 p-5 gap-2.5">
      <View className="gap-1">
        <Text className="text-3xl font-bold text-white">Registro</Text>
        <Text className="text-md font-light text-neutral-300">
          Crea tu cuenta con correo y contraseña
        </Text>
      </View>

      <View className="gap-3 mt-8">
        <Text className="text-sm text-neutral-200 font-semibold">
          Correo electrónico
        </Text>
        <View className="flex-row items-center border border-neutral-700 rounded-[10px] px-4 py-3 bg-white">
          <MaterialIcons
            className="ml-4"
            name="email"
            size={25}
            color="#E5E7EB"
          />
          <TextInput
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3"
          />
        </View>

        <Text className="text-sm text-neutral-200 font-semibold">
          Contraseña
        </Text>
        <View className="flex-row items-center border border-neutral-700 rounded-[10px] px-4 py-3 bg-white">
          <MaterialIcons
            className="ml-4"
            name="lock"
            size={25}
            color="#E5E7EB"
          />
          <TextInput
            placeholder="Ingresa tu contraseña"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3"
          />
        </View>
      </View>

      <Pressable
        onPress={handleRegister}
        className="mt-6 bg-black rounded-full py-4"
      >
        <Text className="text-white text-center font-semibold text-base">
          Crear cuenta
        </Text>
      </Pressable>

      <Pressable onPress={() => navigation.goBack()} className="mt-4">
        <Text className="text-center text-neutral-300">
          ¿Ya tienes cuenta?{" "}
          <Text className="text-white font-semibold">Inicia sesión</Text>
        </Text>
      </Pressable>
    </View>
  );
}
