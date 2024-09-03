import { TaskType } from "@/types/Task.type";
import { STRAPI_URL } from "babel-dotenv";

async function getTodos(): Promise<TaskType[]> {
  const response = await fetch(`${STRAPI_URL}/tasks`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  const todos = data.data as TaskType[];
  return todos;
}

async function postTodo(newGoal: string): Promise<TaskType | undefined> {
  if (newGoal.length < 1) return undefined;

  const response = await fetch(`${STRAPI_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        goal: newGoal,
        isDone: false, // Defaulting new tasks to not done
      },
    }),
  });

  if (!response.ok) {
    return undefined;
  }

  const data = await response.json();
  const todo = data.data as TaskType;
  return todo;
}

async function putTodo(updatedTodo: TaskType): Promise<TaskType | undefined> {
  if (updatedTodo.attributes.goal.length < 1 || updatedTodo.id <= 0)
    return undefined;

  const response = await fetch(`${STRAPI_URL}/tasks/${updatedTodo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        goal: updatedTodo.attributes.goal,
        isDone: updatedTodo.attributes.isDone,
      },
    }),
  });

  if (!response.ok) {
    return undefined;
  }

  const data = await response.json();
  const todo = data.data as TaskType;
  return todo;
}

async function deleteTodo(todoId: number): Promise<TaskType | undefined> {
  if (todoId <= 0) return undefined;

  const response = await fetch(`${STRAPI_URL}/tasks/${todoId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    return undefined;
  }

  const data = await response.json();
  const todo = data.data as TaskType;
  return todo;
}

export { getTodos, postTodo, putTodo, deleteTodo };
