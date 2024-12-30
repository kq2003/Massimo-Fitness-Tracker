'use client';

import React, { useState } from 'react';
import { getRecommendation } from '@/services/api';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type RecommendationAgentProps = {
    initialMessage?: string;
};

export default function RecommendationAgent({
    initialMessage = 'Hi! How can I help you with your workout today?',
}: RecommendationAgentProps) {
    const [messages, setMessages] = useState<{ sender: string; content: string }[]>([
        { sender: 'Massimo', content: initialMessage },
    ]);
    const [userInput, setUserInput] = useState('');
    const [chatOpen, setChatOpen] = useState(false);

    // Handle sending messages
    const handleSendMessage = async () => {
        if (!userInput) return;

        const userMessage = { sender: 'You', content: userInput };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await getRecommendation(userInput);
            const botMessage = { sender: 'Massimo', content: response.data };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.log('Error fetching recommendation:', error);
            const errorMessage = { sender: 'Massimo', content: 'Something went wrong. Try again!' };
            setMessages((prev) => [...prev, errorMessage]);
        }
        setUserInput('');
    };

    return (
        <div className="fixed bottom-4 right-4">
            {!chatOpen ? (
                <div
                    className="relative group w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                    onClick={() => setChatOpen(true)}
                >
                    <Avatar>
                        <AvatarImage src="/massimo-avatar.png" alt="Massimo" />
                        <AvatarFallback>MA</AvatarFallback>
                    </Avatar>
                    {/* Prompt to click */}
                    <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to chat with Massimo
                    </div>
                </div>
            ) : (
                <div className="w-96 h-[600px] bg-white shadow-lg rounded-lg">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Massimo Assistant</h2>
                        <button
                            onClick={() => setChatOpen(false)}
                            className="text-red-500 font-bold"
                        >
                            X
                        </button>
                    </div>
                    <div className="p-4 h-[450px] overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    msg.sender === 'You' ? 'justify-end' : 'justify-start'
                                }`}
                            >
                                <div
                                    className={`${
                                        msg.sender === 'You'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                    } rounded-lg px-4 py-2 max-w-[75%]`}
                                >
                                    <strong>{msg.sender}: </strong>
                                    <span>{msg.content}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 flex space-x-2 border-t">
                        <input
                            type="text"
                            className="flex-1 border p-2 rounded"
                            placeholder="Ask me something..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}




