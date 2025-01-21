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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUsername, updateUsername, logoutUser } from '@/services/api'; // Replace with actual API calls
import AuthenticatedPage from '@/components/AuthenticatedPage';

export default function SettingsPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch current username on page load
  useEffect(() => {
    const loadUsername = async () => {
      try {
        const response = await fetchUsername();
        setUsername(response.data.username);
      } catch {
        setUsername(null);
      }
    };

    loadUsername();
  }, []);

  // Handle username update
  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await updateUsername({ username: newUsername });
      if (response.data.success) {
        setUsername(response.data.username);
        setMessage({ type: 'success', text: 'Username updated successfully.' });
      } else {
        setMessage({ type: 'error', text: `Failed to update username: ${response.data.error}` });
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred while updating the username.' });
    } finally {
      setLoading(false);
      setNewUsername('');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      alert('Logged out successfully!');
      router.push('/auth'); // Redirect to login page
    } catch {
      alert('Failed to log out. Please try again.');
    }
  };

  // Handle email update
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/update-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: newEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessage({ type: 'success', text: `Email updated to: ${data.new_email || data.newEmail}` });
        } else {
          setMessage({ type: 'error', text: `Update failed: ${data.error}` });
        }
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: `Failed to update email: ${errorData.error || 'Unknown error'}` });
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred while updating the email.' });
    } finally {
      setLoading(false);
      setNewEmail('');
    }
  };

  // Sidebar menu items
  const menuItems = [
    { title: 'Home', icon: Home, url: '/' },
    { title: 'Profile', icon: User2, url: '/user-info' },
    { title: 'Settings', icon: Settings, url: '/settings' },
    { title: 'Upload Avatar', icon: ImagePlus, url: '/avatar-upload' },
  ];

  return (
    <AuthenticatedPage>
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
          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Current Username</h2>
            <p className="mb-2">Your username is: <strong>{username || 'Unknown'}</strong></p>
            <form onSubmit={handleUsernameChange}>
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
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Change Email</h2>
            <form onSubmit={handleEmailChange}>
              <label htmlFor="email" className="block mb-2 font-semibold">
                New Email
              </label>
              <input
                id="email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="border rounded p-2 w-full mb-4"
                placeholder="Enter new email"
                required
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Email'}
              </button>
            </form>
          </section>

          {message && (
            <p
              className={`mt-4 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'} font-semibold`}
            >
              {message.text}
            </p>
          )}

        </main>
      </div>
    </SidebarProvider>
    </AuthenticatedPage>
  );
}

