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
import { fetchUsername, updateUsername } from '@/services/api'; // API call to fetch username

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

  function UpdateEmailForm() {
    const [newEmail, setNewEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // Prevent page refresh
      setIsLoading(true);
      setMessage(null); // Clear previous messages
  
      try {
        const response = await fetch('/update-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: newEmail }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          setMessage({ type: 'error', text: `Failed to update email: ${errorData.error || 'Unknown error'}` });
          console.error('Failed to update email. Status:', response.status);
          return;
        }
  
        const data = await response.json();
        if (data.success) {
          setMessage({ type: 'success', text: `Email updated to: ${data.new_email || data.newEmail}` });
        } else {
          setMessage({ type: 'error', text: `Update failed: ${data.error || 'Unknown error'}` });
        }
      } catch (error) {
        console.error('Error while updating email:', error);
        setMessage({ type: 'error', text: 'An error occurred while updating the email.' });
      } finally {
        setIsLoading(false);
        setNewEmail(''); // Clear the input if desired
      }
    };
  
    // Return the email update form with status message
    return (
      <div className="mb-6">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block mb-2 font-semibold">
            Change Email
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
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Email'}
          </button>
        </form>
  
        {/* Display success or error message */}
        {message && (
          <p
            className={`mt-4 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'} font-semibold`}
          >
            {message.text}
          </p>
        )}
      </div>
    );
  }
  
  

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
    { title: 'Home', icon: Home, url: '/' },
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

            {/* --- New Email Form --- */}
            <UpdateEmailForm />
            </main>
      </div>
    </SidebarProvider>
  );
}




