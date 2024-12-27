// 'use client';

// import RecommendationAgent from '@/components/RecommendationAgent';
// import { useRouter } from 'next/navigation';
// import { logoutUser } from '@/services/api';
// import { Button } from '@/components/ui/button';
// import axios from 'axios';

// export default function MenuPage() {
//     const router = useRouter();

//     // Handle Logout
//     const handleLogout = async () => {
//         try {
//             console.log('Attempting to log out...');
//             const response = await logoutUser(); // Call logout API
//             console.log('Logout Response:', response.data); // Log successful response
//             alert('Logged out successfully!');
//             router.push('/auth'); // Redirect to login page
//         } catch (error) {
//             console.error('Logout Error:', error); // Log detailed error
//             if (axios.isAxiosError(error)) {
//                 console.error('Axios Error Response:', error.response?.data); // Log backend error response
//                 alert(error.response?.data?.message || 'Failed to log out. Please try again.');
//             } else {
//                 alert('An unknown error occurred during logout.');
//             }
//         }
//     };

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen flex flex-col relative">
//             {/* Main Content */}
//             <main className="flex-1 flex flex-col items-center justify-center text-center">
//                 <h1 className="text-4xl font-bold mb-6 text-gray-800">Start your journey with us.</h1>
//                 <p className="text-gray-600 text-lg mb-8">
//                     Start by planning your workouts guided by AI assistant and pro expertise. You can change workout details anytime.
//                 </p>

//                 {/* Logout Button
//                 <Button
//                     variant="destructive"
//                     className="mt-8 w-48"
//                     onClick={handleLogout}
//                 >
//                     Logout
//                 </Button> */}
//             </main>

//             {/* Draggable Recommendation Agent */}
//             <RecommendationAgent
//                 initialMessage="Hi! How can I help you with your workout today?"
//             />
//         </div>
//     );
// }

"use client";

import RecommendationAgent from '@/components/RecommendationAgent';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function MenuPage() {
    const router = useRouter();

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col relative">
            {/* Main Content */}
            <main className="flex-1 flex items-center justify-between">
                <div className="flex flex-col items-start text-left max-w-lg">
                    <h1 className="text-5xl font-extrabold mb-6 text-gray-800">Start your journey with us.</h1>
                    <p className="text-gray-600 text-lg mb-8">
                        Start by planning your workouts guided by AI assistant and pro expertise. You can change workout details anytime.
                    </p>
                    <Button
                        variant="default"
                        className="mt-4 w-48"
                        onClick={() => router.push('/workout-planning')}
                    >
                        Start Workout
                    </Button>
                </div>
                <div className="flex-shrink-0">
                    <img
                        src="/menu_image.jpg"
                        alt="Menu"
                        className="h-96 w-auto object-cover rounded-lg shadow-lg opacity-75 mix-blend-multiply"
                    />
                </div>
            </main>

            {/* Draggable Recommendation Agent */}
            <RecommendationAgent
                initialMessage="Hi! How can I help you with your workout today?"
            />
        </div>
    );
}
