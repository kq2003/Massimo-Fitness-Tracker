import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser, logoutUser, updateLocationConsent, updateLocation } from '../api';
import { Container, Row, Col, Form, Button, Card, Modal } from 'react-bootstrap';

function UserAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [showLocationConsent, setShowLocationConsent] = useState(false);
    const navigate = useNavigate();

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(registerData);
            alert('User registered successfully! Please log in.');
            setShowRegister(false);
        } catch (error) {
            alert('Registration failed. Try a different email or username.');
        }
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(loginData);
            setIsLoggedIn(true);

            if (!response.data.locationConsent) {
                setShowLocationConsent(true);
            } else {
                collectLocation();
                navigate('/menu');
            }

            alert('Logged in successfully!');
        } catch (error) {
            alert('Invalid login credentials');
        }
    };

    const handleLocationConsent = async (consent) => {
        try {
            await updateLocationConsent(consent);
            setShowLocationConsent(false);
            
            if (consent) {
                collectLocation();
            }
            
            navigate('/menu');
        } catch (error) {
            console.error('Error updating location consent:', error);
        }
    };

    const collectLocation = () => {  //TODO (Alex): This is from chatgpt, need to check if this actually works or if there's better way
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        await updateLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    } catch (error) {
                        console.error('Error updating location:', error);
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    };



    const handleLogout = async () => {
        await logoutUser();
        setIsLoggedIn(false);
        alert('Logged out successfully!');
    };

    return (
        <>
            <Container className="mt-5 d-flex justify-content-center"
            style={{
                backgroundImage: `url('/cbum.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
                padding: '20px',
                backgroundColor: 'lightgray'
            }}
            >
                <Row>
                    <Col xs={12} md={8} lg={6}>
                        <Card className="p-4 shadow-sm" style={{ minWidth: '320px' }}>
                            <Card.Body>
                                {!isLoggedIn ? (
                                    showRegister ? (
                                        <>
                                            <Card.Title className="text-center mb-4">Register</Card.Title>
                                            <Form onSubmit={handleRegisterSubmit}>
                                                <Form.Group className="mb-3" controlId="registerUsername">
                                                    <Form.Label>Username</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="username"
                                                        value={registerData.username}
                                                        onChange={handleRegisterChange}
                                                        placeholder="Username"
                                                        required
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="registerEmail">
                                                    <Form.Label>Email address</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={registerData.email}
                                                        onChange={handleRegisterChange}
                                                        placeholder="Email"
                                                        required
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="registerPassword">
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="password"
                                                        value={registerData.password}
                                                        onChange={handleRegisterChange}
                                                        placeholder="Password"
                                                        required
                                                    />
                                                </Form.Group>
                                                <Button variant="primary" type="submit" className="w-100 mb-3" style={{ minWidth: '120px' }}>
                                                    Register
                                                </Button>
                                                <Button
                                                    variant="link"
                                                    onClick={() => setShowRegister(false)}
                                                    className="w-100"
                                                >
                                                    Go to Login
                                                </Button>
                                            </Form>
                                        </>
                                    ) : (
                                        <>
                                            <Card.Title className="text-center mb-4">Massimo: Fitness Tracker</Card.Title>
                                            <Form onSubmit={handleLoginSubmit}>
                                                <Form.Group className="mb-3" controlId="loginEmail">
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={loginData.email}
                                                        onChange={handleLoginChange}
                                                        placeholder="Email"
                                                        required
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="loginPassword">
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="password"
                                                        value={loginData.password}
                                                        onChange={handleLoginChange}
                                                        placeholder="Password"
                                                        required
                                                    />
                                                </Form.Group>
                                                <Button variant="primary" type="submit" className="w-100 mb-3" style={{ minWidth: '120px' }}>
                                                    Log In
                                                </Button>
                                                <Button
                                                    variant="link"
                                                    onClick={() => setShowRegister(true)}
                                                    className="w-100"
                                                >
                                                    Register
                                                </Button>
                                            </Form>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <Card.Title className="text-center mb-4">Welcome!</Card.Title>
                                        <Button variant="danger" onClick={handleLogout} className="w-100">
                                            Logout
                                        </Button>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {showLocationConsent && (
                <Modal show={true} onHide={() => handleLocationConsent(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Location Consent</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Would you like to share your location data with us? This helps us provide better service and workout recommendations.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleLocationConsent(false)}>
                            Decline
                        </Button>
                        <Button variant="primary" onClick={() => handleLocationConsent(true)}>
                            Accept
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>  //TODO (Alex): This is untested, need to first test, and then figure out a way to make sure this pop up after login
    );
}

export default UserAuth;



