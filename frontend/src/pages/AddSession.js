import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAerobicWorkout, addStrengthWorkout } from '../api';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

function AddSession() {
    const [aerobicSessions, setAerobicSessions] = useState([]);
    const [strengthSessions, setStrengthSessions] = useState([]);
    const navigate = useNavigate();

    const addAerobicSession = () => {
        setAerobicSessions([...aerobicSessions, { type: '', duration: '', calories_burnt: '', heart_rate: '' }]);
    };

    const addStrengthSession = () => {
        setStrengthSessions([...strengthSessions, { type: '', reps: '', weight: '', rest_time: '', effort_level: '' }]);
    };

    const handleAerobicChange = (index, event) => {
        const { name, value } = event.target;
        const updatedSessions = [...aerobicSessions];
        updatedSessions[index][name] = value;
        setAerobicSessions(updatedSessions);
    };

    const handleStrengthChange = (index, event) => {
        const { name, value } = event.target;
        const updatedSessions = [...strengthSessions];
        updatedSessions[index][name] = value;
        setStrengthSessions(updatedSessions);
    };

    const submitAerobicSessions = async () => {
        try {
            for (const session of aerobicSessions) {
                await addAerobicWorkout(session);
            }
            alert('Aerobic workouts added successfully!');
            setAerobicSessions([]); // Clear the sessions after submission
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
            setStrengthSessions([]); // Clear the sessions after submission
        } catch (error) {
            alert('Failed to add strength workouts.');
        }
    };

    const deleteAerobicSession = (index) => {
        const updatedSessions = aerobicSessions.filter((_, i) => i !== index);
        setAerobicSessions(updatedSessions);
    };

    const deleteStrengthSession = (index) => {
        const updatedSessions = strengthSessions.filter((_, i) => i !== index);
        setStrengthSessions(updatedSessions);
    };

    const goToMenu = () => {
        navigate('/menu');
    };

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
                                <Col md={2}>
                                    <Form.Group controlId={`strengthType${index}`}>
                                        <Form.Label>Type</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="type"
                                            placeholder="Type"
                                            value={session.type}
                                            onChange={(e) => handleStrengthChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group controlId={`strengthReps${index}`}>
                                        <Form.Label>Reps</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="reps"
                                            placeholder="Reps"
                                            value={session.reps}
                                            onChange={(e) => handleStrengthChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group controlId={`strengthWeight${index}`}>
                                        <Form.Label>Weight (kg)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="weight"
                                            placeholder="Weight"
                                            value={session.weight}
                                            onChange={(e) => handleStrengthChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId={`strengthRestTime${index}`}>
                                        <Form.Label>Rest Time (s)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="rest_time"
                                            placeholder="Rest Time"
                                            value={session.rest_time}
                                            onChange={(e) => handleStrengthChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId={`strengthEffortLevel${index}`}>
                                        <Form.Label>Effort Level</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="effort_level"
                                            placeholder="Effort Level"
                                            value={session.effort_level}
                                            onChange={(e) => handleStrengthChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
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
                                <Col md={3}>
                                    <Form.Group controlId={`aerobicType${index}`}>
                                        <Form.Label>Type</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="type"
                                            placeholder="Type"
                                            value={session.type}
                                            onChange={(e) => handleAerobicChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId={`aerobicDuration${index}`}>
                                        <Form.Label>Duration (min)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="duration"
                                            placeholder="Duration"
                                            value={session.duration}
                                            onChange={(e) => handleAerobicChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId={`aerobicCalories${index}`}>
                                        <Form.Label>Calories Burnt</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="calories_burnt"
                                            placeholder="Calories"
                                            value={session.calories_burnt}
                                            onChange={(e) => handleAerobicChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId={`aerobicHeartRate${index}`}>
                                        <Form.Label>Heart Rate</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="heart_rate"
                                            placeholder="Heart Rate"
                                            value={session.heart_rate}
                                            onChange={(e) => handleAerobicChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
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
}

export default AddSession;


