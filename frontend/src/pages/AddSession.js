import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAerobicWorkout, addStrengthWorkout } from '../api';

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
        <div>
            <h1>Add a Workout Session</h1>

            <div>
                <h2>Aerobic Training</h2>
                {aerobicSessions.map((session, index) => (
                    <div key={index} style={{ border: '1px solid gray', padding: '10px', margin: '10px 0' }}>
                        <h3>Aerobic Session {index + 1}</h3>
                        <input
                            type="text"
                            name="type"
                            placeholder="Exercise Type"
                            value={session.type}
                            onChange={(e) => handleAerobicChange(index, e)}
                            required
                        />
                        <input
                            type="number"
                            name="duration"
                            placeholder="Duration (minutes)"
                            value={session.duration}
                            onChange={(e) => handleAerobicChange(index, e)}
                            required
                        />
                        <input
                            type="number"
                            name="calories_burnt"
                            placeholder="Calories Burnt"
                            value={session.calories_burnt}
                            onChange={(e) => handleAerobicChange(index, e)}
                            required
                        />
                        <input
                            type="number"
                            name="heart_rate"
                            placeholder="Heart Rate (optional)"
                            value={session.heart_rate}
                            onChange={(e) => handleAerobicChange(index, e)}
                        />
                        <button onClick={() => deleteAerobicSession(index)}>Delete Aerobic Session</button>
                    </div>
                ))}
                <button onClick={addAerobicSession}>Add Aerobic Training Slot</button>
                <button onClick={submitAerobicSessions}>Submit Aerobic Workouts</button>
            </div>

            <div>
                <h2>Strength Training</h2>
                {strengthSessions.map((session, index) => (
                    <div key={index} style={{ border: '1px solid gray', padding: '10px', margin: '10px 0' }}>
                        <h3>Strength Session {index + 1}</h3>
                        <input
                            type="text"
                            name="type"
                            placeholder="Exercise Type"
                            value={session.type}
                            onChange={(e) => handleStrengthChange(index, e)}
                            required
                        />
                        <input
                            type="number"
                            name="reps"
                            placeholder="Reps"
                            value={session.reps}
                            onChange={(e) => handleStrengthChange(index, e)}
                            required
                        />
                        <input
                            type="number"
                            name="weight"
                            placeholder="Weight (kg)"
                            value={session.weight}
                            onChange={(e) => handleStrengthChange(index, e)}
                            required
                        />
                        <input
                            type="number"
                            name="rest_time"
                            placeholder="Rest Time (seconds)"
                            value={session.rest_time}
                            onChange={(e) => handleStrengthChange(index, e)}
                            required
                        />
                        <input
                            type="text"
                            name="effort_level"
                            placeholder="Effort Level (e.g., RPE)"
                            value={session.effort_level}
                            onChange={(e) => handleStrengthChange(index, e)}
                            required
                        />
                        <button onClick={() => deleteStrengthSession(index)}>Delete Strength Session</button>
                    </div>
                ))}
                <button onClick={addStrengthSession}>Add Strength Training Slot</button>
                <button onClick={submitStrengthSessions}>Submit Strength Workouts</button>
            </div>

            <button onClick={goToMenu}>Back to Menu</button>
        </div>
    );
}

export default AddSession;

