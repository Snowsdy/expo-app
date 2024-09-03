import { TaskType } from "@/types/Task.type";
import axios from "axios";
import { STRAPI_URL } from "babel-dotenv";

async function getTodos(): Promise<TaskType[]> {
  const { data, status } = await axios.get(STRAPI_URL + "/tasks");
  const todos = data.data as TaskType[];
  if (status != 200) {
    return [];
  }
  return todos;
}

async function postTodo(newGoal: string): Promise<TaskType | undefined> {
  if (newGoal.length < 1) return undefined;

  const { data, status } = await axios.post(
    `${STRAPI_URL}/tasks`,
    {
      data: {
        goal: newGoal,
        isDone: false, // Defaulting new tasks to not done
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const todo = data.data as TaskType;
  if (status != 200) {
    return undefined;
  }
  return todo;
}

async function putTodo(updatedTodo: TaskType): Promise<TaskType | undefined> {
  if (updatedTodo.attributes.goal.length < 1 || updatedTodo.id <= 0)
    return undefined;

  const { data, status } = await axios.put(
    `${STRAPI_URL}/tasks/${updatedTodo.id}`,
    {
      data: {
        goal: updatedTodo.attributes.goal,
        isDone: updatedTodo.attributes.isDone,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const todo = data.data as TaskType;
  if (status != 200) {
    return undefined;
  }
  return todo;
}

async function deleteTodo(todoId: number): Promise<TaskType | undefined> {
  if (todoId <= 0) return undefined;

  const { data, status } = await axios.delete(`${STRAPI_URL}/tasks/${todoId}`);
  const todo = data.data as TaskType;
  if (status != 200) {
    return undefined;
  }
  return todo;
}

export { getTodos, postTodo, putTodo, deleteTodo };
