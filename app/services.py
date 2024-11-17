import boto3
from config import Config
from app import db
from app.models import AerobicTraining, StrengthTraining, DailyData
from sqlalchemy import distinct
from collections import defaultdict
import dspy
from llama_index import GPTVectorStoreIndex, Document
from app.models import AerobicTraining, StrengthTraining
from datetime import datetime

def query_workout_data(index, workout_type=None, start_date=None, end_date=None):
    # Build the base query
    query = ""
    
    # Add filtering based on workout type (aerobic/strength)
    if workout_type:
        query += f"workout type: {workout_type} "
    
    # Add filtering based on date range (if provided)
    if start_date and end_date:
        query += f"from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}"
    
    # Query the index with the generated query string
    return index.query(query)


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


def get_workout_data(user_id):
    # Fetch aerobic and strength data for the user
    aerobic_sessions = get_aerobic_training(user_id)
    strength_sessions = get_strength_training(user_id)
    return aerobic_sessions, strength_sessions


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


# Create documents from aerobic and strength training data
def build_documents(aerobic_sessions, strength_sessions):
    documents = []
    for session in aerobic_sessions:
        doc = Document(
            text=f"Aerobic Training: {session.type}, Duration: {session.duration} min, Calories Burnt: {session.calories_burnt}")
        documents.append(doc)
    
    for session in strength_sessions:
        doc = Document(
            text=f"Strength Training: {session.type}, Reps: {session.reps}, Weight: {session.weight} kg")
        documents.append(doc)
        
    return documents

# Build the index from the workout data
def build_index(aerobic_sessions, strength_sessions):
    documents = build_documents(aerobic_sessions, strength_sessions)
    index = GPTVectorStoreIndex.from_documents(documents)
    return index

# Query workout data using the built index
def query_workout_data(index, query_text):
    return index.query(query_text)

def generate_feedback(workout_data):
    # You can include more logic based on user's workout performance
    prompt = f"Based on the user's workout data: {workout_data}, provide feedback and suggest improvements."
    
    # Generate feedback using Llama or another LLM
    feedback = dspy.LM("openai/gpt-4o-mini").predict(prompt)
    
    return feedback
    
def workout_recommendation_pipeline(user_id):
    # Step 1: Retrieve workout data using LlamaIndex
    aerobic_sessions, strength_sessions = get_workout_data(user_id)
    index = build_index(aerobic_sessions, strength_sessions)
    workout_data = query_workout_data(index, query_text="last 7 days workout data")
    
    # Step 2: Use DSPy to generate feedback based on retrieved workout data
    feedback = generate_feedback(workout_data)
    
    return feedback


def workout_recommendation_pipeline(user_id, workout_type=None, start_date=None, end_date=None):
    # Step 1: Retrieve workout data using LlamaIndex
    aerobic_sessions, strength_sessions = get_workout_data(user_id)
    
    # Build the index from the aerobic and strength sessions
    index = build_index(aerobic_sessions, strength_sessions)
    
    # Step 2: Query the index based on dynamic parameters
    workout_data = query_workout_data(index, workout_type=workout_type, start_date=start_date, end_date=end_date)
    
    # Step 3: Use DSPy to generate personalized feedback based on retrieved workout data
    feedback = generate_feedback(workout_data)
    
    return feedback




    



