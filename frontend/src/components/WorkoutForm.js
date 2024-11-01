import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser, addAerobicWorkout, addStrengthWorkout, logoutUser } from '../api';

function WorkoutForm() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [workoutType, setWorkoutType] = useState('aerobic');
    const [formData, setFormData] = useState({
        type: '', duration: '', calories_burnt: '', heart_rate: '',
        reps: '', weight: '', rest_time: ''
    });

    const navigate = useNavigate(); // Import and define navigate here

    // Handle changes in registration form
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle registration form submission
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(registerData);
            alert('User registered successfully! Please log in.');
            setShowRegister(false); // Go back to login after registering
        } catch (error) {
            alert('Registration failed. Try a different email or username.');
        }
    };

    // Handle changes in login form
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle login form submission
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            await loginUser(loginData);
            setIsLoggedIn(true);
            alert('Logged in successfully!');
            navigate('/menu'); // Redirect to menu after login
        } catch (error) {
            alert('Invalid login credentials');
        }
    };

    // Handle workout form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle workout form submission
    const handleWorkoutSubmit = async (e) => {
        e.preventDefault();
        try {
            if (workoutType === 'aerobic') {
                await addAerobicWorkout({
                    type: formData.type,
                    duration: formData.duration,
                    calories_burnt: formData.calories_burnt,
                    heart_rate: formData.heart_rate,
                });
                alert('Aerobic workout added successfully!');
            } else {
                await addStrengthWorkout({
                    type: formData.type,
                    reps: formData.reps,
                    weight: formData.weight,
                    rest_time: formData.rest_time,
                });
                alert('Strength workout added successfully!');
            }
            setFormData({ type: '', duration: '', calories_burnt: '', heart_rate: '', reps: '', weight: '', rest_time: '' });
        } catch (error) {
            alert('Failed to add workout.');
        }
    };

    // Handle logout
    const handleLogout = async () => {
        await logoutUser();
        setIsLoggedIn(false);
        alert('Logged out successfully!');
    };

    return (
        <div>
            {!isLoggedIn ? (
                showRegister ? (
                    <form onSubmit={handleRegisterSubmit}>
                        <h2>Register</h2>
                        <input type="text" name="username" value={registerData.username} onChange={handleRegisterChange} placeholder="Username" required />
                        <input type="email" name="email" value={registerData.email} onChange={handleRegisterChange} placeholder="Email" required />
                        <input type="password" name="password" value={registerData.password} onChange={handleRegisterChange} placeholder="Password" required />
                        <button type="submit">Register</button>
                        <button type="button" onClick={() => setShowRegister(false)}>Go to Login</button>
                    </form>
                ) : (
                    <form onSubmit={handleLoginSubmit}>
                        <h2>Login</h2>
                        <input type="email" name="email" value={loginData.email} onChange={handleLoginChange} placeholder="Email" required />
                        <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} placeholder="Password" required />
                        <button type="submit">Log In</button>
                        <button type="button" onClick={() => setShowRegister(true)}>Register</button>
                    </form>
                )
            ) : (
                <>
                    <button onClick={handleLogout}>Logout</button>
                    <form onSubmit={handleWorkoutSubmit}>
                        <h2>Add Workout</h2>
                        <label>
                            Workout Type:
                            <select value={workoutType} onChange={(e) => setWorkoutType(e.target.value)}>
                                <option value="aerobic">Aerobic</option>
                                <option value="strength">Strength</option>
                            </select>
                        </label>
                        <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="Exercise Type" required />
                        {workoutType === 'aerobic' ? (
                            <>
                                <input type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (minutes)" required />
                                <input type="number" name="calories_burnt" value={formData.calories_burnt} onChange={handleChange} placeholder="Calories Burnt" required />
                                <input type="number" name="heart_rate" value={formData.heart_rate} onChange={handleChange} placeholder="Heart Rate (optional)" />
                            </>
                        ) : (
                            <>
                                <input type="number" name="reps" value={formData.reps} onChange={handleChange} placeholder="Reps" required />
                                <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight" required />
                                <input type="number" name="rest_time" value={formData.rest_time} onChange={handleChange} placeholder="Rest Time (seconds)" required />
                            </>
                        )}
                        <button type="submit">Add Workout</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default WorkoutForm;

