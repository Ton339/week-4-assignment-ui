import * as React from "react";
import { Users, ClipboardList, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardSummaryDto {
  totalUsers: number;
  totalTasks: number;
  completedTasks: number;
}

interface StatCardProps extends React.ComponentProps<"div"> {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  iconBgClass: string;
  glowColorClass: string;
  borderAccentClass: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  iconBgClass,
  glowColorClass,
  borderAccentClass,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-zinc-950/40 backdrop-blur-xl border border-white/5 p-6 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:border-white/10",
        className
      )}
      {...props}
    >
      {/* Dynamic Colored Border Accent at the top */}
      <div className={cn("absolute top-0 left-0 right-0 h-[3px] opacity-70 group-hover:opacity-100 transition-opacity", borderAccentClass)} />

      {/* Decorative Glow effect on hover */}
      <div
        className={cn(
          "absolute -right-16 -top-16 h-36 w-36 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-all duration-500",
          glowColorClass
        )}
      />

      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">
            {title}
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            {value}
          </h3>
        </div>

        {/* Beautiful Icon Container */}
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl border transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110",
            iconBgClass
          )}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
        <p className="text-xs font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors">
          {description}
        </p>
      </div>
    </div>
  );
}

// 👥 ผู้ใช้งานทั้งหมด (Total Users)
export function TotalUsersCard({ value = 0 }: { value?: DashboardSummaryDto["totalUsers"] }) {
  return (
    <StatCard
      title="ผู้ใช้งานทั้งหมด"
      value={`${value} คน`}
      description="จำนวนผู้ใช้ลงทะเบียนในระบบ"
      icon={<Users className="h-5 w-5" />}
      iconBgClass="bg-violet-500/10 text-violet-400 border-violet-500/20"
      glowColorClass="bg-violet-500"
      borderAccentClass="bg-gradient-to-r from-violet-500 to-fuchsia-500"
    />
  );
}

// 📝 งานทั้งหมด (Total Tasks)
export function TotalTasksCard({ value = 0 }: { value?: DashboardSummaryDto["totalTasks"] }) {
  return (
    <StatCard
      title="งานทั้งหมด"
      value={`${value} งาน`}
      description="งานที่ถูกสร้างขึ้นในระบบทั้งหมด"
      icon={<ClipboardList className="h-5 w-5" />}
      iconBgClass="bg-blue-500/10 text-blue-400 border-blue-500/20"
      glowColorClass="bg-blue-500"
      borderAccentClass="bg-gradient-to-r from-blue-500 to-indigo-500"
    />
  );
}

// ✅ งานที่เสร็จแล้ว (Tasks Done)
export function TasksDoneCard({ value = 0 }: { value?: DashboardSummaryDto["completedTasks"] }) {
  return (
    <StatCard
      title="งานที่เสร็จแล้ว"
      value={`${value} งาน`}
      description="งานที่เสร็จสมบูรณ์เรียบร้อยแล้ว"
      icon={<CheckCircle2 className="h-5 w-5" />}
      iconBgClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      glowColorClass="bg-emerald-500"
      borderAccentClass="bg-gradient-to-r from-emerald-500 to-teal-500"
    />
  );
}
