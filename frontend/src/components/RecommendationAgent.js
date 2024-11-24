import React, { useState } from 'react';
import { Form, Button, Card, InputGroup, Container, Row, Col, Spinner } from 'react-bootstrap';
import { getRecommendation } from '../api';
import { useNavigate } from 'react-router-dom';

function RecommendationAgent() {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSendMessage = async () => {
        if (!userInput) return;

        // Add user's message to the chat
        const newMessages = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        try {
            // Fetch recommendation from the API
            const response = await getRecommendation(userInput);

            // Simulate typing effect
            simulateTyping(response.data.recommendation, newMessages);
        } catch (error) {
            console.error('Error fetching recommendation:', error);
            setMessages([...newMessages, { sender: 'assistant', text: 'Something went wrong. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Simulate typing effect for assistant responses
    const simulateTyping = (responseText, newMessages) => {
        const words = responseText.split(' ');
        let displayedText = '';

        const typingInterval = setInterval(() => {
            if (words.length === 0) {
                clearInterval(typingInterval);
                return;
            }

            displayedText += words.shift() + ' ';
            setMessages([
                ...newMessages,
                { sender: 'assistant', text: displayedText.trim() + '...' }
            ]);
        }, 100); // Typing speed in milliseconds
    };

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col xs={12} md={8} lg={6} className="mx-auto">
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white text-center">
                            <h4>Recommendation Agent</h4>
                        </Card.Header>
                        <Card.Body>
                            <div className="chat-box mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`d-flex ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'
                                            } mb-2`}
                                    >
                                        <div
                                            className={`p-2 rounded shadow-sm ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'
                                                }`}
                                            style={{ maxWidth: '70%' }}
                                        >
                                            {message.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Ask for a workout recommendation..."
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button variant="primary" onClick={handleSendMessage} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send'
                                    )}
                                </Button>
                            </InputGroup>
                            <Button variant="secondary" onClick={handleGoBack} className="w-100">
                                Back to Menu
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default RecommendationAgent;


