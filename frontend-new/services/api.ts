import axios from 'axios';

// const API_URL = 'https://rocky-island-92759-454647932385.herokuapp.com';
const API_URL = 'http://127.0.0.1:5000';
// const API_URL = 'https://salty-journey-17763-cebfeab10e7b.herokuapp.com/'

// User authentication
export const registerUser = (registerData: object) =>
    axios.post(`${API_URL}/register`, registerData, { withCredentials: true });

export const loginUser = (loginData: object) =>
    axios.post(`${API_URL}/login`, loginData, { withCredentials: true });

// export const logoutUser = () =>
//     axios.post(`${API_URL}/logout`, { withCredentials: true });
export const logoutUser = () =>
    axios.post(`${API_URL}/logout`, {}, { withCredentials: true });


// === New User Profile Management ===

// Update user information (e.g., avatar, username)
export const updateUser = (userData: { avatar?: string; username?: string }) =>
    axios.post(`${API_URL}/update_user`, userData, { withCredentials: true });

export const updateUsername = (userData: {username?: string }) =>
    axios.post(`${API_URL}/update_username`, userData, { withCredentials: true });

// Workout data
export const addAerobicWorkout = (workoutData: object) =>
    axios.post(`${API_URL}/add_aerobic`, workoutData, { withCredentials: true });

export const addStrengthWorkout = (workoutData: object) =>
    axios.post(`${API_URL}/add_strength`, workoutData, { withCredentials: true });

// Workout session management
export const startWorkoutSession = () =>
    axios.post(`${API_URL}/start_session`, {}, { withCredentials: true });

export const endWorkoutSession = () =>
    axios.post(`${API_URL}/end_session`, {}, { withCredentials: true });

// Fetch unique exercise types
export const getStrengthExerciseTypes = () =>
    axios.get(`${API_URL}/strength_exercise_types`, { withCredentials: true });

export const getAerobicExerciseTypes = () =>
    axios.get(`${API_URL}/aerobic_exercise_types`, { withCredentials: true });

// Fetch workout progress
export const getStrengthProgress = (exerciseType: string) =>
    axios.get(`${API_URL}/workout_progress/${exerciseType}`, { withCredentials: true });

export const getAerobicProgress = (exerciseType: string) =>
    axios.get(`${API_URL}/aerobic_progress/${exerciseType}`, { withCredentials: true });

// Fetch all workouts
export const getAllWorkouts = () =>
    axios.get(`${API_URL}/all_workouts`, { withCredentials: true });

// AI Feedback
export const getWorkoutFeedback = () =>
    axios.get(`${API_URL}/workout_feedback`, { withCredentials: true });

// Location management
export const updateLocationConsent = (consent: boolean) =>
    axios.post(`${API_URL}/update_location_consent`, { consent }, { withCredentials: true });

export const updateLocation = (locationData: { latitude: number; longitude: number }) =>
    axios.post(`${API_URL}/update_location`, locationData, { withCredentials: true });

// Recommendation
export const getRecommendation = (userInput: string) =>
    axios.get(`${API_URL}/recommendation`, {
        params: { user_input: userInput },
        withCredentials: true,
    });

export const fetchUsername = () =>
    axios.get(`${API_URL}/get_username`, { withCredentials: true });
    


// Workout Plan Management
export const saveWorkoutPlan = (planData: object) =>
    axios.post(`${API_URL}/workout_plan`, { plan: planData }, { withCredentials: true });

export const fetchWorkoutPlan = async () => {
    try {
        const response = await axios.get(`${API_URL}/workout_plan`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching workout plan:", error);
        throw error;
    }
};

export const fetchWorkoutPlan_add = async (day: string) => {
    try {
      const response = await axios.get(`${API_URL}/workout_plan_add`, {
        params: { day },  // Pass the 'day' parameter
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching workout plan for adding strength:", error);
      throw error;
    }
  };



// Current Day Management
export const fetchCurrentDay = () =>
    axios.get(`${API_URL}/current_day`, { withCredentials: true });

export const updateCurrentDay = (currentDay: number) =>
    axios.put(`${API_URL}/current_day`, { current_day: currentDay }, { withCredentials: true });


export const generateWorkoutPlan = (coreLifts: object) =>
    axios.post(`${API_URL}/generate_workout_plan`, { core_lifts: coreLifts }, { withCredentials: true });


export const removeWorkoutPlan = async (): Promise<void> => {
    const response = await axios.delete(`${API_URL}/remove_workout_plan`, { withCredentials: true });
    if (response.status !== 200) {
        throw new Error('Failed to remove workout plan');
    }
};

// Avatar Upload
export const uploadAvatarToS3 = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/upload-avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
    });

    return response.data.url; // Returns the S3 URL of the uploaded avatar
};


export const fetchAvatar = async (): Promise<string | null> => {
    try {
        const response = await axios.get(`${API_URL}/get_avatar`, { withCredentials: true });
        return response.data.avatar; // Return only the avatar URL
    } catch (error) {
        console.error('Error fetching avatar:', error);
        throw error;
    }
};


export const fetchConsent = async (): Promise<boolean> => {
    try {
        const response = await axios.get(`${API_URL}/get_consent`, { withCredentials: true });
        return response.data.consent;
    } catch (error) {
        console.error('Error fetching location consent:', error);
        throw error;
    }
}

export const fetchGymActivity = async (year: number, month: number) => {
    try {
        const response = await axios.get(`${API_URL}/gym_activity`, {
            params: {
                year,
                month,
            },
            withCredentials: true, // Include cookies for authenticated requests
        });
        return response.data; // Return the API response data
    } catch (error) {
        console.error('Error fetching gym activity:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};


export async function checkAuth(): Promise<{ authenticated: boolean; user?: { username: string; avatar: string } }> {
    try {
        const response = await axios.get(`${API_URL}/auth_check`, {
            method: 'GET',
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error("Error checking authentication:", error);
        return { authenticated: false };
    }
}
