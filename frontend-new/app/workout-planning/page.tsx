// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { generateWorkoutPlan, saveWorkoutPlan, fetchWorkoutPlan } from "@/services/api"; // GPT-4 API call

// type CoreLifts = {
//     bench: number; // Bench Press weight
//     pullUps: number; // Weighted pull-up or bodyweight reps
//     deadlift: number; // Deadlift weight
//     squat: number; // Back Squat weight
//     shoulderPress: number; // Shoulder Press weight
// };

// type Workout = {
//     exercise_name: string;
//     sets: number;
//     reps: number;
//     weight: number;
//     rest_time: number;
//     effort_level: number;
// };

// type WorkoutDay = {
//     day: string;
//     workouts: Workout[];
// };

// export default function WorkoutPlanningPage() {
//     const [coreLifts, setCoreLifts] = useState<CoreLifts>({
//         bench: 0,
//         pullUps: 0,
//         deadlift: 0,
//         squat: 0,
//         shoulderPress: 0,
//     });

//     const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>([]);
//     const [generating, setGenerating] = useState<boolean>(false);

//     const handleGeneratePlan = async () => {
//         setGenerating(true);

//         try {
//             const gptResponse = await generateWorkoutPlan({
//                 bench: coreLifts.bench,
//                 pullUps: coreLifts.pullUps,
//                 deadlift: coreLifts.deadlift,
//                 squat: coreLifts.squat,
//                 shoulderPress: coreLifts.shoulderPress,
//             });

//             // const generatedPlan = JSON.parse(gptResponse.data); // Assuming GPT-4 API returns structured JSON
//             // setWorkoutPlan(generatedPlan);
//             setWorkoutPlan(gptResponse.data.plan);
//             console.log(gptResponse.data)
//         } catch (error) {
//             console.error("Error generating workout plan:", error);
//             alert("Failed to generate a workout plan. Please try again.");
//         } finally {
//             setGenerating(false);
//         }
//     };
    
    

//     const handleSavePlan = async () => {
//         try {
            
//             await saveWorkoutPlan(workoutPlan);
//             alert("Workout plan saved successfully!");
//         } catch (error) {
//             console.error("Error saving workout plan:", error);
//         }
//     };

//     return (
//         <div className="flex min-h-screen bg-gray-100">
//             {/* Sidebar for Core Lifts */}
//             <aside className="w-64 bg-white p-4 border-r border-gray-200">
//                 <h2 className="text-xl font-semibold mb-4">Enter Core Lifts</h2>

//                 <div className="space-y-4">
//                     <div>
//                         <label className="block text-gray-700">Bench Press (kg)</label>
//                         <Input
//                             type="number"
//                             value={coreLifts.bench}
//                             onChange={(e) =>
//                                 setCoreLifts({ ...coreLifts, bench: parseFloat(e.target.value) })
//                             }
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-gray-700">Pull-Ups (Reps or Weighted kg)</label>
//                         <Input
//                             type="number"
//                             value={coreLifts.pullUps}
//                             onChange={(e) =>
//                                 setCoreLifts({ ...coreLifts, pullUps: parseFloat(e.target.value) })
//                             }
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-gray-700">Deadlift (kg)</label>
//                         <Input
//                             type="number"
//                             value={coreLifts.deadlift}
//                             onChange={(e) =>
//                                 setCoreLifts({ ...coreLifts, deadlift: parseFloat(e.target.value) })
//                             }
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-gray-700">Back Squat (kg)</label>
//                         <Input
//                             type="number"
//                             value={coreLifts.squat}
//                             onChange={(e) =>
//                                 setCoreLifts({ ...coreLifts, squat: parseFloat(e.target.value) })
//                             }
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-gray-700">Shoulder Press (kg)</label>
//                         <Input
//                             type="number"
//                             value={coreLifts.shoulderPress}
//                             onChange={(e) =>
//                                 setCoreLifts({ ...coreLifts, shoulderPress: parseFloat(e.target.value) })
//                             }
//                         />
//                     </div>

