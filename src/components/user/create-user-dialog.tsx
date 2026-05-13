"use client";

import * as React from "react"
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod";

// 1. สร้าง Zod Schema ให้ล้อตาม CreateUserDto ของ NestJS
const userSchema = z.object({
    name: z.string().min(1, "name is required"),
    email: z.string().email("email is required"),
    role: z.string().min(1, "role is required"),
    status: z.string(),
    avatar: z.string(),
    address: z.string(),
    birthdate: z.string(), // รับเป็น String จาก input type="date" ก่อน
    phone: z.string(),
    occupation: z.string().min(1, "occupation is required"),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function CreateUserDialog({ onSuccess }: { onSuccess?: () => void }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dateOpen, setDateOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)

    // 2. ตั้งค่า React Hook Form
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "", email: "", role: "", status: "Active", avatar: "", address: "", birthdate: "", phone: "", occupation: "",
        },
    });

    // 3. ฟังก์ชัน Submit สำหรับยิง API ไปหา NestJS
    async function onSubmit(data: UserFormValues) {
        setIsLoading(true);
        try {
            // 💡 แปลง birthdate จาก String เป็น ISO String เพื่อให้ NestJS (@IsDate) อ่านรู้เรื่อง
            const payload = {
                ...data,
                birthdate: new Date(data.birthdate).toISOString(),
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, { // เปลี่ยนเป็น URL ของ NestJS
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("บันทึกข้อมูลไม่สำเร็จ");

            setOpen(false); // ปิด Dialog
            form.reset(); // ล้างค่าฟอร์ม
            // 💡 เรียกฟังก์ชัน fetchUsers() เพื่อโหลดตารางใหม่ (Refetch)
            if (onSuccess) onSuccess();
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
                        <DialogTitle>Create new user</DialogTitle>
                        <DialogDescription>
                            Please enter your information here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="grid grid-cols-2 gap-4">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Name</FieldLabel>
                                    <Input {...field} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input {...field} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="role"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Role</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Admin">Admin</SelectItem>
                                                <SelectItem value="User">User</SelectItem>
                                                <SelectItem value="Editor">Editor</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Field>
                            <FieldLabel>Status</FieldLabel>
                            <Select defaultValue="Active" onValueChange={(value) => form.setValue("status", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <FieldLabel>avatar</FieldLabel>
                            <Input {...form.register("avatar")} />
                        </Field>
                        <Field>
                            <FieldLabel>Address</FieldLabel>
                            <Textarea {...form.register("address")} />
                        </Field>
                        <Field className="mx-auto w-44">
                            <FieldLabel htmlFor="date">Date of birth</FieldLabel>
                            <Popover open={dateOpen} onOpenChange={setDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date"
                                        type="button"
                                        className="justify-start font-normal"
                                    >
                                        {date ? date.toLocaleDateString() : "Select date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        defaultMonth={date}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setDate(date)
                                            setDateOpen(false)
                                            if (date) {
                                                form.setValue("birthdate", date.toISOString());
                                            }
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </Field>
                        <Field>
                            <FieldLabel>Phone</FieldLabel>
                            <Input {...form.register("phone")} />
                        </Field>
                        <Controller
                            name="occupation"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Occupation</FieldLabel>
                                    <Input {...field} />
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