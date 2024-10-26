import boto3
from config import Config
from app import db
from app.models import AerobicTraining, StrengthTraining, DailyData


# Service for AerobicTraining
def add_aerobic_training(data, user_id):
    new_aerobic = AerobicTraining(
        type=data.get('type'),
        duration=data.get('duration'),
        calories_burnt=data.get('calories_burnt'),
        heart_rate=data.get('heart_rate'),
        user_id=user_id
    )
    db.session.add(new_aerobic)
    db.session.commit()
    return new_aerobic

def get_aerobic_training(user_id):
    return AerobicTraining.query.filter_by(user_id=user_id).all()

def update_aerobic_training(aerobic_id, updates):
    session = AerobicTraining.query.filter_by(id=aerobic_id).first()
    if session:
        for key, value in updates.items():
            setattr(session, key, value)
        db.session.commit()
        return session
    return None

def delete_aerobic_training(aerobic_id):
    session = AerobicTraining.query.filter_by(id=aerobic_id).first()
    if session:
        db.session.delete(session)
        db.session.commit()
        return True
    return False

# Service for StrengthTraining
def add_strength_training(data, user_id):
    new_strength = StrengthTraining(
        type=data.get('type'),
        reps=data.get('reps'),
        weight=data.get('weight'),  # Add weight instead of sets
        rest_time=data.get('rest_time'),
        effort_level=data.get('effort_level'),
        user_id=user_id
    )
    db.session.add(new_strength)
    db.session.commit()
    return new_strength

def get_strength_training(user_id):
    return StrengthTraining.query.filter_by(user_id=user_id).all()

def update_strength_training(strength_id, updates):
    session = StrengthTraining.query.filter_by(id=strength_id).first()
    if session:
        for key, value in updates.items():
            setattr(session, key, value)
        db.session.commit()
        return session
    return None

def delete_strength_training(strength_id):
    session = StrengthTraining.query.filter_by(id=strength_id).first()
    if session:
        db.session.delete(session)
        db.session.commit()
        return True
    return False

