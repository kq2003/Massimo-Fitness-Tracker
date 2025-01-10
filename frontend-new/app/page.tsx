// 'use client';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// export default function HomePage() {
//     const router = useRouter();

//     useEffect(() => {
//         router.push('/auth'); // Redirect to /auth
//     }, [router]);

//     return (
//         <div className="flex items-center justify-center h-screen">
//             <h1 className="text-2xl font-semibold">Redirecting to Login...</h1>
//         </div>
//     );
// }

"use client";

// import RecommendationAgent from '@/components/RecommendationAgent';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { fetchCurrentDay } from "@/services/api";
import AuthenticatedPage from '@/components/AuthenticatedPage';

export default function MenuPage() {
    const router = useRouter();
    const [currentDay, setCurrentDay] = useState<string>("");
    const [workoutsExist, setWorkoutsExist] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const dayRes = await fetchCurrentDay();
                const day = dayRes.data.current_day;
                if (day) {
                    setCurrentDay(day.toLowerCase());
                    setWorkoutsExist(true);
                } else {
                    setWorkoutsExist(false);
                }
            } catch (err) {
                console.error("Error fetching workout data", err);
                setWorkoutsExist(false);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <AuthenticatedPage>
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col relative">
            {/* Main Content */}
            <main className="flex-1 flex items-center justify-between">
                <div className="flex flex-col items-start text-left max-w-lg">
                    <h1 className="text-5xl font-extrabold mb-6 text-gray-800">
                        Start your journey with us.
                    </h1>
                    <p className="text-gray-600 text-lg mb-8">
                        {loading
                            ? "Loading your workout data..."
                            : workoutsExist
                            ? `You are on ${currentDay} day of your workout plan!`
                            : "Start by planning your workouts guided by AI assistant and pro expertise. You can change workout details anytime."
                        }
                    </p>
                    {workoutsExist ? (
                        <>
                            {/* <p className="text-gray-600 mb-4">
                                Click "Add Workout" above to start your workout, or "View and Edit Workout" to adjust your current plan.
                            </p> */}
                            <p className="text-gray-600 mb-4">
                                Click &quot;Add Workout&quot; above to start your workout, or &quot;View and Edit Workout&quot; to adjust your current plan.
                            </p>

                            <Button
                                variant="default"
                                className="mt-4 w-48"
                                onClick={() => router.push('/workout-planning')}
                            >
                                View and Edit Workout
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="default"
                            className="mt-4 w-48"
                            onClick={() => router.push('/workout-planning')}
                        >
                            Start Workout Planning
                        </Button>
                    )}
                </div>
                <div className="flex-shrink-0">
                    <img
                        src="/menu_image.jpg"
                        alt="Menu"
                        className="h-96 w-auto object-cover rounded-lg shadow-lg opacity-75 mix-blend-multiply"
                    />
                </div>
            </main>
        </div>
        </AuthenticatedPage>
    );
}
