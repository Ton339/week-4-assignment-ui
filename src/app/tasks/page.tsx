import { Suspense } from "react";
import { Task } from "./tasks";
import Image from "next/image";
import Link from "next/link";
import { User } from "../users/user";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskPagination from "@/components/task-pagination";

// กำหนด Interface ให้ชัดเจนสำหรับการตอบกลับแบบแบ่งหน้า
interface PaginatedResponse<T> {
  data: T[];
  pages: number;
  next: number | null;
  prev: number | null;
}

// Server-side: use API_URL (internal Docker address), fallback to NEXT_PUBLIC for local dev
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

// แยกฟังก์ชันดึงข้อมูล Task ออกมาเพื่อให้โค้ดหลักสะอาดขึ้น
async function getTasks(
  page: number,
  limit: number,
): Promise<PaginatedResponse<Task>> {
  try {
    // NestJS supports pagination via _page and _per_page
    const res = await fetch(`${API_URL}/task?_page=${page}&_per_page=${limit}`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      console.warn(`Failed to fetch tasks: ${res.status}. Falling back to empty list.`);
      return { data: [], pages: 0, next: null, prev: null };
    }
    
    return await res.json();
  } catch (error) {
    console.error("Fetch tasks error:", error);
    return { data: [], pages: 0, next: null, prev: null };
  }
}

// แยกฟังก์ชันดึงข้อมูล User
async function getUsers(): Promise<User[]> {
  try {
    // NestJS might not have /users yet, handle 404 gracefully
    const res = await fetch(`${API_URL}/users`, { cache: "no-store" });
    if (!res.ok) {
      console.warn(`Users endpoint returned ${res.status}. Returning empty array.`);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Fetch users error:", error);
    return [];
  }
}

export default async function TasksPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  // ป้องกัน Error กรณีผู้ใช้พิมพ์ URL parameter เป็นตัวอักษร (NaN)
  const rawPage = parseInt(searchParams.page as string, 10);
  const rawLimit = parseInt(searchParams.limit as string, 10);
  const page = isNaN(rawPage) ? 1 : rawPage;
  const limit = isNaN(rawLimit) ? 25 : rawLimit;

  // ดึงข้อมูลแบบ Parallel
  const [tasksData, users] = await Promise.all([
    getTasks(page, limit),
    getUsers(),
  ]);

  const { data: tasks, pages: totalPages, next, prev } = tasksData;

  // สร้าง Dictionary สำหรับ User Lookup O(1)
  const userDict = users.reduce(
    (acc, user) => {
      acc[user.id] = user;
      return acc;
    },
    {} as Record<string, User>,
  );

  return (
    <>
      <title>Tasks list</title>
      <meta name="description" content="Tasks list" />
      <link rel="icon" href="TASKS" />

      <div className="w-full max-w-5xl">
        <Table>
          <TableCaption>A list of tasks.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%]">Task Name</TableHead>
              <TableHead className="w-[20%]">Status</TableHead>
              <TableHead className="w-[20%]">Priority</TableHead>
              <TableHead className="w-[25%]">Assigned To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const assignedUser = userDict[task.userId];

              return (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Select defaultValue={task.status}>
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
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={task.priority}>
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
                  </TableCell>
                  <TableCell className="text-right flex items-center gap-2">
                    {assignedUser ? (
                      <Link
                        href={`/users/${assignedUser.id}`}
                        className="flex flex-row gap-2 items-center hover:underline"
                      >
                        <Image
                          src={assignedUser.avatar || ""}
                          alt={assignedUser.name || "User avatar"}
                          width={40}
                          height={40}
                          loading="eager"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {assignedUser.name}
                      </Link>
                    ) : (
                      <span className="text-gray-500 italic">Unassigned</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow></TableRow>
          </TableFooter>
        </Table>

        <Suspense fallback={<div className="h-10" />}>
          <TaskPagination
            currentPage={page}
            totalPages={totalPages}
            limit={limit}
            hasNext={next !== null}
            hasPrev={prev !== null}
          />
        </Suspense>
      </div>
    </>
  );
}
