'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser } from '@/services/api';
import { Button } from '../../components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function AuthPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', username: '' });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isRegister) await registerUser(formData);
            else await loginUser(formData);
            router.push('/menu');
        } catch {
            alert('Something went wrong');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6">
                <h2 className="text-center mb-4 text-lg font-bold">
                    {isRegister ? 'Register' : 'Log In'}
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {isRegister && (
                        <Input
                            placeholder="Username"
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    )}
                    <Input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <Button className="w-full" type="submit">
                        {isRegister ? 'Register' : 'Log In'}
                    </Button>
                </form>
                <Button
                    variant="link"
                    className="w-full mt-2"
                    onClick={() => setIsRegister(!isRegister)}
                >
                    {isRegister ? 'Back to Login' : 'Create an Account'}
                </Button>
            </Card>
        </div>
    );
}
