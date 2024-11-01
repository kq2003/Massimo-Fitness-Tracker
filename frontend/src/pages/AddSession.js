import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddSession() {
    const [aerobicSessions, setAerobicSessions] = useState([]);
    const [strengthSessions, setStrengthSessions] = useState([]);
    const navigate = useNavigate();

    const addAerobicSession = () => {
        setAerobicSessions([...aerobicSessions, {}]);
    };

    const addStrengthSession = () => {
        setStrengthSessions([...strengthSessions, {}]);
    };

    const goToMenu = () => {
        navigate('/menu');
    };

    return (
        <div>
            <h1>Add a Workout Session</h1>
            <div>
                <h2>Aerobic Training</h2>
                {aerobicSessions.map((session, index) => (
                    <div key={index}>
                        <p>Aerobic Training {index + 1}</p>
                    </div>
                ))}
                <button onClick={addAerobicSession}>Add Aerobic Training</button>
            </div>
            <div>
                <h2>Strength Training</h2>
                {strengthSessions.map((session, index) => (
                    <div key={index}>
                        <p>Strength Training {index + 1}</p>
                    </div>
                ))}
                <button onClick={addStrengthSession}>Add Strength Training</button>
            </div>
            <button onClick={goToMenu}>Back to Menu</button>
        </div>
    );
}

export default AddSession;

