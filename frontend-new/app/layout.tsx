// layout.tsx
'use client';

import './globals.css';
import RecommendationAgent from '@/components/RecommendationAgent';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Define paths that shouldn't show the header and recommendation agent
    const authPaths = ['/auth', '/login', '/signup']; 

    const isAuthPage = authPaths.includes(pathname);

    return (
        <html lang="en">
            <body className="bg-gray-100 min-h-screen flex flex-col">
                {/* Show header only if it's not an auth page */}
                {!isAuthPage && <Header/>}

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>

                {/* Show recommendation agent only if it's not an auth page */}
                {!isAuthPage && <RecommendationAgent/>}
            </body>
        </html>
    );
}



