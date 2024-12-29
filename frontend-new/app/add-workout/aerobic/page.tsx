'use client';

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js useRouter for navigation
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { addAerobicWorkout } from "@/services/api";  // Import your addAerobicWorkout API method

// Predefined aerobic exercises
const aerobicExercises = [
  { name: "Running", description: "A full-body workout that improves cardiovascular health." },
  { name: "Cycling", description: "Great for building leg strength and improving stamina." },
  { name: "Jump Rope", description: "A quick and effective workout that improves coordination and endurance." },
  { name: "Swimming", description: "A low-impact exercise that works on all major muscle groups." },
  { name: "Rowing", description: "A full-body workout that targets the back, legs, and arms." },
  { name: "Hiking", description: "A low-impact aerobic exercise for cardiovascular endurance and leg strength." },
];

export default function AerobicPage() {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [workoutData, setWorkoutData] = useState({
    duration: 0,  // In minutes
    intensity: 5, // From 1 to 10
    caloriesBurnt: 0,  // User input or calculated
    heartRate: 0, // Optional
  });
  
  const router = useRouter();  // Use the Next.js useRouter hook for navigation

  const handleSelectExercise = (exerciseName: string) => {
    setSelectedExercise(exerciseName);
    setWorkoutData({ duration: 0, intensity: 5, caloriesBurnt: 0, heartRate: 0 });  // Reset workout data on new exercise selection
  };

  const handleWorkoutDataChange = (field: string, value: number) => {
    setWorkoutData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleAddWorkout = async () => {
    if (!selectedExercise || workoutData.duration <= 0 || workoutData.intensity <= 0 || workoutData.caloriesBurnt <= 0) {
      alert("Please select an exercise and enter valid workout data.");
      return;
    }

    try {
      const workout = {
        type: selectedExercise,  // Pass the selected exercise type
        duration: workoutData.duration,
        intensity: workoutData.intensity,
        calories_burnt: workoutData.caloriesBurnt,
        heart_rate: workoutData.heartRate || null,
      };
      await addAerobicWorkout(workout);  // API call to save the workout
      alert(`Added workout with ${selectedExercise}!`);
    } catch (error) {
      console.error("Error adding aerobic workout:", error);
      alert("Error adding workout. Please try again.");
    }
  };

  const handleGoHome = () => {
    router.push('/menu');  // Navigate to the home page
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <h2 className="text-lg font-bold">Aerobic Exercises</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              {/* Home Button */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={handleGoHome}>
                  <button className="w-full text-left hover:bg-gray-100 p-2 rounded">
                    Home
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarGroupLabel>Available Exercises</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {aerobicExercises.map((exercise) => (
                    <SidebarMenuItem key={exercise.name}>
                      <SidebarMenuButton
                        asChild
                        onClick={() => handleSelectExercise(exercise.name)}
                      >
                        <button className="w-full text-left hover:bg-gray-100 p-2 rounded">
                          <span>{exercise.name}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <p className="text-sm">Select an exercise to start your aerobic workout.</p>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-4 space-y-4">
          <h2 className="text-xl font-bold mb-4">Choose an Aerobic Exercise</h2>
          
          {/* Selected Exercise Details */}
          {selectedExercise && (
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>{selectedExercise}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {aerobicExercises.find((e) => e.name === selectedExercise)?.description}
                </CardDescription>

                {/* Input Fields for Duration, Intensity, Calories Burnt, Heart Rate */}
                <div className="space-y-2 mt-4">
                  <div>
                    <label className="text-sm font-semibold">Duration (minutes)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={workoutData.duration}
                      onChange={(e) => handleWorkoutDataChange("duration", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Intensity (1-10)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      min={1}
                      max={10}
                      value={workoutData.intensity}
                      onChange={(e) => handleWorkoutDataChange("intensity", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Calories Burnt</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={workoutData.caloriesBurnt}
                      onChange={(e) => handleWorkoutDataChange("caloriesBurnt", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Heart Rate (Optional)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={workoutData.heartRate}
                      onChange={(e) => handleWorkoutDataChange("heartRate", parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Start Workout Button */}
          <Button onClick={handleAddWorkout} className="w-full mt-4">
            Add Workout
          </Button>
        </div>
      </div>
    </SidebarProvider>
  );
}

