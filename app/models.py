from flask_login import UserMixin
from datetime import datetime
from app import db

# User model
class User(db.Model, UserMixin):
    __tablename__ = 'users'  # Make sure the table name is set to 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

    # Relationships
    daily_data = db.relationship('DailyData', backref='user', lazy=True)  # Fix backref to 'user'
    aerobic_trainings = db.relationship('AerobicTraining', backref='user', lazy=True)  # Fix backref to 'user'
    strength_trainings = db.relationship('StrengthTraining', backref='user', lazy=True)  # Fix backref to 'user'

# Aerobic training schema
class AerobicTraining(db.Model):
    __tablename__ = 'aerobic_training'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    calories_burnt = db.Column(db.Integer, nullable=False)
    heart_rate = db.Column(db.Integer, nullable=True)  # Optional heart rate info
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

# Strength training schema
class StrengthTraining(db.Model):
    __tablename__ = 'strength_training'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(100), nullable=False)
    sets = db.Column(db.Integer, nullable=False)
    reps = db.Column(db.Integer, nullable=False)
    rest_time = db.Column(db.Integer, nullable=False)  # Rest time between sets (in seconds)
    effort_level = db.Column(db.String(100), nullable=False)  # How hard one pushed (e.g., RPE, notes)
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




