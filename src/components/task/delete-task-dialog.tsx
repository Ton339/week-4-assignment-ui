"use client";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import type { User } from "@/app/users/user"
import { deleteUser } from "@/app/users/actions"
import { useState } from "react"
import { Trash } from "lucide-react";
import { Task } from "@/app/tasks/tasks";
// ❌ ลบบรรทัด import form from "next/form" ออก
export function DeleteTaskDialog({ task }: { task: Task }) {
    const [isLoading, setIsLoading] = useState(false);
    // ✅ แก้ไขให้รับ Event
    async function handleDelete(e: React.FormEvent) {
        e.preventDefault(); // ✅ หยุดการ reload หน้าเว็บ
        setIsLoading(true);
        try {
            //const result = await deleteTask(task.id);
            //if (result && !result.success) {
            //    alert(result.error);
            //}
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Dialog>
            {/* ✅ ใช้ <form> มาตรฐาน และเรียก handleDelete ตรงๆ */}
            <DialogTrigger asChild>
                <Button variant="destructive" size="icon"><Trash /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleDelete}>
                    <DialogHeader>
                        <DialogTitle>Delete user</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this user?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" variant="destructive" disabled={isLoading}>
                            {isLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}
