'use client';

import './globals.css';
// import RecommendationAgent from '@/components/RecommendationAgent';
import Header from '@/components/Header';
import { usePathname, useRouter } from 'next/navigation';

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
            </body>
        </html>
    );
}
