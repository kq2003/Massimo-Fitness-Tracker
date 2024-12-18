'use client';
import React, { useState } from 'react';
import { getRecommendation } from '@/services/api';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type RecommendationAgentProps = {
    isMovable?: boolean;
    initialMessage?: string;
};

export default function RecommendationAgent({
    isMovable = false,
    initialMessage = '',
}: RecommendationAgentProps) {
    const [messages, setMessages] = useState<string[]>([]);
    const [userInput, setUserInput] = useState('');
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isMovable) return;
        setDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!dragging || !isMovable) return;
        setPosition({
            x: e.clientX - 50, // Adjust for offset
            y: e.clientY - 50,
        });
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const handleSendMessage = async () => {
        if (!userInput) return;
        const response = await getRecommendation(userInput);
        setMessages([...messages, `Massimo: ${response.data}`]);
        setUserInput('');
    };

    return (
        <div
            className={`fixed ${dragging ? 'cursor-grabbing' : 'cursor-move'}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <Dialog>
                <DialogTrigger>
                    <Avatar>
                        <AvatarImage src="/massimo-avatar.png" alt="Massimo" />
                        <AvatarFallback>MA</AvatarFallback>
                    </Avatar>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Massimo Assistant</DialogTitle>
                    <div className="p-4">
                        <div className="h-40 overflow-y-auto border p-2 mb-4">
                            {initialMessage && !messages.length && (
                                <div className="text-sm mb-2 text-blue-600 font-semibold">
                                    {initialMessage}
                                </div>
                            )}
                            {messages.map((msg, index) => (
                                <div key={index} className="text-sm mb-2">{msg}</div>
                            ))}
                        </div>
                        <input
                            type="text"
                            className="w-full border p-2"
                            placeholder="Ask me something..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="mt-2 w-full bg-blue-600 text-white p-2 rounded"
                        >
                            Send
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}


