import { TaskInfiniteList } from '@/components/task/task-infinite-list';
// สมมติว่ามี Component นี้
import CreateTaskDialog from '@/components/task/create-task-dialog';
import { Task } from './tasks';

// กำหนด Interface ให้ชัดเจนสำหรับการตอบกลับแบบแบ่งหน้า
interface PaginatedResponse<T> {
  data: T[];
  pages: number;
  next: number | null;
  prev: number | null;
}

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
async function getTasks(page: number, limit: number): Promise<PaginatedResponse<Task>> {
  try {
    await sleep(1000);
    const res = await fetch(
      `${API_URL}/task?_page=${page}&_per_page=${limit}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.warn(`Failed to fetch tasks: ${res.status}.`);
      return { data: [], pages: 0, next: null, prev: null };
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch tasks error:", error);
    return { data: [], pages: 0, next: null, prev: null };
  }
}

export default async function TasksPage() {

  // โหลดเฉพาะหน้าแรกเสมอสำหรับ Initial Load
  const limit = 10;
  const tasksData = await getTasks(1, limit);
  const { data: tasks, next } = tasksData;

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
      <div className="w-full">
        <div className="flex justify-end mb-4">
          <CreateTaskDialog />
        </div>
      </div>
      <TaskInfiniteList
        initialTasks={tasks}
        initialNext={next}
        limit={limit}
      />
    </>
  );
}