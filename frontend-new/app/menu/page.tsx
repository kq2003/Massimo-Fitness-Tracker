// 'use client';

// import RecommendationAgent from '@/components/RecommendationAgent';
// import { useRouter } from 'next/navigation';
// import { logoutUser } from '@/services/api';

// export default function MenuPage() {

//     const handleLogout = async () => {
//         try {
//             await logoutUser(); // Logout API call
//             router.push('/auth'); // Redirect to login page
//         } catch (error) {
//             alert('Failed to log out. Please try again.');
//         }
//     };

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen flex flex-col relative">
//             {/* Main Content */}
//             <main className="flex-1 flex flex-col items-center justify-center text-center">
//                 <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Massimo!</h1>
//                 <p className="text-gray-600 text-lg">
//                     Muscle visualization and daily recommendations coming soon!
//                 </p>
//             </main>

//             {/* Draggable Recommendation Agent */}
//             <RecommendationAgent
//                 initialMessage="Hi! How can I help you with your workout today?"
//             />
//         </div>
//     );
// }

'use client';

import RecommendationAgent from '@/components/RecommendationAgent';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/services/api';
import { Button } from '@/components/ui/button';

export default function MenuPage() {
    const router = useRouter();

    // Handle Logout
    const handleLogout = async () => {
        try {
            await logoutUser(); // Call logout API
            router.push('/auth'); // Redirect to login page
        } catch (error) {
            alert('Failed to log out. Please try again.');
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col relative">
            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to Massimo!</h1>
                <p className="text-gray-600 text-lg mb-8">
                    Explore your workout journey with smart tracking and personalized guidance.
                </p>

                {/* Logout Button */}
                <Button
                    variant="destructive"
                    className="mt-8 w-48"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </main>

            {/* Draggable Recommendation Agent */}
            <RecommendationAgent
                initialMessage="Hi! How can I help you with your workout today?"
            />
        </div>
    );
}



