import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async <T>(key: string, value: T): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getItem = async <T>(key: string): Promise<T | null> => {
  const value = await AsyncStorage.getItem(key);
  if (value === null) return null;
  return JSON.parse(value) as T;
};

export const removeItem = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};
