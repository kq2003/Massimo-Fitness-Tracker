# **Massimo: AI-Powered Fitness Tracker (Prototype Phase)**

## **Overview**
Massimo is a fitness application designed to provide personalized workout feedback using advanced computer vision technology. This prototype focuses on delivering essential features such as exercise form analysis and progress tracking to help users optimize their workout routines in real time.

## **Features**
- **Computer Vision Exercise Analysis**: Real-time pose detection for selected exercises (e.g., squats, push-ups) using computer vision models.
- **Form Correction Feedback**: Basic feedback on exercise form, including joint angle assessment and posture.
- **Progress Tracking**: Tracks user workout metrics like repetitions and form accuracy over time.
- **Minimal User Interface**: Allows users to record and upload workout videos and view feedback and progress reports on a dashboard.

## **Technology Stack**
- **Front-End**:
  - **React**: Provides a responsive UI for video uploads and displaying workout progress.
  - **TypeScript**: Ensures type safety and scalability in the front-end codebase.
- **Back-End**:
  - **Flask/Django (Python)**: Lightweight API development for handling data storage, user registration, and feedback processing.
  - **PostgreSQL**: Manages user data, workout logs, and exercise statistics.
- **Computer Vision**:
  - **MediaPipe**: Pose detection for real-time exercise analysis.
  - **TensorFlow**: Backend processing of pose estimation models.
- **Cloud Infrastructure**:
  - **Amazon AWS**: Hosting for the back-end, database, and storage (S3, Lambda).
  - **Codium**: Cloud-optimized development environment.
- **GitHub Copilot**: Assisting in code generation and development.


