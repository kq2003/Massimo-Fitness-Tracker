// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { saveWorkoutPlan, generateWorkoutPlan, fetchWorkoutPlan, removeWorkoutPlan } from "@/services/api"; // Updated import
// import AuthenticatedPage from "@/components/AuthenticatedPage";

// type CoreLifts = {
//     bench: number;
//     pullUps: number;
//     deadlift: number;
//     squat: number;
//     shoulderPress: number;
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

// // Define the type of the response from generateWorkoutPlan API
// type GenerateWorkoutPlanResponse = {
//     data: {
//         plan: {
//             day: string;
//             workouts: {
//                 exercise_name: string;
//                 sets: number;
//                 reps: number;
//                 weight: string | number; // "Body Weight" is a string, else it's a number
//                 rest_time: number;
//                 effort_level: number;
//             }[];
//         }[];
//     };
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
//     const [loading, setLoading] = useState<boolean>(true); // Added loading state
//     const [removing, setRemoving] = useState<boolean>(false);

//     useEffect(() => {
//         const loadWorkoutPlan = async () => {
//             try {
//                 const data = await fetchWorkoutPlan();
//                 if (data.plan && data.plan.length > 0) {
//                     setWorkoutPlan(data.plan);
//                 }
//             } catch (error) {
//                 console.error("Error loading workout plan:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadWorkoutPlan();
//     }, []);


//     const handleGeneratePlan = async () => {
//         setGenerating(true);

//         try {
//             const gptResponse: GenerateWorkoutPlanResponse = await generateWorkoutPlan({
//                 bench: coreLifts.bench,
//                 pullUps: coreLifts.pullUps,
//                 deadlift: coreLifts.deadlift,
//                 squat: coreLifts.squat,
//                 shoulderPress: coreLifts.shoulderPress,
//             });

//             // Properly map the response
//             const processedPlan: WorkoutDay[] = gptResponse.data.plan.map((day) => ({
//                 day: day.day,
//                 workouts: day.workouts.map((workout) => ({
//                     ...workout,
//                     weight: typeof workout.weight === "string" ? 0.0 : workout.weight, // Ensure weight is a number
//                 })),
//             }));

//             setWorkoutPlan(processedPlan);
//             console.log(processedPlan);
//         } catch (error) {
//             console.error("Error generating workout plan:", error);
//             alert("Failed to generate a workout plan. Please try again.");
//         } finally {
//             setGenerating(false);
//         }
//     };

//     const handleRemovePlan = async () => {
//         if (!confirm("Are you sure you want to delete your workout plan?")) {
//             return;
//         }

//         setRemoving(true);
//         try {
//             await removeWorkoutPlan();
//             setWorkoutPlan([]); // Clear the state after removal
//             alert("Workout plan removed successfully!");
//         } catch (error) {
//             console.error("Error removing workout plan:", error);
//             alert("Failed to remove workout plan. Please try again.");
//         } finally {
//             setRemoving(false);
//         }
//     };

//     const handleSavePlan = async () => {
//         try {
//             await saveWorkoutPlan(workoutPlan);
//             alert("Workout plan saved successfully!");
//         } catch (error) {
//             console.error("Error saving workout plan:", error);
//             alert("Failed to save workout plan. Please try again.");
//         }
//     };

//     if (loading) {
//         return <p className="text-center mt-20">Loading your workout plan...</p>;
//     }

//     return (
//         <AuthenticatedPage>
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


//                     <Button
//                             onClick={handleRemovePlan}
//                             className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
//                             disabled={removing}
//                         >
//                             {removing ? "Removing..." : "Remove Workout Plan"}
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
//                                         <p>Weight: {workout.weight.toFixed(1)} kg</p>
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
//             </div>
//             </AuthenticatedPage>
//         );
//     }


"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { saveWorkoutPlan, generateWorkoutPlan, fetchWorkoutPlan, removeWorkoutPlan } from "@/services/api";
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

type GenerateWorkoutPlanResponse = {
    data: {
        plan: WorkoutDay[];
    };
};

