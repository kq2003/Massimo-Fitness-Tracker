import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAerobicWorkout, addStrengthWorkout } from '../api';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

interface AerobicSession {
    type: string;
    duration: string;
    calories_burnt: string;
    heart_rate: string;
}

interface StrengthSession {
    type: string;
    reps: string;
    weight: string;
    rest_time: string;
    effort_level: string;
}

const AddSession: React.FC = () => {
    const [aerobicSessions, setAerobicSessions] = useState<AerobicSession[]>([]);
    const [strengthSessions, setStrengthSessions] = useState<StrengthSession[]>([]);
    const navigate = useNavigate();

    const addAerobicSession = () => {
        setAerobicSessions([...aerobicSessions, { type: '', duration: '', calories_burnt: '', heart_rate: '' }]);
    };

    const addStrengthSession = () => {
        setStrengthSessions([...strengthSessions, { type: '', reps: '', weight: '', rest_time: '', effort_level: '' }]);
    };

    const handleAerobicChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        const updatedSessions = [...aerobicSessions];
        updatedSessions[index][name as keyof AerobicSession] = value;
        setAerobicSessions(updatedSessions);
    };

    const handleStrengthChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        const updatedSessions = [...strengthSessions];
        updatedSessions[index][name as keyof StrengthSession] = value;
        setStrengthSessions(updatedSessions);
    };

    const submitAerobicSessions = async () => {
        try {
            for (const session of aerobicSessions) {
                await addAerobicWorkout(session);
            }
            alert('Aerobic workouts added successfully!');
            setAerobicSessions([]);
        } catch (error) {
            alert('Failed to add aerobic workouts.');
        }
    };

    const submitStrengthSessions = async () => {
        try {
            for (const session of strengthSessions) {
                await addStrengthWorkout(session);
            }
            alert('Strength workouts added successfully!');
            setStrengthSessions([]);
        } catch (error) {
            alert('Failed to add strength workouts.');
        }
    };

    const deleteAerobicSession = (index: number) => {
        const updatedSessions = aerobicSessions.filter((_, i) => i !== index);
        setAerobicSessions(updatedSessions);
    };

    const deleteStrengthSession = (index: number) => {
        const updatedSessions = strengthSessions.filter((_, i) => i !== index);
        setStrengthSessions(updatedSessions);
    };

    const goToMenu = () => {
        navigate('/menu');
    };

    const strengthExerciseTypes = [
        "Bench Press",
        "Incline Dumbbell Press",
        "Squat",
        "Deadlift",
        "Overhead Press",
        "Bicep Curl"
    ];

    const aerobicExerciseTypes = [
        "Running",
        "Cycling",
        "Swimming",
        "Rowing",
        "Walking"
    ];

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Add a Workout Session</h1>

            {/* Strength Training Section */}
            <div className="mb-5">
                <h2 className="text-center">Strength Training</h2>
                {strengthSessions.map((session, index) => (
                    <Card key={index} className="mb-3">
                        <Card.Body>
                            <Card.Title>Strength Session {index + 1}</Card.Title>
                            <Row className="mb-2">
                                {/* Form inputs */}
                            </Row>
                            <Button variant="danger" onClick={() => deleteStrengthSession(index)} className="mt-2">
                                Delete Strength Session
                            </Button>
                        </Card.Body>
                    </Card>
                ))}
                <Button variant="success" onClick={addStrengthSession} className="w-100 mb-3">
                    Add Strength Training Slot
                </Button>
                <Button variant="primary" onClick={submitStrengthSessions} className="w-100">
                    Finish Strength Workouts
                </Button>
            </div>

            {/* Aerobic Training Section */}
            <div>
                <h2 className="text-center">Aerobic Training</h2>
                {aerobicSessions.map((session, index) => (
                    <Card key={index} className="mb-3">
                        <Card.Body>
                            <Card.Title>Aerobic Session {index + 1}</Card.Title>
                            <Row className="mb-2">
                                {/* Form inputs */}
                            </Row>
                            <Button variant="danger" onClick={() => deleteAerobicSession(index)} className="mt-2">
                                Delete Aerobic Session
                            </Button>
                        </Card.Body>
                    </Card>
                ))}
                <Button variant="success" onClick={addAerobicSession} className="w-100 mb-3">
                    Add Aerobic Training Slot
                </Button>
                <Button variant="primary" onClick={submitAerobicSessions} className="w-100">
                    Finish Aerobic Workouts
                </Button>
            </div>

            <Button variant="secondary" onClick={goToMenu} className="w-100 mt-4">
                Back to Menu
            </Button>
        </Container>
    );
};

export default AddSession;
