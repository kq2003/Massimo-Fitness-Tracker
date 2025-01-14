'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
} from '@/components/ui/navigation-menu';
import { fetchUsername, fetchAvatar } from '@/services/api'; // API call to fetch username
import axios from 'axios';

export default function Header() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

        // Handle Logout
        const handleLogout = async () => {
            try {
                console.log('Attempting to log out...');
                const response = await logoutUser(); // Call logout API
                console.log('Logout Response:', response.data); // Log successful response
                alert('Logged out successfully!');
                router.push('/auth'); // Redirect to login page
            } catch (error) {
                console.error('Logout Error:', error); // Log detailed error
                if (axios.isAxiosError(error)) {
                    console.error('Axios Error Response:', error.response?.data); // Log backend error response
                    alert(error.response?.data?.message || 'Failed to log out. Please try again.');
                } else {
                    alert('An unknown error occurred during logout.');
                }
            }
        };

    // useEffect(() => {
    //     const loadUsername = async () => {
    //         try {
    //             const response = await fetchUsername();
    //             setUsername(response.data.username);
    //         } catch (error) {
    //             console.error('Failed to fetch username:', error);
    //             setUsername(null);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     loadUsername();
    // }, []);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                // Fetch username and avatar separately
                const [usernameResponse, avatarResponse] = await Promise.all([fetchUsername(), fetchAvatar()]);
                setUsername(usernameResponse.data.username);
                setAvatarUrl(avatarResponse);
                console.log("Avatar URL:", avatarResponse);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUsername(null);
                setAvatarUrl(null);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

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
                <Button variant="default" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </header>
    );
}