//                     <Button
//                         onClick={handleGeneratePlan}
//                         className="w-full mt-4"
//                         disabled={generating || Object.values(coreLifts).some((value) => value <= 0)}
//                     >
//                         {generating ? "Generating..." : "Generate Plan"}
//                     </Button>
//                 </div>
//             </aside>

//             {/* Main Content */}
//             <main className="flex-1 p-6">
//                 <h1 className="text-3xl font-bold mb-6">Your Workout Plan</h1>
//                 {workoutPlan.length > 0 ? (
//                     workoutPlan.map((day) => (
//                         <div key={day.day} className="mb-6">
//                             <h2 className="text-xl font-semibold mb-4">Day {day.day}</h2>
//                             {day.workouts.map((workout, idx) => (
//                                 <Card key={idx} className="mb-4">
//                                     <CardHeader>
//                                         <CardTitle>{workout.exercise_name}</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <p>Sets: {workout.sets}</p>
//                                         <p>Reps: {workout.reps}</p>
//                                         <p>Weight: {typeof workout.weight === 'number' ? workout.weight.toFixed(1) : workout.weight} kg</p>
//                                         <p>Rest Time: {workout.rest_time} sec</p>
//                                         <p>Effort Level: {workout.effort_level}</p>
//                                     </CardContent>
//                                 </Card>
//                             ))}
//                         </div>
//                     ))
//                 ) : (
//                     <p className="text-gray-600">No plan generated yet. Enter your lifts and generate a plan.</p>
//                 )}

//                 {workoutPlan.length > 0 && (
//                     <Button onClick={handleSavePlan} className="mt-4">
//                         Save Workout Plan
//                     </Button>
//                 )}
//             </main>
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { saveWorkoutPlan, generateWorkoutPlan, fetchWorkoutPlan } from "@/services/api"; // Updated import
import AuthenticatedPage from "@/components/AuthenticatedPage";

