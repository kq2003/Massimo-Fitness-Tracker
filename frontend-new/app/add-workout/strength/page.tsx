'use client';

import { useEffect, useState } from "react";
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
import { addStrengthWorkout, fetchCurrentDay, fetchWorkoutPlan_add } from "@/services/api";

type Set = {
    reps: number;
    weight: number;
    restTime: number;
    effortLevel: number;
  };

  
// Updated Exercise type to include multiple sets
type Exercise = {
  name: string;
  sets: {
    reps: number;
    weight: number;
    restTime: number;
    effortLevel: number;
  }[];
};

type Workout = {
    exercise_name: string;
    sets: {
    reps: number;
    weight: number;
    restTime: number;
    effortLevel: number;
    }[];
    };

// Mock data for exercises
const exercises = [
  {
    name: "Bench Press",
    gif: "/bench-press.gif",
    description: "A compound exercise for chest, shoulders, and triceps.",
  },
  {
    name: "Squat",
    gif: "/squat.gif",
    description: "Focuses on lower body strength, mainly quads and glutes.",
  },
  {
    name: "Deadlift",
    gif: "/deadlift.gif",
    description: "Works the posterior chain, including back and hamstrings.",
  },
  {
    name: "Overhead Press",
    gif: "/overhead-press.gif",
    description: "Targets shoulders and upper chest, emphasizing stability.",
  },
];


export default function AddStrengthWorkout() {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [hoveredExercise, setHoveredExercise] = useState<string | null>(null);
  const [timer, isTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  

  const [currentDay, setCurrentDay] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  

useEffect(() => {
    const loadData = async () => {
        try {
            setLoading(true);
            const dayRes = await fetchCurrentDay();
            const day = dayRes.data.current_day;
            console.log(day);
            if (!day) {
                setError(dayRes.data.message);
                setLoading(false);
                return;
            }
            setCurrentDay(day.toLowerCase());

            const planRes = await fetchWorkoutPlan_add(currentDay);
            console.log(planRes)
            
            setSelectedExercises(planRes['workouts'].map((w: Workout) => ({
                name: w.exercise_name,
                sets: w.sets.map((set: Set) => ({
                    reps: set.reps,
                    weight: set.weight,
                    restTime: set.restTime,
                    effortLevel: set.effortLevel,
                })),
            })));
            
        } catch (err) {
            console.log("The error is" + err);
            setError("Failed to load workout plan.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    loadData();
}, []);


  useEffect(() => {
    setTimerRunning(true);
    const interval = setInterval(() => {
      isTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const validateInputs = () => {
    for (const exercise of selectedExercises) {
        for (const set of exercise.sets) {
            if (!set.reps || !set.weight || !set.restTime || !set.effortLevel) {
                return false;
            }
        }
    }
    return true;
};

    const handleStartTimer = () => {
        setTimerRunning(true);  // Start the timer when the button is clicked
    };

  // Add or update an exercise with a new set
  const addExercise = (exerciseName: string) => {
    const existingExerciseIndex = selectedExercises.findIndex((e) => e.name === exerciseName);

    if (existingExerciseIndex !== -1) {
      // Append a new set to the existing exercise
      const updatedExercises = [...selectedExercises];
      updatedExercises[existingExerciseIndex].sets.push({
        reps: 0,
        weight: 0,
        restTime: 0,
        effortLevel: 5,
      });
      setSelectedExercises(updatedExercises);
    } else {
      // Add the exercise as a new entry with the first set
      setSelectedExercises((prev) => [
        ...prev,
        { name: exerciseName, sets: [{ reps: 0, weight: 0, restTime: 0, effortLevel: 5 }] },
      ]);
    }
  };

  // Update a specific set of an exercise
  const updateExercise = (exerciseIndex: number, setIndex: number, field: keyof Exercise["sets"][0], value: number) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[exerciseIndex].sets[setIndex] = {
      ...updatedExercises[exerciseIndex].sets[setIndex],
      [field]: value,
    };
    setSelectedExercises(updatedExercises);
  };

  // Delete a specific set of an exercise
  const deleteExerciseSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    if (updatedExercises[exerciseIndex].sets.length === 0) {
      updatedExercises.splice(exerciseIndex, 1); // Remove the exercise if no sets remain
    }
    setSelectedExercises(updatedExercises);
  };

  const handleFinishWorkout = async () => {

    if (!validateInputs()) {
      alert("Please fill in all fields for each set.");
      return
    }
    try {
      for (const exercise of selectedExercises) {
        for (const set of exercise.sets) {
          await addStrengthWorkout({
            type: exercise.name,
            reps: set.reps,
            weight: set.weight,
            rest_time: set.restTime,
            effort_level: set.effortLevel,
          });
        }
      }
      alert("Workout saved successfully!");
      setSelectedExercises([]);
    } catch (error) {
      console.error("Failed to save workout:", error);
      alert("Error saving workout. Please try again.");
    }
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
                        <span>Menu</span>
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
        {loading && <div className="text-center">Loading workout plan...</div>}

        <div className="flex-1 flex flex-col p-4 space-y-4">

        <div className="timer mb-4">
        <h2>Workout Timer: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</h2>
            {!timerRunning && (
                <Button onClick={handleStartTimer} className="mt-2">
                Start Timer
                </Button>
            )}
        </div>

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
                    className="w-full h-auto max-h-60 object-contain rounded mb-4" // Updated class
                />
                <CardDescription>
                    {exercises.find((e) => e.name === hoveredExercise)?.description || ""}
                </CardDescription>
            </CardContent>

            </Card>
          )}

          {/* Selected Exercises */}
          <div className="flex flex-col gap-6">
            {selectedExercises.map((exercise, exerciseIndex) => (
              <Card key={exercise.name} className="w-full p-4 shadow-lg rounded-lg">
                <CardHeader>
                  <CardTitle>{exercise.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {exercise.sets.map((set, setIndex) => (
                        <div
                        key={setIndex}
                        className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-center gap-4 border border-muted p-4 rounded-md"
                        >
                        <div>
                            <label className="text-sm font-semibold text-muted-foreground">Reps</label>
                            <Input
                            type="number"
                            value={set.reps === 0 ? "" : set.reps}
                            placeholder="Reps"
                            onChange={(e) => {
                                const value = e.target.value === "" ? 0 : Number(e.target.value);
                                updateExercise(exerciseIndex, setIndex, "reps", value);
                            }}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-muted-foreground">Weight (kg)</label>
                            <Input
                            type="number"
                            value={set.weight === 0 ? "" : set.weight}
                            placeholder="Weight"
                            onChange={(e) => {
                                const value = e.target.value === "" ? 0 : Number(e.target.value);
                                updateExercise(exerciseIndex, setIndex, "weight", value);
                            }}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-muted-foreground">Rest (sec)</label>
                            <Input
                            type="number"
                            value={set.restTime === 0 ? "" : set.restTime}
                            placeholder="Rest Time"
                            onChange={(e) => {
                                const value = e.target.value === "" ? 0 : Number(e.target.value);
                                updateExercise(exerciseIndex, setIndex, "restTime", value);
                            }}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-muted-foreground">RPE</label>
                            <Slider
                            defaultValue={[set.effortLevel]}
                            max={10}
                            step={1}
                            value={[set.effortLevel]}
                            onValueChange={(value) =>
                                updateExercise(exerciseIndex, setIndex, "effortLevel", value[0])
                            }
                            />
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => deleteExerciseSet(exerciseIndex, setIndex)}
                            className="h-10"
                        >
                            Delete
                        </Button>
                        </div>
                    ))}
                    </CardContent>
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
