'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchMoreTasks } from '@/app/tasks/actions';

// นำเข้า UI Components ของคุณ (ปรับ path ให้ตรงกับโปรเจกต์จริง)
import {
    Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// สมมติว่ามี Component เหล่านี้
import UpdateTaskDialog from '@/components/task/update-task-dialog';
import DeleteTaskDialog from '@/components/task/delete-task-dialog';
import { Task } from '@/app/tasks/tasks';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '../ui/skeleton';

const statusColors: Record<string, string> = {
    "Done": "bg-green-50 text-green-700 border-green-200/30 dark:bg-green-950 dark:text-green-300 dark:border-green-800/30",
    "In Progress": "bg-blue-50 text-blue-700 border-blue-200/30 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800/30",
    "Todo": "bg-amber-50 text-amber-700 border-amber-200/30 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800/30",
};

const priorityColors: Record<string, string> = {
    "High": "bg-red-50 text-red-700 border-red-200/30 dark:bg-red-950 dark:text-red-300 dark:border-red-800/30",
    "Medium": "bg-yellow-50 text-yellow-700 border-yellow-200/30 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800/30",
    "Low": "bg-zinc-100 text-zinc-700 border-zinc-200/30 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/30",
};

interface TaskInfiniteListProps {
    initialTasks: Task[];
    initialNext: number | null;
    limit: number;
}

export function TaskInfiniteList({ initialTasks, initialNext, limit }: TaskInfiniteListProps) {
    const [tasks, setTasks] = useState(initialTasks);
    const [nextPage, setNextPage] = useState<number | null>(initialNext);
    const [isLoading, setIsLoading] = useState(false);
    const [prevInitialTasks, setPrevInitialTasks] = useState(initialTasks);

    // ปรับ State ทันทีที่ Props เปลี่ยนแปลง (ท่าที่ React แนะนำ แทนการใช้ useEffect เพื่อป้องกัน Cascading Renders)
    if (initialTasks !== prevInitialTasks) {
        setTasks(initialTasks);
        setNextPage(initialNext);
        setPrevInitialTasks(initialTasks);
    }


    // ใช้ Ref เพื่อเก็บค่าล่าสุด ป้องกันการสร้าง Observer ใหม่ทุกครั้งที่ state เปลี่ยน (สาเหตุของ loop)
    const isLoadingRef = useRef(isLoading);
    const nextPageRef = useRef(nextPage);

    useEffect(() => {
        isLoadingRef.current = isLoading;
        nextPageRef.current = nextPage;
    }, [isLoading, nextPage]);

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const loadMore = useCallback(async () => {
        // เช็คผ่าน Ref เพื่อความแม่นยำ
        if (!nextPageRef.current || isLoadingRef.current) return;

        setIsLoading(true);
        await sleep(500);

        try {
            const result = await fetchMoreTasks(nextPageRef.current, limit);
            if (result.data) {
                setTasks(prev => {
                    const existingIds = new Set(prev.map(t => t.id));
                    const newTasks = result.data.filter((t: Task) => !existingIds.has(t.id));
                    return [...prev, ...newTasks];
                });
                setNextPage(result.next);
            }
        } catch (error) {
            console.error("Failed to load more tasks:", error);
        } finally {
            setIsLoading(false);
        }
    }, [limit]);

    const observerInstance = useRef<IntersectionObserver | null>(null);

    // ใช้ Callback Ref เพื่อให้แน่ใจว่า Observe ตัว element ใหม่เสมอเมื่อมีการ Re-render
    const observerRef = useCallback((node: HTMLTableRowElement | null) => {
        if (observerInstance.current) observerInstance.current.disconnect();

        if (node) {
            observerInstance.current = new IntersectionObserver(
                (entries) => {
                    const [entry] = entries;
                    // ใช้ค่าจาก Ref เพื่อความแม่นยำ
                    if (entry.isIntersecting && nextPageRef.current && !isLoadingRef.current) {
                        loadMore();
                    }
                },
                {
                    threshold: 0.1,
                    rootMargin: '150px' // เริ่มโหลดก่อนถึงขอบ 100px
                }
            );
            observerInstance.current.observe(node);
        }
    }, [loadMore]);

    // ฟังก์ชันสำหรับอัปเดต State เมื่อข้อมูลเปลี่ยน
    const handleUpdateTask = useCallback((updatedTask: Task) => {
        const updatedId = updatedTask.id;
        setTasks(prev => prev.map(task => 
            task.id === updatedId ? updatedTask : task
        ));
    }, []);

    const handleDeleteTask = useCallback((taskId: string | number) => {
        const idStr = taskId.toString();
        setTasks(prev => prev.filter(task => task.id.toString() !== idStr));
    }, []);

    // ลบ useEffect ตัวเก่าที่ใช้ observerTarget.current ออก เพราะเราใช้ Callback Ref แทนแล้ว
    return (
        <div className="w-full max-w-5xl mx-auto">
            <Table className="text-pretty">
                <TableCaption>A list of tasks.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[30%]">Task Name</TableHead>
                        <TableHead className="w-[15%]">Status</TableHead>
                        <TableHead className="w-[15%]">Priority</TableHead>
                        <TableHead className="w-[30%]">Assigned To</TableHead>
                        <TableHead className="w-[10%]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task: Task) => {
                        const assignedUser = task.user;
                        return (
                            <TableRow key={task.id}>
                                <TableCell className="font-medium break-words">
                                    {task.title}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={statusColors[task.status] || "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}>
                                        {task.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={priorityColors[task.priority] || "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}>
                                        {task.priority}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {assignedUser ? (
                                            <Link
                                                href={`/users/${assignedUser.id}`}
                                                className="flex flex-row gap-2 items-center hover:underline min-w-0"
                                            >
                                                <Image
                                                    src={assignedUser.avatar || ""}
                                                    alt={assignedUser.name || "User avatar"}
                                                    width={40}
                                                    height={40}
                                                    loading="lazy"
                                                    className="w-10 h-10 rounded-full object-cover shrink-0"
                                                />
                                                <span className="break-words line-clamp-2">{assignedUser.name}</span>
                                            </Link>
                                        ) : (
                                            <span className="text-gray-500 italic">Unassigned</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <UpdateTaskDialog task={task} onUpdate={handleUpdateTask} />
                                        <DeleteTaskDialog task={task} onDelete={handleDeleteTask} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {/* Skeleton loading rows — แสดง 3 แถวตอนกำลังโหลด */}
                    {isLoading &&
                        Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={`skeleton-${index}`}>
                                <TableCell>
                                    <Skeleton className="h-5 w-3/4" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                                        <Skeleton className="h-5 w-24" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Skeleton className="w-8 h-8 rounded-md" />
                                        <Skeleton className="w-8 h-8 rounded-md" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    }

                    {/* Observer target — วางไว้ trigger โหลดเพิ่มเมื่อยังมี nextPage */}
                    {nextPage && (
                        <TableRow ref={observerRef} key={`observer-${tasks.length}`}>
                            <TableCell colSpan={5} className="h-4" />
                        </TableRow>
                    )}

                    {/* แสดงข้อความเมื่อโหลดหมดแล้ว */}
                    {!nextPage && !isLoading && tasks.length > 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-14">
                                <span className="text-gray-400">ไม่มีข้อมูลเพิ่มเติมแล้ว</span>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}