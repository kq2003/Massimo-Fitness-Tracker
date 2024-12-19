'use client';

import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
} from '@/components/ui/navigation-menu';

export default function Header() {
    return (
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
            {/* Logo */}
            <div className="flex items-center space-x-4">
                <Link href="/menu">
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

            {/* Navigation with Dropdowns */}
            <NavigationMenu>
                <NavigationMenuList>
                    {/* Data Query Menu */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Data Query</NavigationMenuTrigger>
                        <NavigationMenuContent className="mt-2">
                            <ul className="bg-white p-4 space-y-2 shadow-md border rounded-lg">
                                <li>
                                    <Link
                                        href="/query-data/view"
                                        className="text-blue-600 hover:text-black"
                                    >
                                        View Data
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/query-data/export"
                                        className="text-blue-600 hover:text-black"
                                    >
                                        Export Data
                                    </Link>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Add Workout Menu */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Add Workout</NavigationMenuTrigger>
                        <NavigationMenuContent className="mt-2">
                            <ul className="bg-white p-4 space-y-2 shadow-md border rounded-lg">
                                <li>
                                    <Link
                                        href="/add-workout/aerobic"
                                        className="text-blue-600 hover:text-black"
                                    >
                                        Aerobic Workout
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/add-workout/strength"
                                        className="text-blue-600 hover:text-black"
                                    >
                                        Strength Workout
                                    </Link>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Form Tracker Menu */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Form Tracker</NavigationMenuTrigger>
                        <NavigationMenuContent className="mt-2">
                            <ul className="bg-white p-4 space-y-2 shadow-md border rounded-lg">
                                <li>
                                    <Link
                                        href="/form-tracker/progress"
                                        className="text-blue-600 hover:text-black"
                                    >
                                        Track Progress
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/form-tracker/recommendations"
                                        className="text-blue-600 hover:text-black"
                                    >
                                        Recommendations
                                    </Link>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            {/* User Info */}
            <div className="flex items-center space-x-4">
                <Avatar className="w-10 h-10">
                    <AvatarImage src="/avatar-placeholder.png" alt="User Avatar" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className="text-gray-800">Username</span>
            </div>
        </header>
    );
}





