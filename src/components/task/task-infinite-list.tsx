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
import TaskSelect from './task-select';
import { Skeleton } from '../ui/skeleton';

interface TaskInfiniteListProps {
    initialTasks: Task[];
    initialNext: number | null;
    limit: number;
}

export function TaskInfiniteList({ initialTasks, initialNext, limit }: TaskInfiniteListProps) {
    const [tasks, setTasks] = useState(initialTasks);
    const [nextPage, setNextPage] = useState<number | null>(initialNext);
    const [isLoading, setIsLoading] = useState(false);


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
        <div className="w-full max-w-5xl">
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
                                    <TaskSelect defaultValue={task.status} type="status" />
                                </TableCell>
                                <TableCell>
                                    <TaskSelect defaultValue={task.priority} type="priority" />
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
                                    <Skeleton className="h-9 w-full max-w-[120px] rounded-md" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-9 w-full max-w-[120px] rounded-md" />
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