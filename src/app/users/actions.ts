"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateUser(id: string, payload: unknown) {
  const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${API_URL}/user/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { success: false, error: "Failed to update user" };
    }

    const data = await response.json();

    // Revalidate paths to refresh data on Server Components
    revalidatePath(`/users/${id}`);
    revalidatePath("/users");

    return { success: true, data };
  } catch (error) {
    console.error("Update user error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteUser(id: string) {
  const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${API_URL}/user/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, error: "Failed to delete user" };
    }

    // Revalidate the users list
    revalidatePath("/users");
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }

  // Redirect back to users list after deletion
  redirect("/users");
}
