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
  SidebarProvider
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { addStrengthWorkout, fetchWorkoutPlan_add, fetchCurrentDay } from "@/services/api";
import { Loader2 } from "lucide-react"; // For loading spinner

type Set = {
  reps: number;
  weight: number;
  restTime: number;
  effortLevel: number;
};

type Exercise = {
  name: string;
  sets: Set[];
};

type Workout = {
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
  rest_time: number;
  effort_level: number;
};

type WorkoutDay = {
  day: string;
  workouts: Workout[];
};

// Mock data for exercises (if needed)
const exercises = [
  { name: "Bench Press", gif: "/gifs/bench-press.gif", description: "Chest, shoulders, triceps." },
  { name: "Squat", gif: "/gifs/squat.gif", description: "Legs and glutes." },
  { name: "Deadlift", gif: "/gifs/deadlift.gif", description: "Back and hamstrings." },
  { name: "Overhead Press", gif: "/gifs/overhead-press.gif", description: "Shoulders and upper chest." },
];

export default function AddStrengthWorkout() {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [hoveredExercise, setHoveredExercise] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const [currentDay, setCurrentDay] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
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
        console.log("Hehe" + planRes.data.workouts);
        
        setSelectedExercises(planRes.data.workouts.map((w: Workout) => ({
          name: w.exercise_name,
          sets: Array.from({ length: w.sets }, () => ({
            reps: w.reps,
            weight: w.weight,
            restTime: w.rest_time,
            effortLevel: w.effort_level,
          })),
        })));
          

        
      } catch (err) {
        console.log("The fucking error is" + err);
        setError("Failed to load workout plan.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

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

  // Add or update an exercise with a new set
  const addExercise = (exerciseName: string) => {
    if (currentDay === 'rest') {
      alert("Today is a Rest Day. No exercises to add.");
      return;
    }
    const exists = selectedExercises.find(e => e.name === exerciseName);
    if (exists) {
      exists.sets.push({ reps: 0, weight: 0, restTime: 0, effortLevel: 5 });
      setSelectedExercises([...selectedExercises]);
    } else {
      setSelectedExercises([...selectedExercises, { name: exerciseName, sets: [{ reps: 0, weight: 0, restTime: 0, effortLevel: 5 }] }]);
    }
  };

  // Update a specific set of an exercise
  const updateExercise = (exIdx: number, setIdx: number, field: keyof Set, value: number) => {
    const updated = [...selectedExercises];
    updated[exIdx].sets[setIdx][field] = value;
    setSelectedExercises(updated);
  };

  // Delete a specific set of an exercise
  const deleteSet = (exIdx: number, setIdx: number) => {
    const updated = [...selectedExercises];
    updated[exIdx].sets.splice(setIdx, 1);
    if (updated[exIdx].sets.length === 0) updated.splice(exIdx, 1);
    setSelectedExercises(updated);
  };

  // Handle finishing the workout and saving to backend
  const handleFinish = async () => {
    if (!validateInputs()) {
      alert("Please fill in all fields for each set.");
      return;
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
      // Optionally, refetch data or reset state
    } catch (error) {
      console.error("Failed to save workout:", error);
      alert("Error saving workout. Please try again.");
    }
  };

  if (loading) return <Loader2 className="animate-spin" />;

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
                {exercises.map(ex => (
                  <SidebarMenuItem key={ex.name}>
                    <SidebarMenuButton
                      asChild
                      onMouseEnter={() => setHoveredExercise(ex.name)}
                      onMouseLeave={() => setHoveredExercise(null)}
                      onClick={() => addExercise(ex.name)}
                    >
                      <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
                        {ex.name}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => window.location.href = "/menu"}
                      className="w-full text-left p-2 text-red-500 hover:bg-red-100 rounded"
                    >
                      Menu
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <p className="text-sm">Hover for details.</p>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Timer */}
        <div className="mb-4">
          <h2>Timer: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</h2>
          {!timerRunning && <Button onClick={() => setTimerRunning(true)}>Start Timer</Button>}
        </div>

        {/* Hover Details */}
        {hoveredExercise && (
          <Card className="max-w-md mb-4">
            <CardHeader>
              <CardTitle>{hoveredExercise}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={exercises.find(e => e.name === hoveredExercise)?.gif} alt={hoveredExercise} className="w-full h-40 object-cover rounded mb-2" />
              <CardDescription>{exercises.find(e => e.name === hoveredExercise)?.description}</CardDescription>
            </CardContent>
          </Card>
        )}

        {/* Current Day */}
        <h2 className="text-2xl mb-4">Today's Workout: {capitalizeFirstLetter(currentDay)}</h2>

        {/* Rest Day Message */}
        {currentDay === 'rest' && (
          <Card className="mb-4">
            <CardContent>
              <p>It's a Rest Day. Take a break!</p>
            </CardContent>
          </Card>
        )}

        {/* Exercises */}
        {currentDay !== 'rest' && selectedExercises.length > 0 ? selectedExercises.map((ex, exIdx) => (
          <Card key={ex.name} className="mb-4">
            <CardHeader>
              <CardTitle>{ex.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {ex.sets.map((set, setIdx) => (
                <div key={setIdx} className="flex items-center mb-2">
                  <Input
                    type="number"
                    placeholder="Reps"
                    value={set.reps || ''}
                    onChange={e => updateExercise(exIdx, setIdx, 'reps', Number(e.target.value))}
                    className="mr-2"
                  />
                  <Input
                    type="number"
                    placeholder="Weight"
                    value={set.weight || ''}
                    onChange={e => updateExercise(exIdx, setIdx, 'weight', Number(e.target.value))}
                    className="mr-2"
                  />
                  <Input
                    type="number"
                    placeholder="Rest (sec)"
                    value={set.restTime || ''}
                    onChange={e => updateExercise(exIdx, setIdx, 'restTime', Number(e.target.value))}
                    className="mr-2"
                  />
                  <Slider
                    value={[set.effortLevel]}
                    max={10}
                    step={1}
                    onValueChange={value => updateExercise(exIdx, setIdx, 'effortLevel', value[0])}
                    className="mr-2"
                  />
                  <Button variant="destructive" onClick={() => deleteSet(exIdx, setIdx)}>Del</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )) : currentDay !== 'rest' && <p>No workout plan for today. Please generate one.</p>}

        {/* Finish Workout */}
        {currentDay !== 'rest' && selectedExercises.length > 0 && (
          <Button onClick={handleFinish} className="w-full bg-green-500 hover:bg-green-600">Finish Workout</Button>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
    </SidebarProvider>
  );

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}