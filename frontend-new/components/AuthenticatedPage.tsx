'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUsername } from '@/services/api';

export default function AuthenticatedPage({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await fetchUsername(); // Hits /get_username
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Not authenticated, redirecting to /auth');
                router.push('/auth'); // Redirect to login
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1>Loading...</h1>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : null;
}
