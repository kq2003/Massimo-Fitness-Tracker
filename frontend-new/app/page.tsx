'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/auth'); // Redirect to /auth
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-semibold">Redirecting to Login...</h1>
        </div>
    );
}
