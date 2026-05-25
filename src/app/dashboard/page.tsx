import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import {
  TotalUsersCard,
  TotalTasksCard,
  TasksDoneCard,
  type DashboardSummaryDto
} from "@/components/dashboard/stat-cards";
import type { TaskStatusDistributionDto } from "@/components/dashboard/task-status-chart";
import type { TaskVolumePriorityDto } from "@/components/dashboard/task-priority-chart";
import type { WorkloadOccupationDto } from "@/components/dashboard/user-workload-occupation-chart";
import type { TaskCreationTrendDto } from "@/components/dashboard/task-creation-trends";

// Use Next.js dynamic to lazy load the chart client components
const TaskStatusChart = dynamic(() => import("@/components/dashboard/task-status-chart").then(mod => mod.TaskStatusChart));
const TaskPriorityChart = dynamic(() => import("@/components/dashboard/task-priority-chart").then(mod => mod.TaskPriorityChart));
const UserWorkloadOccupationChart = dynamic(() => import("@/components/dashboard/user-workload-occupation-chart").then(mod => mod.UserWorkloadOccupationChart));
const TaskCreationTrends = dynamic(() => import("@/components/dashboard/task-creation-trends").then(mod => mod.TaskCreationTrends));

// Force dynamic rendering so Next.js doesn't pre-render at build time
export const fetchCache = "force-no-store";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchDashboardData<T = unknown>(endpoint: string): Promise<T | null> {
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  // Simulate delay to show Suspense effect and satisfy lazy loading requirement
  await sleep(300);
  
  try {
    const res = await fetch(`${apiUrl}${endpoint}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch (e) {
    console.error(`Failed to fetch ${endpoint}:`, e);
    return null;
  }
}

// ----------------------------------------------------
// Independent Fetchers for each Card and Chart
// ----------------------------------------------------
async function UsersCardFetcher() {
  const data = await fetchDashboardData<DashboardSummaryDto>('/dashboard/summary-cards');
  return <TotalUsersCard value={data?.totalUsers || 0} />;
}

async function TasksCardFetcher() {
  const data = await fetchDashboardData<DashboardSummaryDto>('/dashboard/summary-cards');
  return <TotalTasksCard value={data?.totalTasks || 0} />;
}

async function DoneCardFetcher() {
  const data = await fetchDashboardData<DashboardSummaryDto>('/dashboard/summary-cards');
  return <TasksDoneCard value={data?.completedTasks || 0} />;
}

async function StatusChartFetcher() {
  const data = await fetchDashboardData<TaskStatusDistributionDto[]>('/dashboard/task-status');
  return <TaskStatusChart data={data || []} />;
}

async function PriorityChartFetcher() {
  const data = await fetchDashboardData<TaskVolumePriorityDto[]>('/dashboard/task-priority');
  return <TaskPriorityChart data={data || []} />;
}

async function WorkloadChartFetcher() {
  const data = await fetchDashboardData<WorkloadOccupationDto[]>('/dashboard/workload-occupation');
  return <UserWorkloadOccupationChart data={data || []} />;
}

async function TrendsChartFetcher() {
  const data = await fetchDashboardData<TaskCreationTrendDto[]>('/dashboard/task-creation-trends');
  return <TaskCreationTrends data={data || []} />;
}

// ----------------------------------------------------
// Skeletons for Fallbacks
// ----------------------------------------------------
function CardSkeleton() {
  return <Skeleton className="h-[160px] w-full rounded-2xl bg-zinc-900/50" />;
}

function ChartSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-[400px] w-full rounded-xl bg-zinc-900/50 ${className || ''}`} />;
}

export default function DashboardPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-4">

      {/* Responsive 3-Card Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<CardSkeleton />}>
          <UsersCardFetcher />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <TasksCardFetcher />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <DoneCardFetcher />
        </Suspense>
      </div>

      {/* Statistics and Analytics section (Charts) */}
      <div className="mt-12 space-y-12 border-t border-white/5 pt-8">
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Status & Priority Overview</h2>
            <p className="text-sm text-zinc-400 mt-1">Proportion and priority level of all tasks in the system</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Suspense fallback={<ChartSkeleton />}>
              <StatusChartFetcher />
            </Suspense>
            <Suspense fallback={<ChartSkeleton />}>
              <PriorityChartFetcher />
            </Suspense>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Trends & Workload Overview</h2>
            <p className="text-sm text-zinc-400 mt-1">Task volume and workload distributed by occupation</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-10">
            <div className="col-span-1 md:col-span-4">
              <Suspense fallback={<ChartSkeleton />}>
                <WorkloadChartFetcher />
              </Suspense>
            </div>
            <div className="col-span-1 md:col-span-6">
              <Suspense fallback={<ChartSkeleton />}>
                <TrendsChartFetcher />
              </Suspense>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
