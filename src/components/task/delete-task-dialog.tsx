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
import { deleteTask } from "@/app/tasks/actions"
import { useState } from "react"
import { Trash } from "lucide-react";
import { Task } from "@/app/tasks/tasks";

export default function DeleteTaskDialog({ task, onDelete }: { task: Task, onDelete: (id: string | number) => void }) {
    const [isLoading, setIsLoading] = useState(false);
    // ✅ แก้ไขให้รับ Event
    async function handleDelete(e: React.FormEvent) {
        e.preventDefault(); // ✅ หยุดการ reload หน้าเว็บ
        setIsLoading(true);
        try {
            const result = await deleteTask(parseInt(task.id));
            if (result && !result.success) {
                alert(result.error);
            } else {
                if (onDelete) {
                    onDelete(task.id);
                }
            }
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
                        <DialogTitle>Delete task</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this task?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4">
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
