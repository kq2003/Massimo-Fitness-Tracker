import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

export const registerUser = (registerData) => axios.post(`${API_URL}/register`, registerData, { withCredentials: true });
export const loginUser = (loginData) => axios.post(`${API_URL}/login`, loginData, { withCredentials: true });
export const logoutUser = () => axios.get(`${API_URL}/logout`, { withCredentials: true });
export const addAerobicWorkout = (workoutData) => axios.post(`${API_URL}/add_aerobic`, workoutData, { withCredentials: true });
export const addStrengthWorkout = (workoutData) => axios.post(`${API_URL}/add_strength`, workoutData, { withCredentials: true });

