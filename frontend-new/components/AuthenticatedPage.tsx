'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth } from '@/services/api';

export default function AuthenticatedPage({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const authRes = await checkAuth(); // Hits /auth_check
                if (authRes.authenticated) {
                    setIsAuthenticated(true);
                } else {
                    throw new Error('Not authenticated');
                }
            } catch (error) {
                console.error('Not authenticated, redirecting to /auth');
                router.push('/auth'); // Redirect to login
            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();
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

