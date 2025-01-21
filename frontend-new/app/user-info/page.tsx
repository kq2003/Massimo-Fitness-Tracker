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

import { Home, User2, Settings, LogOut, ImagePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchUsername, logoutUser } from '@/services/api'; // API calls
import axios from 'axios';

export default function UserInfoPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch current user info on mount
  useEffect(() => {
    const loadUsername = async () => {
      try {
        const response = await fetchUsername();
        setUsername(response.data.username);
      } catch (error) {
        console.error('Failed to fetch username:', error);
        setUsername(null);
      } finally {
        setLoading(false);
      }
    };

    loadUsername();
  }, []);

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

  // Define your sidebar menu items
  const menuItems = [
    { title: 'Home', icon: Home, url: '/' },
    { title: 'Profile', icon: User2, url: '/user-info' },
    { title: 'Settings', icon: Settings, url: '/settings' },
    { title: 'Upload Avatar', icon: ImagePlus, url: '/avatar-upload' },
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
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          <p className="mb-4">
            Welcome, <strong>{username || 'User'}</strong>.
          </p>

          <p className="mb-6">
            This page is all about your profile. From here, you can explore various options like updating your account details or managing your settings. Use the sidebar to navigate to different sections.
          </p>

          <p className="mb-6 text-gray-600">
            <strong>Next Steps:</strong>
          </p>
          <ul className="list-disc pl-5 mb-6">
            <li>
              <Link href="/settings" className="text-blue-500 underline">
                Go to Settings
              </Link>{' '}
              to update your username, email, or other personal details.
            </li>
            <li>
              <Link href="/avatar-upload" className="text-blue-500 underline">
                Upload an avatar
              </Link>{' '}
              to personalize your profile.
            </li>
          </ul>

          <p className="text-gray-600">
            Need help? Contact our support team or explore the <Link href="/help" className="text-blue-500 underline">Help Center</Link>.
          </p>
        </main>
      </div>
    </SidebarProvider>
  );
}
