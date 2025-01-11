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
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchUsername, updateLocationConsent, updateUsername, updatePassword } from '@/services/api'; // API call to fetch username

export default function UserInfoPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState('');
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

const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Call the API to update the username
      const response = await updateUsername({ username: newUsername });
  
      if (response.data.success) {
        setUsername(response.data.username);
        alert('Username updated successfully.');
      } else {
        console.error('Failed to update username:', response.data.error);
        alert(`Failed to update username: ${response.data.error}`);
      }
    } catch (error) {
      console.error('An error occurred while updating username:', error);
      alert('An error occurred while updating username.');
    } finally {
      setLoading(false);
      setNewUsername(''); // Clear input after update
    }
  };



  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
  
    try {
      // Call the API to update the username
      const response = await updatePassword({ password: newPassword });
      if (response.data.success) {
        setNewPassword(response.data.password);
        alert('Password updated successfully.');
      } else {
        console.error('Failed to update password:', response.data.error);
        alert(`Failed to update password: ${response.data.error}`);
      }
    } catch (error) {
      console.error('An error occurred while updating password:', error);
      alert('An error occurred while updating password.');
    } finally {
      setPasswordLoading(false);
      setNewPassword(''); // Clear input after update
    }
  };




  const [locationLoading, setLocationLoading] = useState(false);
  const [locationConsent, setLocationConsent] = useState<boolean>(false);
  const handleLocationConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedConsent = !locationConsent;
    setLocationConsent(updatedConsent);
    setLocationLoading(true);
  
    try {
      console.log('Sending consent:', updatedConsent);
      const response = await updateLocationConsent({ consent: updatedConsent });
      if (response.data.success) {
        console.log('Response data:', response.data);
        setLocationConsent(response.data.location_consent);
        alert('Location consent updated successfully.');
      } else {
        console.error('Failed to update location consent:', response.data.error);
        alert(`Failed to update location consent: ${response.data.error}`);
      }
    } catch (error) {
      console.error('An error occurred while updating location consent:', error);
      alert('An error occurred while updating location consent.');
    } finally {
      setLocationLoading(false);
    }
  };
  
  

  // Handle user logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Failed to log out. Status:', response.status);
        alert('Failed to log out.');
        return;
      }

      // If successful, redirect to auth page
      router.push('/auth');
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to log out.');
    }
  };

  // Define your sidebar menu items
  const menuItems = [
    { title: 'Home', icon: Home, url: '/menu' },
    { title: 'Profile', icon: User2, url: '/user-info' },
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
            <Link href="/user-info" className="flex items-center space-x-4 cursor-pointer"></Link>
            <p className="mb-4">
                Welcome, <strong>{username}</strong>.
            </p>

            {/* --- Existing Form (Tailwind) --- */}
            <form onSubmit={handleUsernameChange} className="mb-6">
                <label htmlFor="username" className="block mb-2 font-semibold">
                Change Username
                </label>
                <input
                id="username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="border rounded p-2 w-full mb-4"
                placeholder="Enter new username"
                required
                />
                <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loading}
                >
                {loading ? 'Updating...' : 'Update Username'}
                </button>
            </form>

            <form onSubmit={handlePasswordChange} className="mb-6">
                <label htmlFor="password" className="block mb-2 font-semibold">
                Change Password
                </label>
                <input
                id="password"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border rounded p-2 w-full mb-4"
                placeholder="Enter new password"
                required
                />
                <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loading}
                >
                {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
            </form>


            <label>
            <input
              type="checkbox"
              checked={locationConsent}
              onChange={handleLocationConsent}
              disabled={loading}
            />
            Allow location tracking
          </label>



            </main>
      </div>
    </SidebarProvider>
  );
}




