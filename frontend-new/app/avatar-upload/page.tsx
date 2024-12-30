'use client';

import { useState } from 'react';
import { updateUser } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function AvatarUploadPage() {
    const [avatar, setAvatar] = useState<string | null>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (avatar) {
            try {
                await updateUser({ avatar });
                alert('Avatar uploaded successfully!');
            } catch (error) {
                console.log("Error" + error);
                alert('Failed to upload avatar. Please try again.');
            }
        } else {
            alert('Please select an image before saving.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6">
                <h2 className="text-center mb-4 text-lg font-bold">Upload Your Avatar</h2>
                <div className="space-y-4">
                    {avatar && (
                        <div className="text-center">
                            <img
                                src={avatar}
                                alt="Avatar Preview"
                                className="w-32 h-32 rounded-full mx-auto mb-4"
                            />
                        </div>
                    )}
                    <Input type="file" accept="image/*" onChange={handleUpload} />
                    <Button className="w-full mt-4" onClick={handleSubmit}>
                        Save Avatar
                    </Button>
                </div>
            </Card>
        </div>
    );
}
