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
import { getStrengthProgress, getStrengthExerciseTypes } from "@/services/api";

// Configuration for metrics
const chartConfig = {
  weight: {
    label: "Top Set Weight (kg)",
    color: "hsl(var(--chart-1))",
  },
  volume: {
    label: "Total Volume (kg)",
    color: "hsl(var(--chart-2))",
  },
  intensity: {
    label: "Relative Intensity (%)",
    color: "hsl(var(--chart-3))",
  },
  oneRepMax: {
    label: "One Rep Max (kg)",
    color: "hsl(var(--chart-4))",
  },
} as const;

type MetricKey = keyof typeof chartConfig; // Define a union type for all metrics

export default function StrengthProgress() {
  const [exerciseTypes, setExerciseTypes] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("weight"); // Use the union type
  const [chartData, setChartData] = useState<
    { date: string; weight?: number; volume?: number; intensity?: number; oneRepMax?: number }[]
  >([]);

  useEffect(() => {
    // Fetch available exercise types on component mount
    const fetchExerciseTypes = async () => {
      try {
        const response = await getStrengthExerciseTypes();
        setExerciseTypes(response.data);
      } catch (error) {
        console.error("Error fetching strength exercise types:", error);
      }
    };

    fetchExerciseTypes();
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      const fetchData = async () => {
        try {
          const response = await getStrengthProgress(selectedExercise);
          const { dates, first_set_weights, relative_intensities, one_rep_maxes, total_volumes} = response.data;

          // Format chart data dynamically based on available metrics
          const formattedData = dates.map((date: string, index: number) => ({
            date,
            weight: first_set_weights[index],
            volume: total_volumes[index],
            oneRepMax: one_rep_maxes[index], // Add 1RM to the chart data
          }));

          setChartData(formattedData);
        } catch (error) {
          console.error("Error fetching strength progress:", error);
        }
      };

      fetchData();
    }
  }, [selectedExercise]);

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
            <CardDescription>Choose a metric to plot for {selectedExercise}</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value: MetricKey) => setSelectedMetric(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight">Top Set Weight</SelectItem>
                <SelectItem value="volume">Total Volume</SelectItem>
                {/* <SelectItem value="intensity">Relative Intensity</SelectItem> */}
                <SelectItem value="oneRepMax">One Rep Max</SelectItem> {/* Add 1RM */}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Chart */}
      {selectedExercise && selectedMetric && (
        <Card>
          <CardHeader>
            <CardTitle>{`${selectedExercise} - ${chartConfig[selectedMetric].label} Progress`}</CardTitle>
            <CardDescription>Visualize your {chartConfig[selectedMetric].label} progress over time</CardDescription>
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
                  tickFormatter={(value) => value.slice(0, 10)} // Shorten the date format
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
                  dataKey={selectedMetric}
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








