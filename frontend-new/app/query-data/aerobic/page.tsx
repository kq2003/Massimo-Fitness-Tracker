"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getAerobicProgress, getAerobicExerciseTypes } from "@/services/api";

const chartConfig = {
  duration: {
    label: "Duration (minutes)",
    color: "hsl(var(--chart-1))",
  },
  calories: {
    label: "Calories Burnt",
    color: "hsl(var(--chart-2))",
  },
  heartRate: {
    label: "Heart Rate",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function AerobicProgress() {
  const [exerciseTypes, setExerciseTypes] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [selectedMetric, setSelectedMetric] = useState<"duration" | "calories" | "heartRate">("duration");
  const [chartData, setChartData] = useState<{ date: string; value: number }[]>([]);

  useEffect(() => {
    // Fetch exercise types on mount
    const fetchExerciseTypes = async () => {
      try {
        const response = await getAerobicExerciseTypes();
        setExerciseTypes(response.data);
      } catch (error) {
        console.error("Error fetching aerobic exercise types:", error);
      }
    };

    fetchExerciseTypes();
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      const fetchData = async () => {
        try {
          const response = await getAerobicProgress(selectedExercise);
          const { dates, durations, calories, heartRates } = response.data;

          const metricData =
            selectedMetric === "duration"
              ? durations
              : selectedMetric === "calories"
              ? calories
              : heartRates;

          const formattedData = dates.map((date: string, index: number) => ({
            date,
            value: metricData[index],
          }));

          setChartData(formattedData);
        } catch (error) {
          console.error("Error fetching aerobic progress:", error);
        }
      };

      fetchData();
    }
  }, [selectedExercise, selectedMetric]);

  return (
    <div className="space-y-6">
      {/* Exercise Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Exercise</CardTitle>
          <CardDescription>Choose an exercise to view its progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setSelectedExercise(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an exercise" />
            </SelectTrigger>
            <SelectContent>
              {exerciseTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Metric Selection */}
      {selectedExercise && (
        <Card>
          <CardHeader>
            <CardTitle>Select Metric</CardTitle>
            <CardDescription>Choose a metric to analyze for your aerobic progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setSelectedMetric(value as "duration" | "calories" | "heartRate")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="calories">Calories Burnt</SelectItem>
                <SelectItem value="heartRate">Heart Rate</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Chart Display */}
      {selectedExercise && selectedMetric && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedExercise} Progress</CardTitle>
            <CardDescription>Track your {selectedExercise} workout progress</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  left: 12,
                  right: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 10)}
                />
                <YAxis
                  label={{
                    value: chartConfig[selectedMetric].label,
                    angle: -90,
                    position: "insideLeft",
                  }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="value"
                  type="natural"
                  stroke={chartConfig[selectedMetric].color}
                  strokeWidth={2}
                  dot={{
                    fill: chartConfig[selectedMetric].color,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Review your {selectedExercise} trends over time.
            </div>
            <div className="leading-none text-muted-foreground">
              Data fetched dynamically from your workout history.
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
