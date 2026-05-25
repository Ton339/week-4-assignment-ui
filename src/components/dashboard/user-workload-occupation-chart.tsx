"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

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

export const description = "A horizontal bar chart"

const chartConfig = {
    count: {
        label: "Tasks",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export interface WorkloadOccupationDto {
  occupation: string;
  count: string | number;
}

export function UserWorkloadOccupationChart({ data = [] }: { data?: WorkloadOccupationDto[] }) {
    const chartData = data.map(item => ({
        occupation: item.occupation,
        count: Number(item.count) || 0
    }))

    return (
        <Card className="col-span-4 flex flex-col h-full">
            <CardHeader>
                <CardTitle>Workload by Occupation</CardTitle>
                <CardDescription>Analyzes which roles (e.g., Software Engineer, Data Analyst) currently have the highest number of assigned tasks.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <ChartContainer config={chartConfig} className="h-full w-full min-h-[250px]">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: 0,
                        }}
                    >
                        <XAxis type="number" dataKey="count" hide />
                        <YAxis
                            dataKey="occupation"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            width={120}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="count" fill="var(--color-count)" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
