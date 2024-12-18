'use client';

import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

export default function MenuPage() {
    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col justify-between">
            {/* Main Content Placeholder */}
            <div className="flex-1 flex items-center justify-center text-center">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Massimo!</h1>
                <p className="text-gray-600 text-lg">
                    Muscle visualization and daily recommendations coming soon!
                </p>
            </div>

            {/* Bottom Navigation Bar using Shadcn */}
            <NavigationMenu className="bg-white shadow-md p-4 fixed bottom-0 left-0 w-full">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Data Query</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="p-4 grid grid-cols-1 gap-2">
                                <li>
                                    <Link
                                        href="/query-data"
                                        className="text-blue-600 hover:text-black"
                                    >
                                        View Data
                                    </Link>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Add Workout</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="p-4 grid grid-cols-1 gap-2">
                                <li>
                                    <Link
                                        href="/add-workout"
                                        className="text-blue-600 hover:text-black"
                                    >
                                        Create New
                                    </Link>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Form Tracker</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="p-4 grid grid-cols-1 gap-2">
                                <li>
                                    <Link
                                        href="/form-tracker"
                                        className="text-blue-600 hover:text-black"
                                    >
                                        Track Form
                                    </Link>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}


