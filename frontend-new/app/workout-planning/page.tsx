"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { saveWorkoutPlan, generateWorkoutPlan, fetchWorkoutPlan, removeWorkoutPlan } from "@/services/api";
import AuthenticatedPage from "@/components/AuthenticatedPage";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    rectIntersection
  } from '@dnd-kit/core';
  import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
  } from '@dnd-kit/sortable';
  import { GripVertical } from "lucide-react";

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

const EditableWorkoutCard = ({ 
    workout, 
    onSave, 
    dayIndex, 
    workoutIndex 
}: {
    workout: Workout;
    onSave: (workout: Workout, dayIndex: number, workoutIndex: number) => void;
    dayIndex: number;
    workoutIndex: number;
}) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const handleClick = (field: string, value: number) => {
        setEditingField(field);
        setEditValue(String(value));
    };

    const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave(field);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const handleSave = (field: string) => {
        const numValue = Number(editValue);
        if (!isNaN(numValue)) {
            const updatedWorkout = {
                ...workout,
                [field]: numValue
            };
            onSave(updatedWorkout, dayIndex, workoutIndex);
        }
        setEditingField(null);
    };

    const handleBlur = (field: string) => {
        handleSave(field);
    };

    const renderEditableField = (label: string, field: keyof Workout, value: number, suffix = '') => {
        const isEditing = editingField === field;

        return (
            <div className="flex items-center space-x-2 p-2 cursor-pointer">
                <span className="w-24 text-gray-600">{label}:</span>
                {isEditing ? (
                    <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => {
                            setEditValue(e.target.value);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, field)}
                        onBlur={() => handleBlur(field)}
                        className="w-20 px-2 py-1"
                        autoFocus
                    />
                ) : (
                    <div 
                        onClick={() => handleClick(field, value)}
                        className="hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                    >
                        {value.toFixed(1)}{suffix}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>{workout.exercise_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {renderEditableField('Sets', 'sets', workout.sets)}
                {renderEditableField('Reps', 'reps', workout.reps)}
                {renderEditableField('Weight', 'weight', workout.weight, ' kg')}
                {renderEditableField('Rest Time', 'rest_time', workout.rest_time, ' sec')}
                {renderEditableField('Effort Level', 'effort_level', workout.effort_level)}
            </CardContent>
        </Card>
    );
};

export default function WorkoutPlanningPage() {
    const router = useRouter();
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>([]);
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

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
                    const dayOrder = ["pull", "push", "leg"];
                
                    const sortedPlan = [...data.plan].sort((a, b) => {
                        return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
                    });


                    setWorkoutPlan(sortedPlan);
                } else {
                }
            } catch (error) {
                console.error("Error in loadWorkoutPlan:", error); 
            } finally {
                setLoading(false);
            }
        };
    
        loadWorkoutPlan();
    }, []);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenerating(true);
    
        try {
            const coreLifts = form.getValues();

            const response: { data: { plan: WorkoutDay[] } } = await generateWorkoutPlan(coreLifts);
    
            const processedPlan = response.data.plan.map((day: WorkoutDay) => ({
                day: day.day,
                workouts: day.workouts.map((workout) => ({
                    ...workout,
                    weight: typeof workout.weight === "string" ? 0.0 : workout.weight,
                })),
            }));
    
            setWorkoutPlan(processedPlan);
        } catch (error) {
            console.error("Error generating workout plan:", error);
            alert("Failed to generate workout plan.");
        } finally {
            setGenerating(false);
        }
    };
    

    const handleWorkoutSave = (editedWorkout: Workout, dayIndex: number, workoutIndex: number) => {
        setWorkoutPlan(prevPlan => {
            const newPlan = [...prevPlan];
            newPlan[dayIndex] = {
                ...newPlan[dayIndex],
                workouts: newPlan[dayIndex].workouts.map((workout, idx) => 
                    idx === workoutIndex ? editedWorkout : workout
                )
            };
            return newPlan;
        });
    };

    const handleSavePlan = async () => {
        setSaving(true);
        try {
            await saveWorkoutPlan(workoutPlan);
            alert("Workout plan saved successfully!");
            router.push('/');
        } catch (error) {
            console.error("Error saving workout plan:", error);
            alert("Failed to save workout plan. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const startWorkout = async () => {
        setSaving(true);
        try {
            await saveWorkoutPlan(workoutPlan);
            router.push('add-workout/strength');
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
            alert("Workout plan removed successfully!");
        } catch (error) {
            console.error("Error removing workout plan:", error);
            alert("Failed to remove workout plan. Please try again.");
        } finally {
            setRemoving(false);
        }
    };

    const [isDraggingAnyDay, setIsDraggingAnyDay] = useState(false);


    const DraggableWorkoutDay = ({ day, dayIndex, children }: {
        day: WorkoutDay;
        dayIndex: number;
        children: React.ReactNode;
    }) => {
        const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
            id: `day-${dayIndex}`,
        });
    
        useEffect(() => {
            if (isDragging) {
                setIsDraggingAnyDay(true);
            }
        }, [isDragging]);
    
        return (
            <div
                ref={setNodeRef}
                style={{
                    transform: transform ? `translateY(${transform.y}px)` : undefined,
                    transition: "all 0.3s ease-in-out",
                    background: "white",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    marginBottom: "8px",
                }}
                className="shadow-md"
            >
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab bg-gray-200 rounded-md flex items-center justify-between px-3 py-2"
                    style={{
                        height: "50px",
                    }}
                >
                    <div className="flex items-center">
                        <GripVertical className="text-gray-500 mr-2" />
                        <h2 className="text-xl font-semibold">Day {day.day}</h2>
                    </div>
                </div>
    
                <div
                    style={{
                        transition: "max-height 0.3s ease-in-out, visibility 0.3s ease-in-out",
                        maxHeight: isDraggingAnyDay ? "0px" : "2000px", 
                        visibility: isDraggingAnyDay ? "hidden" : "visible",
                        overflow: isDraggingAnyDay ? "hidden" : "visible", 
                    }}
                >
                    {children}
                </div>
            </div>
        );
    };
    
    
    
    const DraggableWorkoutCard = ({ workout, onSave, dayIndex, workoutIndex }: {
        workout: Workout;
        onSave: (workout: Workout, dayIndex: number, workoutIndex: number) => void;
        dayIndex: number;
        workoutIndex: number;
    }) => {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
            id: `workout-${dayIndex}-${workoutIndex}`,
        });
    
        return (
            <div
                ref={setNodeRef}
                style={{
                    transform: transform ? `translateY(${transform.y}px)` : undefined,
                    transition: "height 0.3s ease-in-out, transform 0.3s ease-in-out",
                    marginBottom: "8px",
                }}
                className="shadow-md flex items-center"
            >
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab p-2"
                    style={{ marginRight: "10px" }}
                >
                    <GripVertical className="text-gray-500" />
                </div>
    
                <EditableWorkoutCard
                    workout={workout}
                    onSave={onSave}
                    dayIndex={dayIndex}
                    workoutIndex={workoutIndex}
                />
            </div>
        );
    };
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeId = active.id.toString();
        const overId = over.id.toString();

        if (activeId.startsWith("day-") && overId.startsWith("day-")) {
            setWorkoutPlan((prevPlan) => {
                const oldIndex = parseInt(activeId.replace("day-", ""), 10);
                const newIndex = parseInt(overId.replace("day-", ""), 10);
                return oldIndex !== newIndex ? arrayMove([...prevPlan], oldIndex, newIndex) : prevPlan;
            });

            // Delay restoration for smooth effect
            setTimeout(() => setIsDraggingAnyDay(false), 150);
        } else if (activeId.startsWith("workout-") && overId.startsWith("workout-")) {
            const [, dayIndexStr, activeWorkoutIndexStr] = activeId.split("-");
            const [, overDayIndexStr, overWorkoutIndexStr] = overId.split("-");
            const dayIndex = parseInt(dayIndexStr, 10);
            const activeWorkoutIndex = parseInt(activeWorkoutIndexStr, 10);
            const overDayIndex = parseInt(overDayIndexStr, 10);
            const overWorkoutIndex = parseInt(overWorkoutIndexStr, 10);

            if (dayIndex !== overDayIndex) return; 

            setWorkoutPlan((prevPlan) => {
                const newPlan = [...prevPlan];
                newPlan[dayIndex] = {
                    ...newPlan[dayIndex],
                    workouts: arrayMove([...newPlan[dayIndex].workouts], activeWorkoutIndex, overWorkoutIndex),
                };
                return newPlan;
            });
        }
    };  

    
    if (loading) {
        return <p className="text-center mt-20 text-xl font-bold">Loading your workout plan...</p>;
    }

    return (
        <AuthenticatedPage>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                {workoutPlan.length === 0 ? (
                    <Card className="w-full max-w-md bg-white p-6">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Enter Your Core Lifts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    {liftQuestions.map((question) => (
                                        <FormField
                                            key={question.key}
                                            control={form.control}
                                            name={question.key as keyof CoreLifts}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium">
                                                        {question.label}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            inputMode="decimal"
                                                            {...field}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                field.onChange(value ? Number(value) : 0);
                                                            }}
                                                            value={field.value || ""}
                                                            className="w-full"
                                                            placeholder="Enter a number (e.g., 50)"
                                                            min={0} 
                                                            step={0.1} 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                    <Button
                                        type="submit"
                                        className="w-full mt-6"
                                        disabled={!form.formState.isValid || generating}
                                    >
                                        {generating ? "Generating Plan..." : "Generate Workout Plan"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                ) : (
                    <main className="flex-1 p-6">
                        <h1 className="text-3xl font-bold mb-6">Your Workout Plan</h1>
        
                        <DndContext 
                            sensors={sensors} 
                            collisionDetection={rectIntersection} 
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={workoutPlan.map((_, dayIndex) => `day-${dayIndex}`)}
                                strategy={verticalListSortingStrategy}
                            >
                                {workoutPlan.map((day, dayIndex) => (
                                    <DraggableWorkoutDay key={`day-${dayIndex}`} day={day} dayIndex={dayIndex}>
                                        <SortableContext
                                            items={day.workouts.map((_, workoutIndex) => `workout-${dayIndex}-${workoutIndex}`)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {day.workouts.map((workout, workoutIndex) => (
                                                <DraggableWorkoutCard
                                                    key={`workout-${dayIndex}-${workoutIndex}`}
                                                    workout={workout}
                                                    onSave={handleWorkoutSave}
                                                    dayIndex={dayIndex}
                                                    workoutIndex={workoutIndex}
                                                />
                                            ))}
                                        </SortableContext>
                                    </DraggableWorkoutDay>
                                ))}
                            </SortableContext>
                        </DndContext>


                        <div className="flex gap-4 mt-4">
                            <Button onClick={handleSavePlan} disabled={saving}>
                                {saving ? "Saving..." : "Save Workout Plan"}
                            </Button>
                            <Button onClick={startWorkout} disabled={saving}>
                                {saving ? "Saving..." : "Start Workout"}
                            </Button>
                            <Button
                                onClick={handleRemovePlan}
                                disabled={removing}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                {removing ? "Removing..." : "Remove Workout Plan"}
                            </Button>
                        </div>
                    </main>
                )}
            </div>
        </AuthenticatedPage>
    );
}