// 'use client';

// import './globals.css';
// import RecommendationAgent from '@/components/RecommendationAgent';
// import Header from '@/components/Header';
// import { usePathname } from 'next/navigation';
// import { useState, useEffect } from 'react';

// interface HeaderProps {

//     username: string;

//     avatar: string | null;

// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//     const pathname = usePathname();

//     // Define paths where header and recommendation agent shouldn't appear
//     const authPaths = ['/auth', '/login', '/signup'];
//     const isAuthPage = authPaths.includes(pathname);

//     const noHeaderPaths = ['/auth', '/login', '/signup', '/user-info']
//     const noHeader = noHeaderPaths.includes(pathname)

//     // Mocking user data fetch (replace with real API call)
//     const [user, setUser] = useState<{ username: string; avatar: string | null }>({
//         username: '',
//         avatar: null,
//     });

//     useEffect(() => {
//         // Simulate fetching user info from backend
//         async function fetchUser() {
//             const response = await fetch('/api/user-info', { credentials: 'include' });
//             const data = await response.json();
//             setUser({ username: data.username, avatar: data.avatar });
//         }
//         fetchUser();
//     }, []);

//     return (
//         <html lang="en">
//             <body className="bg-gray-100 min-h-screen flex flex-col">
//                 {/* Header (conditionally rendered) */}
//                 {!noHeader && <Header username={user.username} avatar={user.avatar} />}

//                 {/* Main Content */}
//                 <main className="flex-1 p-6">{children}</main>

//                 {/* Recommendation Agent (conditionally rendered) */}
//                 {!isAuthPage && (
//                     <RecommendationAgent initialMessage="Hi! How can I help you today?" />
//                 )}
//             </body>
//         </html>
//     );
// }




'use client';

import './globals.css';
// import RecommendationAgent from '@/components/RecommendationAgent';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Define paths where header and recommendation agent shouldn't appear
    const noHeaderPaths = ['/auth', '/login', '/signup', '/user-info', '/add-workout/strength', '/add-workout/aerobic', '/settings', '/avatar-upload'];
    // const noRecommendationPaths = ['/auth', '/login', '/signup'];

    const showHeader = !noHeaderPaths.includes(pathname);
    // const showRecommendationAgent = !noRecommendationPaths.includes(pathname);

    return (
        <html lang="en">
            <body className="bg-gray-100 min-h-screen flex flex-col">
                {/* Conditionally render Header */}
                {showHeader && <Header />}

                {/* Main Content */}
                <main className="flex-1 p-6">{children}</main>

                {/* Conditionally render Recommendation Agent
                {showRecommendationAgent && (
                    <RecommendationAgent initialMessage="Hi! How can I help you today?" />
                )} */}
            </body>
        </html>
    );
}
