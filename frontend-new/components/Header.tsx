'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
} from '@/components/ui/navigation-menu';
import { fetchUsername, fetchAvatar, checkAuth } from '@/services/api'; // API call to fetch username

export default function Header() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    // // Check authentication on mount
    // useEffect(() => {
    //     const checkAuthentication = async () => {
    //         try {
    //             const authRes = await checkAuth();
    //             console.log(authRes);
    //             if (!authRes.authenticated) {
    //                 router.push('/auth'); // Redirect to the auth page if not authenticated
    //             }
    //         } catch (error) {
    //             console.error('Error checking authentication:', error);
    //             router.push('/auth'); // Redirect on error as a fallback
    //         }
    //     };

    //     checkAuthentication();
    // }, [router]);

    // useEffect(() => {
    //     const loadUserData = async () => {
    //         try {
    //             // Fetch username and avatar separately
    //             const [usernameResponse, avatarResponse] = await Promise.all([fetchUsername(), fetchAvatar()]);
    //             setUsername(usernameResponse.data.username);
    //             setAvatarUrl(avatarResponse);
    //             console.log("Avatar URL:", avatarResponse);
    //         } catch (error) {
    //             console.error('Error fetching user data:', error);
    //             setUsername(null);
    //             setAvatarUrl(null);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     loadUserData();
    // }, []);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const authRes = await checkAuth();
                if (authRes.authenticated) {
                    setAuthenticated(true);
                } else {
                    router.push('/auth');
                }
            } catch {
                router.push('/auth');
            }
        };

        checkAuthentication();
    }, [router]);

    useEffect(() => {
        if (!authenticated) return;

        const loadUserData = async () => {
            try {
                const [usernameResponse, avatarResponse] = await Promise.all([
                    fetchUsername(),
                    fetchAvatar(),
                ]);
                setUsername(usernameResponse.data.username);
                setAvatarUrl(avatarResponse);
            } catch {
                setUsername(null);
                setAvatarUrl(null);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [authenticated]);

    if (!authenticated) {
        return null; // Prevent rendering if the user is not authenticated
    }

    return (
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
            {/* Logo */}
            <div className="flex items-center space-x-4">
                <Link href="/">
                    <img
                        src="/massimo-logo.png"
                        alt="Massimo Fitness Tracker"
                        className="h-12 w-12 cursor-pointer"
                    />
                </Link>
                <span className="text-lg font-semibold text-gray-800">
                    Massimo Fitness Tracker
                </span>
            </div>

            {/* Navigation Menu */}
            <NavigationMenu>
                <NavigationMenuList>
                    {/* Query Data */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Query Data</NavigationMenuTrigger>
                        <NavigationMenuContent className="mt-2 w-[500px] min-w-[400px] max-w-[600px] flex-shrink-0">
                            <ul className="bg-white p-6 space-y-4 shadow-md border rounded-lg">
                                <li>
                                    <Link
                                        href="/query-data/strength"
                                        className="text-black-600 hover:text-black"
                                    >
                                        <strong>Strength Data</strong>
                                        <p className="text-gray-500 text-sm">
                                            Visualize your strength workout trends and progress.
                                        </p>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/query-data/aerobic"
                                        className="text-black-600 hover:text-black"
                                    >
                                        <strong>Aerobic Data</strong>
                                        <p className="text-gray-500 text-sm">
                                            View your progress in aerobic exercises such as cycling.
                                        </p>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/query-data/list-all"
                                        className="text-black-600 hover:text-black"
                                    >
                                        <strong>List All Workouts</strong>
                                        <p className="text-gray-500 text-sm">
                                            View your past workout details for specific dates.
                                        </p>
                                    </Link>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Add Workout */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Add Workout</NavigationMenuTrigger>
                        <NavigationMenuContent className="mt-2 w-[500px] min-w-[400px] max-w-[600px] flex-shrink-0">
                            <ul className="bg-white p-6 space-y-4 shadow-md border rounded-lg">
                                <li>
                                    <Link
                                        href="/add-workout/aerobic"
                                        className="text-black-600 hover:text-black"
                                    >
                                        <strong>Aerobic Workout</strong>
                                        <p className="text-gray-500 text-sm">
                                            Log your running, cycling, and other aerobic sessions.
                                        </p>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="add-workout/strength"
                                        className="text-black-600 hover:text-black"
                                    >
                                        <strong>Strength Workout</strong>
                                        <p className="text-gray-500 text-sm">
                                            Track your weightlifting and resistance exercises.
                                        </p>
                                    </Link>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Form Tracker */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Form Tracker</NavigationMenuTrigger>
                        <NavigationMenuContent className="mt-2 w-[500px] min-w-[400px] max-w-[600px] flex-shrink-0">
                            <ul className="bg-white p-6 space-y-4 shadow-md border rounded-lg">
                                <li>
                                    <Link
                                        href="/form-tracker/progress"
                                        className="text-black-600 hover:text-black"
                                    >
                                        <strong>Online Form Analysis</strong>
                                        <p className="text-gray-500 text-sm">
                                            Upload a video of you doing any exercise, and analyze the form comparing to pro.
                                        </p>
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link
                                        href="/form-tracker/recommendations"
                                        className="text-black-600 hover:text-black"
                                    >
                                        <strong>Recommendations</strong>
                                        <p className="text-gray-500 text-sm">
                                            Get AI-driven suggestions to optimize your form.
                                        </p>
                                    </Link>
                                </li> */}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            {/* User Info - Avatar + Username */}
            {/* <div className="flex items-center space-x-4">
                <Link href="/user-info" className="flex items-center space-x-4 cursor-pointer">
                    <Avatar className="w-10 h-10">
                        <AvatarImage
                            src="/avatar-placeholder.png"
                            alt="User Avatar"
                        />
                        <AvatarFallback>{loading ? '...' : username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-800 font-medium">
                        {loading ? 'Loading...' : username}
                    </span>
                </Link>
                <Button variant="default" onClick={handleLogout} className="ml-4 px-4 py-2 rounded-md">
                    Logout
                </Button>
            </div> */}
            <div className="flex items-center space-x-4">
                <Link href="/user-info" className="flex items-center space-x-4">
                    <Avatar className="w-10 h-10">
                        <AvatarImage
                            src={avatarUrl || '/avatar-placeholder.png'}
                            alt="User Avatar"
                        />
                        <AvatarFallback>
                            {loading ? '...' : username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-800 font-medium">
                        {loading ? 'Loading...' : username}
                    </span>
                </Link>
                {/* <Button variant="default" onClick={handleLogout}>
                    Logout
                </Button> */}
            </div>
        </header>
    );
}