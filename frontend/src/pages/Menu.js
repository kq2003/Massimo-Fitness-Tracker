// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Button, Card } from 'react-bootstrap';

// function Menu() {
//     const navigate = useNavigate();

//     const handleQueryData = () => {
//         navigate('/query-data');
//     };

//     const handleAddSession = () => {
//         navigate('/add-session');
//     };

//     const handleRecommendation = () => {
//         navigate('/recommendation-agent');
//     };

//     const handleLogout = () => {
//         navigate('/');
//     };

//     return (
//         <Container className="mt-5 d-flex justify-content-center">
//             <Row>
//                 <Col xs={12} md={8} lg={6}>
//                     <Card className="text-center p-4 shadow-sm" style={{ minWidth: '320px' }}>
//                         <Card.Body>
//                             <Card.Title className="mb-4">Yeah Buddy!!!</Card.Title>
//                             <Button variant="primary" onClick={handleQueryData} className="w-100 mb-3" style={{ minWidth: '120px' }}>
//                                 Query Data
//                             </Button>
//                             <Button variant="success" onClick={handleAddSession} className="w-100 mb-3" style={{ minWidth: '120px' }}>
//                                 Add a Session
//                             </Button>
                            
//                             <Button
//                                 variant="info"
//                                 onClick={handleRecommendation}
//                                 className="w-100 mb-3"
//                                 style={{ minWidth: '120px' }}
//                             >
//                                 Recommendation Agent
//                             </Button>

//                             <Button variant="danger" onClick={handleLogout} className="w-100" style={{ minWidth: '120px' }}>
//                                 Logout
//                             </Button>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>
//         </Container>
//     );
// }

// export default Menu;

// Menu Redesign Code for Massimo Fitness Tracker

import React from 'react';
import { Container, Row, Col, Button, Card, Nav } from 'react-bootstrap';
import RecommendationAgent from '../components/RecommendationAgent.js';
import ThreeDModel from '../components/ThreeDModel.js';
import '../App.css';

function Menu() {
    return (
        <Container className="welcome-page">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6} className="text-center">
                    <ThreeDModel />
                    <Button variant="primary" className="action-button">Explore Workouts</Button>
                </Col>
            </Row>

            <RecommendationAgent />

            <Nav className="bottom-nav justify-content-around">
                <Nav.Link href="/menu">Home</Nav.Link>
                <Nav.Link href="/query-data">Query Data</Nav.Link>
                <Nav.Link href="/add-session">Add Session</Nav.Link>
                <Nav.Link href="/">Logout</Nav.Link>
            </Nav>
        </Container>
    );
}

export default Menu;

