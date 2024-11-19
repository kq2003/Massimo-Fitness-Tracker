import boto3
from config import Config
from app import db
from app.models import AerobicTraining, StrengthTraining, DailyData
from sqlalchemy import distinct
from collections import defaultdict
import dspy
from llama_index.core import PromptTemplate
from llama_index.llms.openai import OpenAI
from llama_index.core.llms import ChatMessage, MessageRole

from transformers import pipeline


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


# # Define a prompt template for recommendations
# recommendation_prompt = PromptTemplate("""
# You are a fitness expert AI assistant. Based on the user's workout history, provide personalized advice for improving their performance and achieving their fitness goals.

# User Data:
# - Strength Exercises: {strength_exercises}
# - Aerobic Exercises: {aerobic_exercises}
# - Recent Progress: {recent_progress}
# - Daily Metrics: {daily_metrics}

# Recommendations:
# """)
# def generate_llm_recommendation(user_id, user_input):
#     # Fetch user strength and aerobic training data
#     strength_sessions = get_strength_training(user_id)
#     # aerobic_sessions = get_aerobic_training(user_id)

#     # Prepare summaries for strength and aerobic data
#     if not strength_sessions:
#         return "No workout data available for recommendations."

#     strength_summary = [
#         {
#             "type": s.type,
#             "reps": s.reps,
#             "weight": s.weight,
#             "date": s.date.strftime("%Y-%m-%d"),
#         }
#         for s in strength_sessions
#     ]

#     # aerobic_summary = [
#     #     {
#     #         "type": a.type,
#     #         "duration": a.duration,
#     #         "calories_burnt": a.calories_burnt,
#     #         "date": a.date.strftime("%Y-%m-%d"),
#     #     }
#     #     for a in aerobic_sessions
#     # ]

#     # Construct LLM prompt
#     prompt = f"""
#     You are a fitness expert AI assistant. Based on the user's workout history below, provide personalized and specific advice (list out previous weights and give specific weights for next workouts) to improve their performance for the next workout or long run; if you realized a plateau in strength improvements, please adjust workout accordingly (lower weights more volume):

#     Strength Workouts:
#     {strength_summary if strength_summary else "No strength data available."}

#     Recommendations:
#     """

#         # Construct LLM messages using ChatMessage
#     messages = [
#         ChatMessage(role=MessageRole.SYSTEM, content="You are a fitness expert AI assistant."),
#         ChatMessage(role=MessageRole.USER, content=prompt + user_input)
#     ]

#     # Initialize the LLM
#     llm = OpenAI(api_key=Config.OPENAI_API_KEY, model="gpt-3.5-turbo")
#     response = llm.chat(messages)

#     return response.message.content

#     # generator = pipeline("text-generation", model="gpt2")
#     # response = generator(prompt, max_length=300, num_return_sequences=1)
#     # return response[0]["generated_text"]



from llama_index.core import SimpleDirectoryReader, GPTVectorStoreIndex
from pathlib import Path

def create_pdf_index(pdf_path: str):
    """
    Create an index for the given PDF file using LlamaIndex.
    """
    # Check if the PDF exists
    if not Path(pdf_path).is_file():
        raise FileNotFoundError(f"{pdf_path} not found.")
    
    # Load the PDF into LlamaIndex
    documents = SimpleDirectoryReader(input_files=[pdf_path]).load_data()
    
    # Create an index from the PDF documents
    index = GPTVectorStoreIndex.from_documents(documents)
    return index

# Create the index (ensure this runs only once and is reused)
pdf_index = create_pdf_index("/Users/tonyqin/Desktop/progressive_overload.pdf")

def generate_llm_recommendation(user_id, user_input):
    """
    Generate personalized recommendations and answers based on the user's workout data and PDF knowledge.
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

    # Use the query engine to query the PDF index
    pdf_query_engine = pdf_index.as_query_engine()
    pdf_response = pdf_query_engine.query(
        f"What are some insights from progressive overload related to: {user_input}?"
    )

    # Construct the prompt
    prompt = f"""
    You are a fitness expert AI assistant. Your task is to provide highly personalized advice based on the user's past workout data and the principles of progressive overload. 
    Answer user-specific questions, provide feedback, and create targeted recommendations.

    User's Workout History:
    {strength_summary if strength_summary else "No strength data available."}

    Insights from Document:
    {pdf_response.response}

    User Query:
    {user_input}

    Guidelines:
    1. Tailor your response specifically to the user's question, incorporating their workout data and trends.
    2. If relevant, include progressive overload principles from the document to enhance your advice.
    3. Avoid generic responses; be as specific as possible.
    4. Provide actionable recommendations, plans, or feedback as needed.

    Answer:
    """

    # Use OpenAI for generating the recommendation
    messages = [
        ChatMessage(role=MessageRole.SYSTEM, content="You are a fitness expert AI assistant."),
        ChatMessage(role=MessageRole.USER, content=prompt)
    ]

    llm = OpenAI(api_key=Config.OPENAI_API_KEY, model="gpt-3.5-turbo")
    response = llm.chat(messages)
    return response.message.content

