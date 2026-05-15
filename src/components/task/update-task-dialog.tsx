"use client";

import * as React from "react"
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipboardPen } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod";
import { Task } from "@/app/tasks/tasks";
import { User } from "@/app/users/user";
import { updateTask } from "@/app/tasks/actions";

const taskSchema = z.object({
    title: z.string().min(1, "title is required"),
    status: z.string().min(1, "status is required"),
    priority: z.string().min(1, "priority is required"),
    user_id: z.string().min(1, "user is required"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function UpdateTaskDialog({ task }: { task: Task }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: task.title ?? "",
            status: task.status ?? "",
            priority: task.priority ?? "",
            user_id: task.user?.id?.toString() ?? "",
        },
    });

    useEffect(() => {
        form.reset({
            title: task.title ?? "",
            status: task.status ?? "",
            priority: task.priority ?? "",
            user_id: task.user?.id?.toString() ?? "",
        });
    }, [task, form]);

    useEffect(() => {
        if (open) {
            const loadUsers = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`);
                    if (!res.ok) throw new Error("Failed to fetch users");
                    const data = await res.json();
                    setUsers(data);
                } catch (error) {
                    console.error(error);
                }
            };
            loadUsers();
        }
    }, [open]);

    async function onSubmit(data: TaskFormValues) {
        setIsLoading(true);
        try {
            const payload = {
                ...data,
                user_id: parseInt(data.user_id),
            };

            const result = await updateTask(parseInt(task.id), payload);

            if (!result.success) throw new Error(result.error);

            setOpen(false); // ปิด Dialog
            form.reset(); // ล้างค่าฟอร์ม
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" size="icon" className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/40 hover:text-amber-400"><ClipboardPen /></Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Update task</DialogTitle>
                        <DialogDescription>
                            Please enter your information here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="grid grid-cols-2 gap-4">
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Task Name</FieldLabel>
                                    <Input {...field} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="status"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Status</FieldLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectGroup>
                                                <SelectLabel>Status</SelectLabel>
                                                <SelectItem value="Done">Done</SelectItem>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                                <SelectItem value="Todo">Todo</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="priority"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Priority</FieldLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a priority" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectGroup>
                                                <SelectLabel>Priority</SelectLabel>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Low">Low</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="user_id"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Assigned To</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a assigned To" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectGroup>
                                                <SelectLabel>Assigned To</SelectLabel>
                                                {users.map((user: User) => (
                                                    <SelectItem key={user.id} value={user.id.toString()}>
                                                        {user.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save changes"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}