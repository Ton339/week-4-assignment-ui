"use server";

import { revalidatePath } from "next/cache";

export async function createTask(payload: unknown) {
  const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${API_URL}/task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { success: false, error: "Failed to create task" };
    }

    const data = await response.json();
    revalidatePath("/tasks");
    return { success: true, data };
  } catch (error) {
    console.error("Create task error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateTask(id: number, payload: unknown) {
  const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${API_URL}/task/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { success: false, error: "Failed to update task" };
    }

    const data = await response.json();
    revalidatePath("/tasks");
    return { success: true, data };
  } catch (error) {
    console.error("Update task error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteTask(id: number) {
  const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${API_URL}/task/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, error: "Failed to delete task" };
    }

    revalidatePath("/tasks");
    return { success: true };
  } catch (error) {
    console.error("Delete task error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
