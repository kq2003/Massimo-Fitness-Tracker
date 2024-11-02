import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

function Menu() {
    const navigate = useNavigate();

    const handleQueryData = () => {
        navigate('/query-data');
    };

    const handleAddSession = () => {
        navigate('/add-session');
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Row>
                <Col xs={12} md={8} lg={6}>
                    <Card className="text-center p-4 shadow-sm" style={{ minWidth: '320px' }}>
                        <Card.Body>
                            <Card.Title className="mb-4">Yeah Buddy!!!</Card.Title>
                            <Button variant="primary" onClick={handleQueryData} className="w-100 mb-3" style={{ minWidth: '120px' }}>
                                Query Data
                            </Button>
                            <Button variant="success" onClick={handleAddSession} className="w-100 mb-3" style={{ minWidth: '120px' }}>
                                Add a Session
                            </Button>
                            <Button variant="danger" onClick={handleLogout} className="w-100" style={{ minWidth: '120px' }}>
                                Logout
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Menu;

