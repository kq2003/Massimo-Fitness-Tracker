'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarProvider,
} from '@/components/ui/sidebar';

import { Home, User2, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserInfoPage() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/logout', { method: 'POST', credentials: 'include' });
            router.push('/auth');
        } catch {
            alert('Failed to log out.');
        }
    };

    const menuItems = [
        { title: 'Home', icon: Home, url: '/menu' },
        { title: 'Profile', icon: User2, url: '/userinfo' },
        { title: 'Settings', icon: Settings, url: '/settings' },
    ];

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <Sidebar collapsible="icon" variant="sidebar" side="left">
                    {/* Sidebar Header */}
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <span className="font-bold text-xl">Massimo</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>

                    {/* Sidebar Content */}
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Application</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {menuItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <a href={item.url} className="flex items-center">
                                                    <item.icon className="mr-2" />
                                                    <span>{item.title}</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    {/* Sidebar Footer */}
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <button
                                        className="flex items-center w-full"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="mr-2" />
                                        <span>Logout</span>
                                    </button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
                    <p>Welcome to the user info page. Functionalities coming soon in a week.</p>
                </main>
            </div>
        </SidebarProvider>
    );
}


