'use client';

import { useState } from 'react';
import { uploadAvatarToS3 } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
import { Home, User2, Settings, LogOut, ImagePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AvatarUploadPage() {
    const router = useRouter();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onload = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            alert('Please select an image first.');
            return;
        }

        try {
            const avatarUrl = await uploadAvatarToS3(file);
            alert(`Avatar uploaded successfully! URL: ${avatarUrl}`);
            window.location.reload();
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload avatar. Please try again.');
        }
    };

    // Sidebar menu items
    const menuItems = [
        { title: 'Home', icon: Home, url: '/' },
        { title: 'Profile', icon: User2, url: '/user-info' },
        { title: 'Settings', icon: Settings, url: '/settings' },
        { title: 'Upload Avatar', icon: ImagePlus, url: '/avatar-upload' },
    ];

    const handleLogout = async () => {
        // Logic to log out
        alert('Logged out successfully!');
        router.push('/auth'); // Redirect to login page
    };

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
                                    <button className="flex items-center w-full" onClick={handleLogout}>
                                        <LogOut className="mr-2" />
                                        <span>Logout</span>
                                    </button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>

                {/* Main Content */}
                <main className="flex-1 flex items-center justify-center min-h-screen bg-gray-100">
                    <Card className="w-full max-w-md p-6">
                        <h2 className="text-center mb-4 text-lg font-bold">Upload Your Avatar</h2>
                        <div className="space-y-4">
                            {avatarPreview && (
                                <div className="text-center">
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        className="w-32 h-32 rounded-full mx-auto mb-4"
                                    />
                                </div>
                            )}
                            <Input type="file" accept="image/*" onChange={handleFileChange} />
                            <Button className="w-full mt-4" onClick={handleSubmit}>
                                Save Avatar
                            </Button>
                        </div>
                    </Card>
                </main>
            </div>
        </SidebarProvider>
    );
}
