from datetime import datetime
from app import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    workouts = db.relationship('Workout', backref='user', lazy=True)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"

class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    workout_type = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # Duration in minutes
    calories_burned = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Workout('{self.workout_type}', '{self.duration}')"
