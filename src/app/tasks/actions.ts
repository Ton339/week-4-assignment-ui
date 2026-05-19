"use server";

import { revalidatePath } from "next/cache";

// server api url
const API_URL = process.env.API_URL;

// create task
export async function createTask(payload: unknown) {
  
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

// Read task
export async function fetchMoreTasks(page: number, limit: number) {
  try {
    const res = await fetch(
      `${API_URL}/task?_page=${page}&_per_page=${limit}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      return { data: [], next: null };
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch tasks error:", error);
    return { data: [], next: null };
  }
}

// update task
export async function updateTask(id: number, payload: unknown) {
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

// delete task
export async function deleteTask(id: number) {
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
