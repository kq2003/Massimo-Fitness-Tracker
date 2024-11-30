import axios, { AxiosResponse } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://127.0.0.1:5000';

// Define interfaces for request payloads and responses
interface RegisterData {
    username: string;
    password: string;
    [key: string]: any; // For additional optional fields
}

interface LoginData {
    username: string;
    password: string;
}

interface WorkoutData {
    type: string;
    duration?: string;
    calories_burnt?: string;
    heart_rate?: string;
    reps?: string;
    weight?: string;
    rest_time?: string;
    effort_level?: string;
}

type ExerciseType = string;

// User authentication
export const registerUser = (registerData: RegisterData): Promise<AxiosResponse> =>
    axios.post(`${API_URL}/register`, registerData, { withCredentials: true });

export const loginUser = (loginData: LoginData): Promise<AxiosResponse> =>
    axios.post(`${API_URL}/login`, loginData, { withCredentials: true });

export const logoutUser = (): Promise<AxiosResponse> =>
    axios.get(`${API_URL}/logout`, { withCredentials: true });

// Workout data
export const addAerobicWorkout = (workoutData: WorkoutData): Promise<AxiosResponse> =>
    axios.post(`${API_URL}/add_aerobic`, workoutData, { withCredentials: true });

export const addStrengthWorkout = (workoutData: WorkoutData): Promise<AxiosResponse> =>
    axios.post(`${API_URL}/add_strength`, workoutData, { withCredentials: true });

// New functionalities for workout session management
export const startWorkoutSession = (): Promise<AxiosResponse> =>
    axios.post(`${API_URL}/start_session`, {}, { withCredentials: true });

export const endWorkoutSession = (): Promise<AxiosResponse> =>
    axios.post(`${API_URL}/end_session`, {}, { withCredentials: true });

// Fetch unique strength exercise types
export const getStrengthExerciseTypes = (): Promise<AxiosResponse<ExerciseType[]>> =>
    axios.get(`${API_URL}/strength_exercise_types`, { withCredentials: true });

// Fetch unique aerobic exercise types
export const getAerobicExerciseTypes = (): Promise<AxiosResponse<ExerciseType[]>> =>
    axios.get(`${API_URL}/aerobic_exercise_types`, { withCredentials: true });

// Fetch progress data for a specific exercise type
export const getStrengthProgress = (exerciseType: ExerciseType): Promise<AxiosResponse> =>
    axios.get(`${API_URL}/workout_progress/${exerciseType}`, { withCredentials: true });

// Placeholder for AI feedback functionality
export const getWorkoutFeedback = (): Promise<AxiosResponse> =>
    axios.get(`${API_URL}/workout_feedback`, { withCredentials: true });

// Fetch aerobic workout progress
export const getAerobicProgress = (exerciseType: ExerciseType): Promise<AxiosResponse> =>
    axios.get(`${API_URL}/aerobic_progress/${exerciseType}`, { withCredentials: true });

// Get details for all workouts
export const getAllWorkouts = (): Promise<AxiosResponse> =>
    axios.get(`${API_URL}/all_workouts`, { withCredentials: true });

export const getRecommendation = (userInput: string): Promise<AxiosResponse> =>
    axios.get<AxiosResponse>(`${API_URL}/recommendation`, {
      params: { user_input: userInput },
      withCredentials: true,
    })
