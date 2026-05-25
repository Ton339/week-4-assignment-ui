"use client"


import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

export const description = "A linear line chart"

const chartConfig = {
    count: {
        label: "Tasks Created",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export interface TaskCreationTrendDto {
  date: string; // Format: YYYY-MM-DD
  count: string | number;
}

export function TaskCreationTrends({ data = [] }: { data?: TaskCreationTrendDto[] }) {
    const chartData = data.map(item => ({
        date: item.date,
        count: Number(item.count) || 0
    }))

    return (
        <Card className="col-span-6 flex flex-col h-full">
            <CardHeader>
                <CardTitle>Task Creation Trends</CardTitle>
                <CardDescription>Tracks the volume of new tasks created over time (daily/weekly) to monitor system activity.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <ChartContainer config={chartConfig} className="h-full w-full min-h-[250px]">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="count"
                            type="linear"
                            stroke="var(--color-count)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
