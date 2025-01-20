# MASSIMO-FITNESS-TRACKER

## Project Overview
Massimo-Fitness-Tracker is an AI-powered gym application that helps user track and quantitizing their workout progress , create and edit their workout plans, find nearby gyms, and following the plan during workouts.
The form tracker functionality, which allows user to visualize their workout form in 3d pose animation, and get insights with recommendations from smart AI, by simply uploading 1 video.

## Directory Structure

### `/app`
Contains the Flask application's Python code.

- `__init__.py`: Initializes the Flask app and its configurations.
- `create_index.py`: Script for creating indices.
- `custom_cors.py`: Custom CORS configuration for the Flask app.
- `models.py`: Defines the database models for the application.
- `routes.py`: Contains all endpoint definitions for the API.
- `services.py`: Business logic for processing data and interfacing with the database.

### `/flask_session`
This directory manages the session configurations and data for Flask.

### `/frontend-new`
Next.js and React.js-based frontend application. Styles by Tailwind.css.

#### `/components`
Contains reusable UI components for the Next.js application.

- `ActivityCalendar.tsx`: Component for displaying activity calendar.
- `Header.tsx`: Header component for the application.
- `ui/`: Directory containing various UI components like buttons, forms, dialogs, etc.

#### `/pages`
Contains the main application pages for the Next.js application.

- `auth/`: Authentication-related pages.
- `query-data/`: Pages for querying workout data.
- `user-info/`: User profile and information pages.
- `workout-planning/`: Pages for planning workouts.
- `add_workout.tsx`: Page for adding new workout sessions.
- `list_all_workout.tsx`: Page for listing all workout sessions.
- 'avatar-upload.tsx': Page for user to upload their avatars to be displayed.
- 'form-tracker.tsx': Page for user to upload video to access "form tracker" functionality.

### `/public`
Stores static files like HTML, logos, and the manifest.

### `/node_modules`
Dependencies for the React application (not tracked in version control).

## Usage

### Local Development
- Start both the Flask backend and the Next.js frontend.
- Navigate to `localhost:3000` to access the web interface.

### Access deployed version of project
- Our current project is still under development, but we deployed the backend on heroku, and frontend on vercel.
- You can access our app demo on https://massimo-h4uyejjpr-aos-projects-2be27b28.vercel.app/.

## Setup Instructions

1. **Backend Setup**
   - Navigate to the `app` directory.
   - Set up a virtual environment and install dependencies using `pip install -r ../requirements.txt`.
   - Ensure the database is configured according to `models.py`.
   - Run the migrations using `flask db upgrade`.
   - Run `flask run` to start the backend server.

2. **Frontend Setup**
   - Navigate to the `frontend-new` directory.
   - Run `npm install` to install dependencies.
   - Use `npm run dev` to launch the Next.js application.

## Contributing
Contributions are welcome. Please fork the project and submit a pull request.

## License
Specify your project's license here, typically MIT for open-source projects.

