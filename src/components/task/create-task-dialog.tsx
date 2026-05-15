"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { User } from "@/app/users/user";
import * as z from "zod";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
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
import { createTask } from "@/app/tasks/actions";

// 1. สร้าง Zod Schema ให้ล้อตาม CreateUserDto ของ NestJS
const userSchema = z.object({
    title: z.string().min(1, "title is required"),
    status: z.string().min(1, "status is required"),
    priority: z.string().min(1, "priority is required"),
    user_id: z.string().min(1, "user is required"),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function CreateTaskDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 2. ตั้งค่า React Hook Form
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            title: "",
            status: "",
            priority: "",
            user_id: "",
        },
    });

    const [users, setUsers] = useState<User[]>([]);

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

    // 3. ฟังก์ชัน Submit สำหรับยิง API ไปหา NestJS
    async function onSubmit(data: UserFormValues) {
        setIsLoading(true);
        try {
            console.log(data)
            const payload = {
                ...data,
                user_id: parseInt(data.user_id),
            };
            console.log(payload)
            const result = await createTask(payload);

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
                <Button type="button"><PlusIcon /> Create new user</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Create new task</DialogTitle>
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
                                                <SelectItem value="In Progress">
                                                    In Progress
                                                </SelectItem>
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
        </Dialog >
    );
}