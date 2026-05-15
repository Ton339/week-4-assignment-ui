import { Suspense } from "react";
import { Task } from "./tasks";
import Image from "next/image";
import Link from "next/link";
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
import CreateTaskDialog from "@/components/task/create-task-dialog";
import UpdateTaskDialog from "@/components/task/update-task-dialog";
import { DeleteTaskDialog } from "@/components/task/delete-task-dialog";

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
    const res = await fetch(
      `${API_URL}/task?_page=${page}&_per_page=${limit}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      console.warn(
        `Failed to fetch tasks: ${res.status}. Falling back to empty list.`,
      );
      return { data: [], pages: 0, next: null, prev: null };
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch tasks error:", error);
    return { data: [], pages: 0, next: null, prev: null };
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
  const limit = isNaN(rawLimit) ? 10 : rawLimit;

  // ดึงข้อมูลแบบ Parallel
  const [tasksData] = await Promise.all([getTasks(page, limit)]);
  const { data: tasks, pages: totalPages, next, prev } = tasksData;

  if (tasks.length === 0) {
    return (
      <>
        <CreateTaskDialog />
        <h1 className="text-4xl font-bold pb-6">No tasks found</h1>
      </>
    );
  }

  return (
    <>
      <CreateTaskDialog />
      <div className="w-full max-w-5xl">
        <Table>
          <TableCaption>A list of tasks.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%]">Task Name</TableHead>
              <TableHead className="w-[20%]">Status</TableHead>
              <TableHead className="w-[20%]">Priority</TableHead>
              <TableHead className="w-[25%]">Assigned To</TableHead>
              <TableHead className="w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task: Task) => {
              const assignedUser = task.user;
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
                  <TableCell>
                    <div className="flex gap-2">
                      <UpdateTaskDialog task={task} />
                      <DeleteTaskDialog task={task} />
                    </div>
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
