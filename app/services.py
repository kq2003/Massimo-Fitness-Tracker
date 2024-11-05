import boto3
from config import Config
from app import db
from app.models import AerobicTraining, StrengthTraining, DailyData
from sqlalchemy import distinct
from collections import defaultdict


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

def get_strength_training_by_exercise(user_id, exercise_type):
    return StrengthTraining.query.filter_by(user_id=user_id, type=exercise_type).order_by(StrengthTraining.date).all()

# Fetch unique strength exercise types
def get_unique_strength_exercise_types():
    # Query and directly return the list of distinct types
    result = db.session.query(StrengthTraining.type.distinct()).all()
    # Flatten the result to just get a list of types
    return [type[0] for type in result]

# Fetch unique aerobic exercise types
def get_unique_aerobic_exercise_types():
    result = db.session.query(AerobicTraining.type.distinct()).all()
    return [type[0] for type in result]



# Fetch aerobic progress based on exercise type for aerobic plot
def get_aerobic_progress(user_id, exercise_type):
    sessions = AerobicTraining.query.filter_by(user_id=user_id, type=exercise_type).all()
    data = {}
    for session in sessions:
        date_str = session.date.strftime("%Y-%m-%d")
        if date_str not in data:
            data[date_str] = []
        data[date_str].append({
            'duration': session.duration,
            'calories_burnt': session.calories_burnt,
            'heart_rate': session.heart_rate
        })

    response = {
        "dates": list(data.keys()),
        "durations": [sets[0]['duration'] for sets in data.values()],
        "details": data  # Include all session details per day
    }
    return response

# Fetch all workouts for listed display
def get_all_workouts(user_id):
    aerobic_sessions = db.session.query(AerobicTraining).filter_by(user_id=user_id).all()
    strength_sessions = db.session.query(StrengthTraining).filter_by(user_id=user_id).all()

    workouts = defaultdict(list)

    for session in aerobic_sessions:
        date_str = session.date.strftime("%Y-%m-%d")  # Include hours and minutes
        print(f"Aerobic Session Date: {date_str}") 
        workouts[date_str].append({
            "type": session.type,
            "date": session.date.strftime("%Y-%m-%d %H:%M"),
            "details": f"{session.duration} min, {session.calories_burnt} kcal, HR: {session.heart_rate}"
        })

    for session in strength_sessions:
        date_str = session.date.strftime("%Y-%m-%d")  # Include hours and minutes
        print(f"Strength Session Date: {date_str}") 
        workouts[date_str].append({
            "type": session.type,
            "date": session.date.strftime("%Y-%m-%d %H:%M"),
            "details": f"{session.reps} reps at {session.weight} kg, rest {session.rest_time} sec, Effort: {session.effort_level}"
        })

    # Sort each list of sessions by date (now with minutes) in ascending order
    for date in workouts:
        workouts[date] = sorted(workouts[date], key=lambda x: x["date"])


    return dict(workouts)

    




    



