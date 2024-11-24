import React, { useEffect, useState } from 'react';
import { getAllWorkouts } from '../api'; // Ensure this API call fetches workouts data
import { Container, Card, ListGroup, Spinner } from 'react-bootstrap';

interface Workout {
    type: string;
    details: string;
}

interface WorkoutsByDate {
    [date: string]: Workout[];
}

const ListAllWorkout: React.FC = () => {
    const [workoutsByDate, setWorkoutsByDate] = useState<WorkoutsByDate>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await getAllWorkouts();
                setWorkoutsByDate(response.data);
            } catch (error) {
                console.error("Error fetching workouts:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkouts();
    }, []);

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Workout History</h2>

            {isLoading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                Object.keys(workoutsByDate).length === 0 ? (
                    <p className="text-center">No workouts found.</p>
                ) : (
                    Object.entries(workoutsByDate)
                        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                        .map(([date, workouts], idx) => (
                            <Card key={idx} className="mb-4">
                                <Card.Header as="h5">{date}</Card.Header>
                                <ListGroup variant="flush">
                                    {workouts.map((workout, index) => (
                                        <ListGroup.Item key={index}>
                                            <strong>{workout.type}:</strong> {workout.details}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card>
                        ))
                )
            )}
        </Container>
    );
};

export default ListAllWorkout;
