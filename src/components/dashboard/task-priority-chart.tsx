"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

export const description = "A bar chart"

const chartConfig = {
    count: {
        label: "Tasks",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export interface TaskVolumePriorityDto {
  priority: string;
  count: string | number;
}

export function TaskPriorityChart({ data = [] }: { data?: TaskVolumePriorityDto[] }) {
    const chartData = data.map(item => ({
        priority: item.priority,
        count: Number(item.count) || 0
    }))

    return (
        <Card>
            <CardHeader>
                <CardTitle>Task Volume by Priority</CardTitle>
                <CardDescription>Evaluates the urgency of tasks in the system by showing the count of High, Medium, and Low priority tasks.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="priority"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="count" fill="var(--color-count)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
