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


'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('https://your-backend.herokuapp.com/check-auth', {
                    method: 'GET',
                    credentials: 'include' // Ensure cookies are sent
                });

                if (response.ok) {
                    // User is authenticated, redirect to menu or dashboard
                    router.push('/menu');
                } else {
                    // User is not authenticated, redirect to /auth
                    router.push('/auth');
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                router.push('/auth'); // Redirect to /auth on error
            }
        };

        checkAuth();
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-semibold">Checking authentication...</h1>
        </div>
    );
}

