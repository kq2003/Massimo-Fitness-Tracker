import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // Import FullCalendar
import { EventInput } from "@fullcalendar/core"; // Import EventInput
import dayGridPlugin from "@fullcalendar/daygrid"; // Plugin for month view
import { fetchGymActivity } from "@/services/api"; // Replace with your API function

// Define TypeScript type for API response
interface GymActivity {
    date: string; // Date in ISO 8601 format (e.g., "2025-01-15")
    workout_type: string; // Example: "Push", "Pull"
}

const ActivityCalendar: React.FC = () => {
    const [events, setEvents] = useState<EventInput[]>([]); // FullCalendar event format

    // Fetch workout activity from the API
    useEffect(() => {
        const loadActivity = async () => {
            try {
                const year = new Date().getFullYear();
                const month = new Date().getMonth() + 1; // Month is 0-indexed

                const data = await fetchGymActivity(year, month);

                // Convert gym activity into FullCalendar event format
                const formattedEvents: EventInput[] = data.activity.map((activity: GymActivity) => ({
                    start: activity.date, // Date for the event
                    display: "background", // Highlight the day without showing text
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error("Error fetching gym activity:", error);
            }
        };

        loadActivity();
    }, []);

    return (
        <div className="activity-calendar">
            <h2 className="text-lg font-bold mb-4">Your Gym Activity</h2>
            <FullCalendar
                plugins={[dayGridPlugin]} // Use the dayGrid plugin for month view
                initialView="dayGridMonth" // Default view: Month
                events={events} // Pass the events to FullCalendar
                headerToolbar={{
                    start: "prev,next today", // Controls for navigation
                    center: "title", // Centered title
                    end: "dayGridMonth", // Dropdown for switching views
                }}
                eventBackgroundColor="#34d399" // Tailwind green for highlighted days
                eventColor="transparent" // No border or text color
                height="auto" // Automatically adjust height
            />
        </div>
    );
};

export default ActivityCalendar;









