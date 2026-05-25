"use client"

import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

export const description = "A pie chart with a label"

const chartConfig = {
    visitors: {
        label: "Tasks",
    },
    Todo: {
        label: "Todo",
        color: "var(--chart-1)",
    },
    "In Progress": {
        label: "In Progress",
        color: "var(--chart-2)",
    },
    Done: {
        label: "Done",
        color: "var(--chart-3)",
    },
    Other: {
        label: "Other",
        color: "var(--chart-4)",
    }
} satisfies ChartConfig

export interface TaskStatusDistributionDto {
    status: string;
    count: string | number; // ใส่ string | number เผื่อไว้กรณีแปลงค่า
}

export function TaskStatusChart({ data = [] }: { data?: TaskStatusDistributionDto[] }) {
    // Map backend data to recharts format and assign colors
    const chartData = data.map((item) => ({
        status: item.status,
        count: Number(item.count) || 0,
        fill: (chartConfig as ChartConfig)[item.status]?.color,
    }))

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Task Status Distribution</CardTitle>
                <CardDescription>Visualizes the overall proportion of tasks in each status (Todo, In Progress, Done) to track project progress.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="count" label nameKey="status" />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
