import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { getExerciseTypes } from '../api';
import ExerciseProgressPlot from '../components/ExerciseProgressPlot';

function QueryData() {
    const navigate = useNavigate();
    const [exerciseType, setExerciseType] = useState('');
    const [exerciseTypes, setExerciseTypes] = useState([]);
    const [showChart, setShowChart] = useState(false);

    useEffect(() => {
        const fetchExerciseTypes = async () => {
            try {
                const response = await getExerciseTypes();
                setExerciseTypes(response.data);
            } catch (error) {
                console.error("Error fetching exercise types:", error);
            }
        };
        fetchExerciseTypes();
    }, []);

    const handleExerciseTypeChange = (e) => {
        setExerciseType(e.target.value);
    };

    const handleShowChart = (e) => {
        e.preventDefault();
        setShowChart(true);
    };

    const goToMenu = () => {
        navigate('/menu');
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Query Exercise Data</h1>
            
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form onSubmit={handleShowChart}>
                        <Form.Group controlId="exerciseType" className="mb-3">
                            <Form.Label>Select Exercise Type</Form.Label>
                            <Form.Select
                                value={exerciseType}
                                onChange={handleExerciseTypeChange}
                                required
                            >
                                <option value="">Select an exercise</option>
                                {exerciseTypes.map((type, i) => (
                                    <option key={i} value={type}>{type}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Show Exercise Progress
                        </Button>
                    </Form>
                </Col>
            </Row>

            <Row className="justify-content-center mt-4">
                <Col md={8}>
                    {showChart && exerciseType ? (
                        <ExerciseProgressPlot exerciseType={exerciseType} />
                    ) : (
                        <p className="text-center">Select an exercise type to view progress.</p>
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



