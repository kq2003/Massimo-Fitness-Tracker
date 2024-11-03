import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import StrengthProgressPlot from '../components/StrengthProgressPlot';
import AerobicProgressPlot from '../components/AerobicProgressPlot';
import ListAllWorkout from '../components/ListAllWorkout';
import { getStrengthExerciseTypes, getAerobicExerciseTypes } from '../api';

function QueryData() {
    const navigate = useNavigate();
    const [viewType, setViewType] = useState('Strength');
    const [exerciseType, setExerciseType] = useState('');
    const [strengthExerciseTypes, setStrengthExerciseTypes] = useState([]);
    const [aerobicExerciseTypes, setAerobicExerciseTypes] = useState([]);

    useEffect(() => {
        const fetchStrengthTypes = async () => {
            try {
                const response = await getStrengthExerciseTypes();
                setStrengthExerciseTypes(response.data);
            } catch (error) {
                console.error("Error fetching strength exercise types:", error);
            }
        };
    
        const fetchAerobicTypes = async () => {
            try {
                const response = await getAerobicExerciseTypes();
                setAerobicExerciseTypes(response.data);
            } catch (error) {
                console.error("Error fetching aerobic exercise types:", error);
            }
        };
    
        fetchStrengthTypes();
        fetchAerobicTypes();
    }, []);

    const handleViewTypeChange = (e) => {
        setViewType(e.target.value);
        setExerciseType(''); // Reset exercise type when view type changes
    };

    const handleExerciseTypeChange = (e) => {
        setExerciseType(e.target.value);
    };

    const goToMenu = () => {
        navigate('/menu');
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Query Workout Data</h1>
            
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="viewType" className="mb-3">
                        <Form.Label>Select Data Type</Form.Label>
                        <Form.Select value={viewType} onChange={handleViewTypeChange}>
                            <option value="Strength">Strength</option>
                            <option value="Aerobic">Aerobic</option>
                            <option value="Listed Workouts">Listed Workouts</option>
                        </Form.Select>
                    </Form.Group>

                    {viewType !== "Listed Workouts" && (
                        <Form.Group controlId="exerciseType" className="mb-3">
                            <Form.Label>Select Exercise Type</Form.Label>
                            <Form.Select value={exerciseType} onChange={handleExerciseTypeChange}>
                                <option value="">Select an exercise</option>
                                {(viewType === "Strength" ? strengthExerciseTypes : aerobicExerciseTypes).map((type, i) => (
                                    <option key={i} value={type}>{type}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    )}
                </Col>
            </Row>

            <Row className="justify-content-center mt-4">
                <Col md={8}>
                    {viewType === "Strength" && exerciseType && (
                        <StrengthProgressPlot exerciseType={exerciseType} />
                    )}
                    {viewType === "Aerobic" && exerciseType && (
                        <AerobicProgressPlot exerciseType={exerciseType} />
                    )}
                    {viewType === "Listed Workouts" && (
                        <ListAllWorkout />
                    )}
                </Col>
            </Row>

            <Row className="justify-content-center mt-4">
                <Col md={4}>
                    <Button variant="secondary" onClick={goToMenu} className="w-100">
                        Back to Menu
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default QueryData;
