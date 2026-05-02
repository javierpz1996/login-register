import * as Crypto from "expo-crypto";

import { getItem, setItem } from "../storage/storage";

const TODOS_KEY = "todos";

export type Todo = {
  id: string;
  title: string;
  createdAt: number;
};

async function readTodos(): Promise<Todo[]> {
  return (await getItem<Todo[]>(TODOS_KEY)) ?? [];
}

async function writeTodos(next: Todo[]): Promise<void> {
  await setItem(TODOS_KEY, next);
}

export async function listTodos(): Promise<Todo[]> {
  return await readTodos();
}

export async function addTodo(title: string): Promise<Todo> {
  const trimmed = title.trim();
  if (!trimmed) throw new Error("El todo no puede estar vacío");

  const todos = await readTodos();

  const todo: Todo = {
    id: Crypto.randomUUID(),
    title: trimmed,
    createdAt: Date.now(),
  };

  await writeTodos([todo, ...todos]);
  return todo;
}

export async function deleteTodo(id: string): Promise<void> {
  const todos = await readTodos();
  const next = todos.filter((t) => t.id !== id);
  await writeTodos(next);
}