type CoreLifts = {
    bench: number;
    pullUps: number;
    deadlift: number;
    squat: number;
    shoulderPress: number;
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

// Define the type of the response from generateWorkoutPlan API
type GenerateWorkoutPlanResponse = {
    data: {
        plan: {
            day: string;
            workouts: {
                exercise_name: string;
                sets: number;
                reps: number;
                weight: string | number; // "Body Weight" is a string, else it's a number
                rest_time: number;
                effort_level: number;
            }[];
        }[];
    };
};
  

export default function WorkoutPlanningPage() {
    const [coreLifts, setCoreLifts] = useState<CoreLifts>({
        bench: 0,
        pullUps: 0,
        deadlift: 0,
        squat: 0,
        shoulderPress: 0,
    });

    const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>([]);
    const [generating, setGenerating] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // Added loading state

    useEffect(() => {
        const loadWorkoutPlan = async () => {
            try {
                const data = await fetchWorkoutPlan();
                if (data.plan && data.plan.length > 0) {
                    setWorkoutPlan(data.plan);
                }
            } catch (error) {
                console.error("Error loading workout plan:", error);
            } finally {
                setLoading(false);
            }
        };

        loadWorkoutPlan();
    }, []);

    // const handleGeneratePlan = async () => {
    //     setGenerating(true);

    //     try {
    //         const gptResponse = await generateWorkoutPlan({
    //             bench: coreLifts.bench,
    //             pullUps: coreLifts.pullUps,
    //             deadlift: coreLifts.deadlift,
    //             squat: coreLifts.squat,
    //             shoulderPress: coreLifts.shoulderPress,
    //         });

    //         const processedPlan: WorkoutDay[] = gptResponse.data.plan.map((day: any) => ({
    //             day: day.day,
    //             workouts: day.workouts.map((workout: any) => ({
    //                 ...workout,
    //                 weight: workout.weight === "Body Weight" ? 0.0 : workout.weight,
    //             })),
    //         }));

    //         setWorkoutPlan(processedPlan);
    //         console.log(processedPlan);
    //     } catch (error) {
    //         console.error("Error generating workout plan:", error);
    //         alert("Failed to generate a workout plan. Please try again.");
    //     } finally {
    //         setGenerating(false);
    //     }
    // };
    const handleGeneratePlan = async () => {
        setGenerating(true);

        try {
            const gptResponse: GenerateWorkoutPlanResponse = await generateWorkoutPlan({
                bench: coreLifts.bench,
                pullUps: coreLifts.pullUps,
                deadlift: coreLifts.deadlift,
                squat: coreLifts.squat,
                shoulderPress: coreLifts.shoulderPress,
            });

            // Properly map the response
            const processedPlan: WorkoutDay[] = gptResponse.data.plan.map((day) => ({
                day: day.day,
                workouts: day.workouts.map((workout) => ({
                    ...workout,
                    weight: typeof workout.weight === "string" ? 0.0 : workout.weight, // Ensure weight is a number
                })),
            }));

            setWorkoutPlan(processedPlan);
            console.log(processedPlan);
        } catch (error) {
            console.error("Error generating workout plan:", error);
            alert("Failed to generate a workout plan. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const handleSavePlan = async () => {
        try {
            await saveWorkoutPlan(workoutPlan);
            alert("Workout plan saved successfully!");
        } catch (error) {
            console.error("Error saving workout plan:", error);
            alert("Failed to save workout plan. Please try again.");
        }
    };

    if (loading) {
        return <p className="text-center mt-20">Loading your workout plan...</p>;
    }

    return (
        <AuthenticatedPage>
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar for Core Lifts */}
            <aside className="w-64 bg-white p-4 border-r border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Enter Core Lifts</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Bench Press (kg)</label>
                        <Input
                            type="number"
                            value={coreLifts.bench}
                            onChange={(e) =>
                                setCoreLifts({ ...coreLifts, bench: parseFloat(e.target.value) })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Pull-Ups (Reps or Weighted kg)</label>
                        <Input
                            type="number"
                            value={coreLifts.pullUps}
                            onChange={(e) =>
                                setCoreLifts({ ...coreLifts, pullUps: parseFloat(e.target.value) })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Deadlift (kg)</label>
                        <Input
                            type="number"
                            value={coreLifts.deadlift}
                            onChange={(e) =>
                                setCoreLifts({ ...coreLifts, deadlift: parseFloat(e.target.value) })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Back Squat (kg)</label>
                        <Input
                            type="number"
                            value={coreLifts.squat}
                            onChange={(e) =>
                                setCoreLifts({ ...coreLifts, squat: parseFloat(e.target.value) })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Shoulder Press (kg)</label>
                        <Input
                            type="number"
                            value={coreLifts.shoulderPress}
                            onChange={(e) =>
                                setCoreLifts({ ...coreLifts, shoulderPress: parseFloat(e.target.value) })
                            }
                        />
                    </div>

                    <Button
                        onClick={handleGeneratePlan}
                        className="w-full mt-4"
                        disabled={generating || Object.values(coreLifts).some((value) => value <= 0)}
                    >
                        {generating ? "Generating..." : "Generate Plan"}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-6">Your Workout Plan</h1>
                {workoutPlan.length > 0 ? (
                    workoutPlan.map((day) => (
                        <div key={day.day} className="mb-6">
                            <h2 className="text-xl font-semibold mb-4">Day {day.day}</h2>
                            {day.workouts.map((workout, idx) => (
                                <Card key={idx} className="mb-4">
                                    <CardHeader>
                                        <CardTitle>{workout.exercise_name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Sets: {workout.sets}</p>
                                        <p>Reps: {workout.reps}</p>
                                        <p>Weight: {workout.weight.toFixed(1)} kg</p>
                                        <p>Rest Time: {workout.rest_time} sec</p>
                                        <p>Effort Level: {workout.effort_level}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No plan generated yet. Enter your lifts and generate a plan.</p>
                )}

                {workoutPlan.length > 0 && (
                    <Button onClick={handleSavePlan} className="mt-4">
                        Save Workout Plan
                    </Button>
                )}
            </main>
            </div>
            </AuthenticatedPage>
        );
    }
