import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://127.0.0.1:5000';

// User authentication
export const registerUser = (registerData) => axios.post(`${API_URL}/register`, registerData, { withCredentials: true });
export const loginUser = (loginData) => axios.post(`${API_URL}/login`, loginData, { withCredentials: true });
export const logoutUser = () => axios.get(`${API_URL}/logout`, { withCredentials: true });

// Workout data
export const addAerobicWorkout = (workoutData) => axios.post(`${API_URL}/add_aerobic`, workoutData, { withCredentials: true });
export const addStrengthWorkout = (workoutData) => axios.post(`${API_URL}/add_strength`, workoutData, { withCredentials: true });

// New functionalities for workout session management
export const startWorkoutSession = () => axios.post(`${API_URL}/start_session`, {}, { withCredentials: true });
export const endWorkoutSession = () => axios.post(`${API_URL}/end_session`, {}, { withCredentials: true });

// Query workout data
export const getWorkoutData = () => axios.get(`${API_URL}/workout_data`, { withCredentials: true });
export const getAerobicData = () => axios.get(`${API_URL}/aerobic_data`, { withCredentials: true });
export const getStrengthData = () => axios.get(`${API_URL}/strength_data`, { withCredentials: true });

// Fetch unique exercise types for dropdown
export const getExerciseTypes = () => axios.get(`${API_URL}/exercise_types`, { withCredentials: true });

// Fetch progress data for a specific exercise type
export const getExerciseProgress = (exerciseType) =>
    axios.get(`${API_URL}/workout_progress/${exerciseType}`, { withCredentials: true });


// Placeholder for AI feedback functionality
export const getWorkoutFeedback = () => axios.get(`${API_URL}/workout_feedback`, { withCredentials: true });




