// import React, { useEffect, useState } from 'react';
// import { getAllWorkouts } from '../api';  // Define this API call to fetch all workouts

// function WorkoutList() {
//     const [workouts, setWorkouts] = useState([]);

//     useEffect(() => {
//         const fetchWorkouts = async () => {
//             try {
//                 const response = await getAllWorkouts();
//                 setWorkouts(response.data);
//             } catch (error) {
//                 console.error("Error fetching workouts:", error);
//             }
//         };

//         fetchWorkouts();
//     }, []);

//     return (
//         <div style={{ maxHeight: '500px', overflowY: 'scroll' }}>
//             <h3>All Workouts</h3>
//             {workouts.map((workout, index) => (
//                 <div key={index} className="mb-3 p-2 border rounded">
//                     <p><strong>Type:</strong> {workout.type}</p>
//                     <p><strong>Date:</strong> {workout.date}</p>
//                     <p><strong>Details:</strong> {workout.details}</p>
//                 </div>
//             ))}
//         </div>
//     );
// }

// export default WorkoutList;


import React, { useEffect, useState } from 'react';
import { getAllWorkouts } from '../api'; // Ensure this API call fetches workouts data
import { Container, Card, ListGroup, Spinner } from 'react-bootstrap';

function ListAllWorkout() {
    const [workoutsByDate, setWorkoutsByDate] = useState({});
    const [isLoading, setIsLoading] = useState(true);

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
                        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
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
}

export default ListAllWorkout;
