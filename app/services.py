from config import Config
from app import db
from app.models import AerobicTraining, StrengthTraining, User
from collections import defaultdict
# from llama_index.core import PromptTemplate
from llama_index.llms.openai import OpenAI
from llama_index.core.llms import ChatMessage, MessageRole
import time
import os


# from llama_index import GPTVectorStoreIndex, Document
# from app.models import AerobicTraining, StrengthTraining
# from datetime import datetime


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


from pathlib import Path
from llama_index.core import StorageContext, VectorStoreIndex
from llama_index.core import load_index_from_storage

def generate_llm_recommendation(user_id, user_input, indices_dir: str):
    """
    Generate personalized recommendations and answers based on the user's workout data and multiple PDF indices.
    """
    # Fetch user strength training data
    strength_sessions = get_strength_training(user_id)

    if not strength_sessions:
        return "No workout data available for recommendations."

    # Prepare a summary of strength workouts
    strength_summary = [
        {
            "type": s.type,
            "reps": s.reps,
            "weight": s.weight,
            "date": s.date.strftime("%Y-%m-%d"),
        }
        for s in strength_sessions
    ]

    # Load all indices from the specified directory
    indices = []
    start_time = time.time()
    index_paths = Path(indices_dir).glob("*")  # Assuming each index is in a separate directory
    print(f"Directory scanning time: {time.time() - start_time}s")
    for index_path in index_paths:
        if index_path.is_dir():
            try:
                print(f"Attempting to load index from: {index_path}")
                storage_context = StorageContext.from_defaults(persist_dir=str(index_path))
                index = load_index_from_storage(storage_context)
                indices.append(index)
                print(f"Successfully loaded index from: {index_path}")
            except Exception as e:
                print(f"Error loading index from {index_path}: {e}")
    
    if not indices:
        return "No indices available for querying."

    # Aggregate responses from all indices
    pdf_responses = []
    for index in indices:
        pdf_query_engine = index.as_query_engine()
        try:
            pdf_response = pdf_query_engine.query(
                f"What are some insights related to: {user_input}?"
            )
            pdf_responses.append(pdf_response.response)
        except Exception as e:
            print(f"Error querying index: {e}")
            pdf_responses.append("Error querying this index.")

    # Combine all PDF insights
    combined_pdf_responses = "\n".join(pdf_responses)

    # Construct the prompt
   # Construct the refined prompt
    prompt = f"""
    You are a personal fitness assistant helping users optimize their workouts. Use the user's workout data and insights from documents to answer their question and provide practical advice.

    User's Workout History:
    {strength_summary}

    Insights from Documents:
    {combined_pdf_responses}

    User Query:
    {user_input}

    Provide concise, actionable advice specific to the user's situation. It must NOT be general; must be specific and related to user's data and workout history.
    """


    # Use OpenAI for generating the recommendation
    messages = [
        ChatMessage(role=MessageRole.SYSTEM, content="You are a personal fitness assistant."),
        ChatMessage(role=MessageRole.USER, content=prompt)
    ]

    llm = OpenAI(api_key=os.getenv("OPENAI_API_KEY"), model="gpt-3.5-turbo")
    response = llm.chat(messages)
    return response.message.content