export default function WorkoutPlanningPage() {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>([]);
    const [generating, setGenerating] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // State to handle loading during page load
    const [removing, setRemoving] = useState<boolean>(false);

    const liftQuestions = [
        { key: "bench", label: "What is your current 1RM for Bench Press (kg)?" },
        { key: "deadlift", label: "What is your current 1RM for Deadlift (kg)?" },
        { key: "squat", label: "What is your current 1RM for Back Squat (kg)?" },
        { key: "pullUps", label: "What is your maximum Pull-Up reps or weight added (kg)?" },
        { key: "shoulderPress", label: "What is your current 1RM for Shoulder Press (kg)?" },
    ];

    const form = useForm<CoreLifts>({
        defaultValues: {
            bench: 0,
            pullUps: 0,
            deadlift: 0,
            squat: 0,
            shoulderPress: 0,
        },
        mode: "onChange",
    });

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

    const handleNextStep = async () => {
        if (currentStep < liftQuestions.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            setGenerating(true);
            try {
                const coreLifts = form.getValues();
                const gptResponse: GenerateWorkoutPlanResponse = await generateWorkoutPlan(coreLifts);

                const processedPlan: WorkoutDay[] = gptResponse.data.plan.map((day) => ({
                    day: day.day,
                    workouts: day.workouts.map((workout) => ({
                        ...workout,
                        weight: typeof workout.weight === "string" ? 0.0 : workout.weight,
                    })),
                }));

                setWorkoutPlan(processedPlan);
                setCurrentStep(20);
            } catch (error) {
                console.error("Error generating workout plan:", error);
                alert("Failed to generate workout plan.");
            } finally {
                setGenerating(false);
            }
        }
    };

    const handleSavePlan = async () => {
        setSaving(true);
        try {
            await saveWorkoutPlan(workoutPlan);
            alert("Workout plan saved successfully!");
        } catch (error) {
            console.error("Error saving workout plan:", error);
            alert("Failed to save workout plan. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleRemovePlan = async () => {
        if (!confirm("Are you sure you want to delete your workout plan?")) return;

        setRemoving(true);
        try {
            await removeWorkoutPlan();
            setWorkoutPlan([]);
            setCurrentStep(0); // Reset to core lifts input
            alert("Workout plan removed successfully!");
        } catch (error) {
            console.error("Error removing workout plan:", error);
            alert("Failed to remove workout plan. Please try again.");
        } finally {
            setRemoving(false);
        }
    };

    if (loading) {
        return <p className="text-center mt-20 text-xl font-bold">Loading your workout plan...</p>;
    }

    if (generating) {
        return <p className="text-center mt-20 text-xl font-bold">Generating workout...</p>;
    }

    return (
        <AuthenticatedPage>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                {workoutPlan.length === 0 && currentStep < liftQuestions.length ? (
                    <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
                        <Form {...form}>
                            <FormField
                                name={liftQuestions[currentStep].key as keyof CoreLifts}
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{liftQuestions[currentStep].label}</FormLabel>
                                        <FormControl>
                                            <input
                                                {...field}
                                                type="number"
                                                className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                onClick={handleNextStep}
                                className="w-full"
                                disabled={!form.formState.isValid}
                            >
                                {currentStep < liftQuestions.length - 1 ? "Next" : "Generate Plan"}
                            </Button>
                        </Form>
                    </div>
                ) : (
                    <main className="flex-1 p-6">
                        <h1 className="text-3xl font-bold mb-6">Your Workout Plan</h1>
                        {workoutPlan.length > 0 ? (
                            <div>
                                {workoutPlan.map((day) => (
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
                                ))}
                                <div className="flex gap-4 mt-4">
                                    <Button onClick={handleSavePlan} disabled={saving}>
                                        {saving ? "Saving..." : "Save Workout Plan"}
                                    </Button>
                                    <Button
                                        onClick={handleRemovePlan}
                                        disabled={removing}
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        {removing ? "Removing..." : "Remove Workout Plan"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600">No plan generated yet.</p>
                        )}
                    </main>
                )}
            </div>
        </AuthenticatedPage>
    );
}







