# from flask_login import UserMixin
# from datetime import datetime
# from app import db

# # User model
# class User(db.Model, UserMixin):
#     __tablename__ = 'users'
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(150), unique=True, nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     password = db.Column(db.String(60), nullable=False)
#     location_consent = db.Column(db.Boolean, default=None)
#     avatar = db.Column(db.String(250), nullable=True)

#     # Relationships
#     daily_data = db.relationship('DailyData', backref='user', lazy=True)
#     aerobic_trainings = db.relationship('AerobicTraining', backref='user', lazy=True)
#     strength_trainings = db.relationship('StrengthTraining', backref='user', lazy=True)
#     locations = db.relationship('Location', backref='user', lazy=True)
#     workout_plans = db.relationship('WorkoutPlan', backref='user_workout', lazy=True)
#     workout_progress = db.relationship(
#         'UserWorkoutProgress', backref='user_progress', lazy=True, uselist=False
#     )

# # Aerobic training schema
# class AerobicTraining(db.Model):
#     __tablename__ = 'aerobic_training'
#     id = db.Column(db.Integer, primary_key=True)
#     type = db.Column(db.String(100), nullable=False)
#     duration = db.Column(db.Integer, nullable=False)
#     calories_burnt = db.Column(db.Integer, nullable=False)
#     heart_rate = db.Column(db.Integer, nullable=True)
#     date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

# # Strength training schema
# class StrengthTraining(db.Model):
#     __tablename__ = 'strength_training'
#     id = db.Column(db.Integer, primary_key=True)
#     type = db.Column(db.String(100), nullable=False)  # Bench, Squat, etc.
#     reps = db.Column(db.Integer, nullable=False)
#     weight = db.Column(db.Float, nullable=False)
#     rest_time = db.Column(db.Integer, nullable=False)
#     effort_level = db.Column(db.Integer, nullable=False)  # RPE, etc.
#     date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

# # Daily data schema
# class DailyData(db.Model):
#     __tablename__ = 'daily_data'
#     id = db.Column(db.Integer, primary_key=True)
#     weight = db.Column(db.Float, nullable=False)
#     calories_intake = db.Column(db.Integer, nullable=False)
#     date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

# # Record user location data
# class Location(db.Model):
#     __tablename__ = 'locations'
#     id = db.Column(db.Integer, primary_key=True)
#     latitude = db.Column(db.Float, nullable=False)
#     longitude = db.Column(db.Float, nullable=False)
#     timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

# # Workout Plan schema
# class WorkoutPlan(db.Model):
#     __tablename__ = 'workout_plan'
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     day = db.Column(db.String(50), nullable=False)  # Changed from Integer to String
#     exercise_name = db.Column(db.String(100), nullable=False)
#     sets = db.Column(db.Integer, nullable=False)
#     reps = db.Column(db.Integer, nullable=False)
#     weight = db.Column(db.Float, nullable=False)
#     rest_time = db.Column(db.Integer, nullable=False)
#     effort_level = db.Column(db.Integer, nullable=False)  # RPE, etc.
#     date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

# # User Workout Progress schema
# class UserWorkoutProgress(db.Model):
#     __tablename__ = 'user_workout_progress'
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
#     current_day = db.Column(db.String(50), nullable=False)  # Changed to String to match 'pull', 'push', 'leg', 'rest'
#     last_updated = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


# app/models.py

from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    avatar = db.Column(db.String(200), nullable=True)
    location_consent = db.Column(db.Boolean, nullable=True)
    # Add other relevant fields

# Aerobic training schema
class AerobicTraining(db.Model):
    __tablename__ = 'aerobic_training'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    calories_burnt = db.Column(db.Integer, nullable=False)
    heart_rate = db.Column(db.Integer, nullable=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

# Strength training schema
class StrengthTraining(db.Model):
    __tablename__ = 'strength_training'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(100), nullable=False)  # Bench, Squat, etc.
    reps = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    rest_time = db.Column(db.Integer, nullable=False)
    effort_level = db.Column(db.Integer, nullable=False)  # RPE, etc.
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

# Daily data schema
class DailyData(db.Model):
    __tablename__ = 'daily_data'
    id = db.Column(db.Integer, primary_key=True)
    weight = db.Column(db.Float, nullable=False)
    calories_intake = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class WorkoutPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    day = db.Column(db.String(20), nullable=False)  # 'push', 'pull', 'legs', 'rest'
    exercise_name = db.Column(db.String(100), nullable=False)
    sets = db.Column(db.Integer, nullable=False)
    reps = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    rest_time = db.Column(db.Integer, nullable=False)  # in seconds
    effort_level = db.Column(db.Integer, nullable=False)  # RPE 1-10

class UserWorkoutProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    generation_date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date())
    # Removed 'current_day' as it will be computed dynamically

class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
