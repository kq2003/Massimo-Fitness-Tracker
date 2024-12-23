'use client';

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Define the Exercise type
type Exercise = {
  name: string;
  reps: number;
  weight: number;
  restTime: number;
  effortLevel: number;
};

// Mock data for exercises
const exercises = [
  {
    name: "Bench Press",
    gif: "/gifs/bench-press.gif",
    description: "A compound exercise for chest, shoulders, and triceps.",
  },
  {
    name: "Squat",
    gif: "/gifs/squat.gif",
    description: "Focuses on lower body strength, mainly quads and glutes.",
  },
  {
    name: "Deadlift",
    gif: "/gifs/deadlift.gif",
    description: "Works the posterior chain, including back and hamstrings.",
  },
  {
    name: "Overhead Press",
    gif: "/gifs/overhead-press.gif",
    description: "Targets shoulders and upper chest, emphasizing stability.",
  },
];

export default function AddStrengthWorkout() {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [hoveredExercise, setHoveredExercise] = useState<string | null>(null);

  const addExercise = (exerciseName: string) => {
    if (!selectedExercises.find((e) => e.name === exerciseName)) {
      setSelectedExercises((prev) => [
        ...prev,
        { name: exerciseName, reps: 0, weight: 0, restTime: 0, effortLevel: 5 },
      ]);
    }
  };

  const updateExercise = (index: number, field: keyof Exercise, value: number) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    };
    setSelectedExercises(updatedExercises);
  };

  const deleteExercise = (index: number) => {
    setSelectedExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFinishWorkout = () => {
    console.log("Workout Details:", selectedExercises);
    alert("Workout saved successfully!");
    setSelectedExercises([]);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <h2 className="text-lg font-bold">Strength Workouts</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Exercises</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {exercises.map((exercise) => (
                    <SidebarMenuItem key={exercise.name}>
                      <SidebarMenuButton
                        asChild
                        onMouseEnter={() => setHoveredExercise(exercise.name)}
                        onMouseLeave={() => setHoveredExercise(null)}
                        onClick={() => addExercise(exercise.name)}
                      >
                        <button className="w-full text-left hover:bg-gray-100 p-2 rounded">
                          <span>{exercise.name}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() => {
                          window.location.href = "/menu";
                        }}
                        className="w-full text-left text-red-500 hover:bg-red-100 p-2 rounded"
                      >
                        <span>Back to Menu</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <p className="text-sm">Hover over an exercise for details.</p>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-4 space-y-4">
          {/* Hovered Exercise Details */}
          {hoveredExercise && (
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>{hoveredExercise}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={exercises.find((e) => e.name === hoveredExercise)?.gif || ""}
                  alt={hoveredExercise}
                  className="w-full h-40 object-cover rounded mb-4"
                />
                <CardDescription>
                  {exercises.find((e) => e.name === hoveredExercise)?.description || ""}
                </CardDescription>
              </CardContent>
            </Card>
          )}

          {/* Selected Exercises */}
          <div className="flex flex-wrap gap-4">
            {selectedExercises.map((exercise, index) => (
              <Card key={exercise.name} className="w-full md:w-1/2 lg:w-1/3 p-4 space-y-4">
                <CardHeader>
                  <CardTitle>{exercise.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <label>
                    Reps:
                    <Input
                      type="number"
                      placeholder="Enter number of reps"
                      value={exercise.reps}
                      onChange={(e) => updateExercise(index, "reps", Number(e.target.value))}
                    />
                  </label>
                  <label>
                    Weight (kg):
                    <Input
                      type="number"
                      placeholder="Enter weight in kg"
                      value={exercise.weight}
                      onChange={(e) => updateExercise(index, "weight", Number(e.target.value))}
                    />
                  </label>
                  <label>
                    Rest Time (sec):
                    <Input
                      type="number"
                      placeholder="Enter rest time in seconds"
                      value={exercise.restTime}
                      onChange={(e) => updateExercise(index, "restTime", Number(e.target.value))}
                    />
                  </label>
                  <label>
                    Effort Level (RPE):
                    <Slider
                      defaultValue={[exercise.effortLevel]}
                      max={10}
                      step={1}
                      value={[exercise.effortLevel]}
                      onValueChange={(value) => updateExercise(index, "effortLevel", value[0])}
                    />
                  </label>
                </CardContent>
                <Button
                  variant="destructive"
                  onClick={() => deleteExercise(index)}
                  className="w-full"
                >
                  Delete Exercise
                </Button>
              </Card>
            ))}
          </div>

          {/* Finish Workout */}
          {selectedExercises.length > 0 && (
            <Button onClick={handleFinishWorkout} className="w-full mt-4">
              Finish Workout
            </Button>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}


