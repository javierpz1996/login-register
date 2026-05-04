import { getItem, setItem, removeItem } from "../storage/storage";
import * as Crypto from "expo-crypto";

const USERS_KEY = "users";
const SESSION_KEY = "session";

export interface AuthUser {
  email: string;
  password: string;
}

// hash password
const hashPassword = async (password: string): Promise<string> => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
};

// REGISTRO
export const register = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const users = (await getItem<AuthUser[]>(USERS_KEY)) ?? [];

  const exists = users.find((u) => u.email === email);
  if (exists) throw new Error("El usuario ya existe");

  const hashedPassword = await hashPassword(password);

  const newUser: AuthUser = {
    email,
    password: hashedPassword,
  };

  await setItem(USERS_KEY, [...users, newUser]);

  return newUser;
};

// LOGIN
export const login = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const users = (await getItem<AuthUser[]>(USERS_KEY)) ?? [];

  const hashedPassword = await hashPassword(password);

  const user = users.find(
    (u) => u.email === email && u.password === hashedPassword
  );

  if (!user) throw new Error("Credenciales inválidas");

  await setItem(SESSION_KEY, user);

  return user;
};

// LOGOUT
export const logout = async (): Promise<void> => {
  await removeItem(SESSION_KEY);
};

// CHECK SESSION
export const getSession = async (): Promise<AuthUser | null> => {
  return await getItem<AuthUser>(SESSION_KEY);
};
