import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { MonthlyViewData } from "@/components/monthly-view-chart";

// Force dynamic rendering so Next.js doesn't pre-render at build time
// (the API won't be available during Docker build)
export const fetchCache = "force-no-store";

const MonthlyViewChart = dynamic(
  () => import("@/components/monthly-view-chart"),
);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// นี่คือ Server Component ที่รับจบเรื่อง Data Fetching
async function ChartDataFetcher() {
  // Server-side: use API_URL (internal Docker address), fallback to NEXT_PUBLIC for local dev
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  // จำลองความช้าให้เห็นผลลัพธ์ของ Suspense
  await sleep(2000);

  const res = await fetch(`${apiUrl}/dashboardStats-monthlyViews`);

  let data;
  if (!res.ok) {
    console.warn(`Dashboard stats API returned ${res.status}. Using mock data.`);
    // Mock data for demonstration if API is missing
    data = [{
      monthlyViews: [
        { month: "Jan", views: 100 },
        { month: "Feb", views: 200 },
        { month: "Mar", views: 150 },
      ],
      TrendingPercentage: 5.2,
      Description: "Showing total views for the last 3 months (Mock Data)",
    }];
  } else {
    data = await res.json();
  }

  const chartData: MonthlyViewData[] = data[0].monthlyViews;
  const chartTrending: number = data[0].TrendingPercentage;
  const chartDescription: string = data[0].Description;

  // โยนข้อมูลลงไปเป็น Props ให้ Component ลูก
  return (
    <MonthlyViewChart
      chartData={chartData}
      chartTrending={chartTrending}
      chartDescription={chartDescription}
    />
  );
}

export default function DashboardPage() {
  return (
    <>
      <title>Dashboard</title>
      <meta name="description" content="Dashboard" />
      <link rel="icon" href="/favicon.ico" />
      <h1 className="text-4xl font-bold pb-6 ">Dashboard</h1>
      <div className="justify-self-center w-full max-w-4xl mx-auto">
        {/* Suspense จะทำงานตอน ChartDataFetcher กำลังโหลดข้อมูล (await) */}
        <Suspense
          fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}
        >
          <ChartDataFetcher />
        </Suspense>
      </div>
    </>
  );
}
