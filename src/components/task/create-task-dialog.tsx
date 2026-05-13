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

export default function CreateTaskDialog({ onSuccess }: { onSuccess?: () => void }) {

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild>
                <Button type="button"><PlusIcon /> Create new user</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <form>
                    <DialogHeader>
                        <DialogTitle>Create new user</DialogTitle>
                        <DialogDescription>
                            Please enter your information here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
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