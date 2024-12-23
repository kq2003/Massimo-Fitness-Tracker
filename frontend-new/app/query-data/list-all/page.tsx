"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllWorkouts } from "@/services/api";

interface Workout {
  type: string;
  details: string;
  date: string;
}

export default function ListAllWorkouts() {
  const [workoutsByDate, setWorkoutsByDate] = useState<Record<string, Workout[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await getAllWorkouts();
        setWorkoutsByDate(response.data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="p-6 space-y-4">
      {loading ? (
        <p>Loading workouts...</p>
      ) : Object.keys(workoutsByDate).length === 0 ? (
        <p>No workouts found.</p>
      ) : (
        <Accordion type="single" collapsible>
          {Object.entries(workoutsByDate)
            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
            .map(([date, workouts]) => (
              <AccordionItem key={date} value={date}>
                <AccordionTrigger>
                  {date}
                  <Badge className="ml-2">{workouts.length} workouts</Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {workouts.map((workout, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{workout.type}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{workout.details}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      )}
    </div>
  );
}
