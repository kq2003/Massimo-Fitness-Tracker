# MASSIMO-FITNESS-TRACKER

## Project Overview
Massimo-Fitness-Tracker is an AI-powered application that leverages pose estimation and motion tracking to analyze and improve users' workout techniques through video analysis.

## Directory Structure

### `/app`
Contains the Flask application's Python code.

- `__init__.py`: Initializes the Flask app and its configurations.
- `models.py`: Defines the database models for the application.
- `routes.py`: Contains all endpoint definitions for the API.
- `services.py`: Business logic for processing data and interfacing with the database.

### `/flask_session`
This directory manages the session configurations and data for Flask.

### `/frontend`
React-based frontend application.

#### `/src`
Source files for the React application.

- `/api`
  - `index.js`: API calls interfacing with the Flask backend.
  
- `/components`
  - `AerobicProgressPlot.js`: Component for displaying aerobic workout progress.
  - `ListAllWorkout.js`: Component to list all workout sessions.
  - `StrengthProgressPlot.js`: Displays strength training progress.
  - `UserAuth.js`: Handles user authentication.

- `/pages`
  - `AddSession.js`: Page to add new workout sessions.
  - `Menu.js`: Main menu for navigation.
  - `QueryData.js`: Interface for querying detailed data.

- `App.js`: Root component integrating all pages.
- `index.js`: Entry point for the React app.

### `/public`
Stores static files like HTML, logos, and the manifest.

### `/node_modules`
Dependencies for the React application (not tracked in version control).

## Setup Instructions

1. **Backend Setup**
   - Navigate to the `app` directory.
   - Set up a virtual environment and install dependencies.
   - Ensure the database is configured according to `models.py`.
   - Run `flask run` to start the backend server.

2. **Frontend Setup**
   - Navigate to the `frontend` directory.
   - Run `npm install` to install dependencies.
   - Use `npm start` to launch the React application.

## Usage

- Start both the Flask backend and the React frontend.
- Navigate to `localhost:3000` to access the web interface.

## Contributing
Contributions are welcome. Please fork the project and submit a pull request.

## License
Specify your project's license here, typically MIT for open-source projects.


