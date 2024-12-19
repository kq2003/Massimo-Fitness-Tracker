'use client';

import RecommendationAgent from '@/components/RecommendationAgent';

export default function MenuPage() {
    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col relative">
            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Massimo!</h1>
                <p className="text-gray-600 text-lg">
                    Muscle visualization and daily recommendations coming soon!
                </p>
            </main>

            {/* Draggable Recommendation Agent */}
            <RecommendationAgent
                isMovable={true}
                initialMessage="Hi! How can I help you with your workout today?"
            />
        </div>
    );
}


