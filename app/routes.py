from flask import Blueprint, request, jsonify, make_response, redirect, url_for, session
from flask_login import login_required, current_user, login_user, logout_user
from app.models import User, Location, UserWorkoutProgress, WorkoutPlan, ActiveSessions
from app.custom_cors import use_cors
from app.services import (
    add_aerobic_training, get_aerobic_training, update_aerobic_training, delete_aerobic_training,
    add_strength_training, get_strength_training, update_strength_training, delete_strength_training, get_strength_training_by_exercise,
    get_unique_aerobic_exercise_types, get_unique_strength_exercise_types, get_aerobic_progress, get_all_workouts,
    generate_llm_recommendation
)
from app import bcrypt, db
#from flask_cors import cross_origin, CORS
from datetime import datetime
from llama_index.llms.openai import OpenAI
from llama_index.core.llms import ChatMessage, MessageRole
import os
import uuid
import boto3
from sqlalchemy import or_
from dotenv import load_dotenv


# loading necessary environment variables
load_dotenv()
bucket_name = os.getenv('S3_BUCKET_NAME')
access_key = os.getenv('S3_ACCESS_KEY')
secret_key = os.getenv('S3_SECRET_KEY')


main = Blueprint('main', __name__)
@main.route('/', methods=['POST'])
@use_cors()
def root():
    print("Welcome to Massimo")

# main route for registering a user
@main.route('/register', methods=['POST'])
@use_cors()
def register():
    from app import db
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

# main route for logging in a user
@main.route('/login', methods=['GET', 'POST'])
@use_cors()
def login():
    data = request.get_json()
    identifier = data['email']  # Can be either email or username
    user = User.query.filter(or_(User.email == identifier, User.username == identifier)).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        session_token = str(uuid.uuid4())
        existing_session = db.session.query(ActiveSessions).filter_by(user_id = user.id).first()
        if existing_session:
            existing_session.token = session_token
            existing_session.created_at = datetime.utcnow()
        else:
            new_session = ActiveSessions(user_id=user.id, token=session_token)
            db.session.add(new_session)
        db.session.commit()

        login_user(user)
        response = make_response(jsonify({
            'message': 'Logged in successfully',
            'locationConsent': user.location_consent,
            'needsConsent': user.location_consent is None,
            'username': user.username,
            'avatar': user.avatar
        }), 200)
        response.set_cookie(
            "session_token",
            session_token,
            httponly=True, 
            secure=True, 
            samesite='None' 
        )
        return response
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
    

# main route for updating a user (refreshing for avatar and username after updating)
@main.route('/update_user', methods=['POST'])
@use_cors()
@login_required
def update_user():
    data = request.get_json()
    if 'avatar' in data:
        current_user.avatar = data['avatar']
    if 'username' in data:
        current_user.username = data['username']
    from app import db
    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 200


# main route for logging out a user
@main.route('/logout', methods=['POST'])
@use_cors()
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200


# main route for adding an aerobic training session
@main.route('/add_aerobic', methods=['POST'])
@use_cors()
@login_required
def add_aerobic():
    data = request.get_json()
    aerobic_session = add_aerobic_training(data, current_user.id)
    return jsonify({'message': 'Aerobic training added', 'id': aerobic_session.id}), 201


# main route for getting the username of the current user
@main.route('/get_username', methods=['GET'])
@use_cors()
@login_required
def get_username():
    if not current_user.is_authenticated:
        return jsonify({'error': 'User not authenticated'}), 401

    return jsonify({'username': current_user.username}), 200


# main route for getting the aerobic training sessions of the current user
@main.route('/get_aerobic', methods=['GET'])
@use_cors()
@login_required
def get_aerobic():
    sessions = get_aerobic_training(current_user.id)
    result = [{'type': s.type, 'duration': s.duration, 'calories_burnt': s.calories_burnt} for s in sessions]
    return jsonify(result), 200


# main route for updating an aerobic training session
@main.route('/update_aerobic/<int:aerobic_id>', methods=['PUT'])
@use_cors()
@login_required
def update_aerobic(aerobic_id):
    updates = request.get_json()
    session = update_aerobic_training(aerobic_id, updates)
    if session:
        return jsonify({'message': 'Aerobic training updated successfully'}), 200
    return jsonify({'message': 'Session not found'}), 404


# main route for deleting an aerobic training session
@main.route('/delete_aerobic/<int:aerobic_id>', methods=['DELETE'])
@use_cors()
@login_required
def delete_aerobic(aerobic_id):
    success = delete_aerobic_training(aerobic_id)
    if success:
        return jsonify({'message': 'Aerobic training deleted successfully'}), 200
    return jsonify({'message': 'Session not found'}), 404


# main route for adding a strength training session
@main.route('/add_strength', methods=['POST'])
@use_cors()
@login_required
def add_strength():
    data = request.get_json()
    strength_session = add_strength_training(data, current_user.id)
    return jsonify({'message': 'Strength training added', 'id': strength_session.id}), 201


# main route for getting the strength training sessions of the current user
@main.route('/get_strength', methods=['GET'])
@use_cors()
@login_required
def get_strength():
    sessions = get_strength_training(current_user.id)
    result = [{'type': s.type, 'reps': s.reps, 'weight': s.weight, 'rest_time': s.rest_time, 'effort_level': s.effort_level} for s in sessions]
    return jsonify(result), 200


# main route for updating a strength training session
@main.route('/update_strength/<int:strength_id>', methods=['PUT'])
@use_cors()
@login_required
def update_strength(strength_id):
    updates = request.get_json()
    session = update_strength_training(strength_id, updates)
    if session:
        return jsonify({'message': 'Strength training updated successfully'}), 200
    return jsonify({'message': 'Session not found'}), 404


# main route for deleting a strength training session
@main.route('/delete_strength/<int:strength_id>', methods=['DELETE'])
@use_cors()
@login_required
def delete_strength(strength_id):
    success = delete_strength_training(strength_id)
    if success:
        return jsonify({'message': 'Strength training deleted successfully'}), 200
    return jsonify({'message': 'Session not found'}), 404


# main route for getting the progress of a specific strength exercise
@main.route('/workout_progress/<exercise_type>', methods=['GET'])
@use_cors()
@login_required
def workout_progress(exercise_type):
    sessions = get_strength_training_by_exercise(current_user.id, exercise_type)

    data = {}
    for session in sessions:
        date_str = session.date.strftime("%Y-%m-%d")
        if date_str not in data:
            data[date_str] = []
        # Append session details with calculated 1RM
        data[date_str].append({
            'reps': session.reps,
            'weight': session.weight,
            'rest_time': session.rest_time,
            'effort_level': session.effort_level,
            '1rm': session.weight * (1 + session.reps / 30),  # Calculate 1RM
            'volume': session.weight * session.reps

        })

    response = {
        "dates": list(data.keys()),
        "first_set_weights": [sets[0]['weight'] for sets in data.values()],
        "relative_intensities": [sets[0]['effort_level'] for sets in data.values()],
        "one_rep_maxes": [max(set['1rm'] for set in sets) for sets in data.values()],  # Max 1RM per day
        "details": data,  # All sets per day
        "total_volumes": [sum(set['volume'] for set in sets) for sets in data.values()]


    }

    print("Workout Progress Response:", response)

    return jsonify(response), 200


# main route for calculating 1RM
def calculate_1rm(weight, reps):
    """Calculate 1RM using Epley formula."""
    return weight * (1 + reps / 30)


@main.route('/strength_exercise_types', methods=['GET'])
@use_cors()
@login_required
def get_strength_exercise_types():
    strength_types = get_unique_strength_exercise_types()
    return jsonify(strength_types), 200

@main.route('/aerobic_exercise_types', methods=['GET'])
@use_cors()
@login_required
def get_aerobic_exercise_types():
    aerobic_types = get_unique_aerobic_exercise_types()
    return jsonify(aerobic_types), 200


@main.route('/aerobic_progress/<exercise_type>', methods=['GET'])
@use_cors()
@login_required
def aerobic_progress(exercise_type):
    """Route for fetching aerobic training progress data for a specific exercise."""
    response = get_aerobic_progress(current_user.id, exercise_type)
    return jsonify(response), 200

@main.route('/all_workouts', methods=['GET'])
@use_cors()
@login_required
def all_workouts():
    """Route for fetching all workouts for the listed display view."""
    workouts = get_all_workouts(current_user.id)
    return jsonify(workouts), 200

@main.route('/update_location_consent', methods=['POST'])
@use_cors()
@login_required
def update_location_consent():
    data = request.get_json()
    current_user.location_consent = data.get('consent')
    from app import db #TODO Alex: is this valid? Should I implement another layer at service?
    db.session.commit()
    return jsonify({'message': 'Location consent updated'}), 200


@main.route('/update_location', methods=['POST'])
@use_cors()
@login_required
def update_location():
    if not current_user.location_consent:
        return jsonify({'message': 'Location tracking not consented'}), 403
        
    data = request.get_json()
    new_location = Location(
        latitude=data.get('latitude'),
        longitude=data.get('longitude'),
        user_id=current_user.id
    )
    from app import db #TODO Alex: is this valid? Should I implement another layer at service?
    db.session.add(new_location)
    db.session.commit()
    return jsonify({'message': 'Location updated'}), 200


@main.route('/recommendation', methods=['GET'])
@use_cors()
@login_required
def recommendation():
    try:
        # Extract user_input from query parameters
        user_input = request.args.get("user_input")
        if not user_input:
            return jsonify({"error": "Missing 'user_input' query parameter"}), 400

        # Generate the recommendation
        recommendation = generate_llm_recommendation(current_user.id, user_input, indices_dir='./indices')
        return jsonify({"recommendation": recommendation}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@main.route('/update_username', methods=["POST"])
@use_cors()
@login_required
def update_username():
    try:
        data = request.get_json()
        new_username = data.get('username')

        if not new_username:
            return jsonify({"success": False, "error": "No username provided"}), 400

        current_user.username = new_username
        db.session.commit()
        return jsonify({"success": True, "username": new_username}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


@main.route('/update-email', methods=['POST', 'GET'])
@use_cors()
@login_required
def update_email():
    """
    Updates the current user's email (or other user fields)
    according to the JSON payload.
    """
    try:
        data = request.get_json()
        new_email = data['email']
        if 'email' in data:
            current_user.email = new_email
        if not new_email:
            return jsonify({"success": False, "error": "No email provided"}), 400
        db.session.commit()
        return jsonify({"success": True, "new_email": new_email}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@main.route('/workout_plan', methods=['POST'])
@use_cors()
@login_required
def save_workout_plan():
    data = request.get_json()
    plan = data.get('plan')  # List of workout data per day

    if not plan:
        return jsonify({'error': 'Workout plan is required'}), 400

    from app.models import WorkoutPlan
    existing_plan = WorkoutPlan.query.filter_by(user_id=current_user.id).first()
    if existing_plan:
        return jsonify({'message': 'Workout plan already exists'}), 200

    # Save new plan
    from app import db
    for day in plan:
        for exercise in day['workouts']:
            new_plan = WorkoutPlan(
                user_id=current_user.id,
                day=day['day'],
                exercise_name=exercise['exercise_name'],
                sets=exercise['sets'],
                reps=exercise['reps'],
                weight=exercise['weight'],
                rest_time=exercise['rest_time'],
                effort_level=exercise['effort_level']
            )
            db.session.add(new_plan)
    db.session.commit()
    return jsonify({'message': 'Workout plan saved successfully'}), 201



@main.route('/workout_plan', methods=['GET'])
@use_cors()
@login_required
def fetch_workout_plan():
    from app.models import WorkoutPlan
    plan = WorkoutPlan.query.filter_by(user_id=current_user.id).order_by(WorkoutPlan.day).all()
    
    result = {}
    for workout in plan:
        if workout.day not in result:
            result[workout.day] = []
        result[workout.day].append({
            'exercise_name': workout.exercise_name,
            'sets': workout.sets,
            'reps': workout.reps,
            'weight': workout.weight,
            'rest_time': workout.rest_time,
            'effort_level': workout.effort_level
        })
    
    # Convert the dictionary to a list of WorkoutDay objects
    plan_list = [{'day': day, 'workouts': workouts} for day, workouts in result.items()]
    
    return jsonify({'plan': plan_list}), 200


@main.route('/workout_plan_add', methods=['GET'])
@use_cors()
@login_required
def fetch_workout_plan_for_adding():
    from app.models import WorkoutPlan
    day = request.args.get('day')  # Optional: specific day e.g., 'pull'
    if not day:
        day = get_current_workout_day(current_user)
        if not day:
            return jsonify({'error': 'Workout plan not generated yet.'}), 400
    else:
        day = day.lower()

    plan = WorkoutPlan.query.filter_by(user_id=current_user.id, day=day).order_by(WorkoutPlan.exercise_name).all()

    if not plan:
        return jsonify({'error': f'No workout plan found for {day}.'}), 404

    workouts = [{
        'exercise_name': workout.exercise_name,
        'sets': [
            # Repeat the set data `workout.sets` times (with default values)
            {
                'reps': workout.reps, 
                'weight': workout.weight, 
                'restTime': workout.rest_time, 
                'effortLevel': workout.effort_level
            } for _ in range(workout.sets)  # This will repeat the set `workout.sets` times
        ],
        'reps': workout.reps,
        'weight': workout.weight,
        'rest_time': workout.rest_time,
        'effort_level': workout.effort_level
    } for workout in plan]

    print(workouts)

    return jsonify({'day': day.capitalize(), 'workouts': workouts}), 200





# app/routes.py

def get_current_workout_day(user):
    rotation = ['push', 'pull', 'leg', 'rest']
    progress = UserWorkoutProgress.query.filter_by(user_id=user.id).first()
    
    if not progress or not progress.generation_date:
        return None  # No workout plan generated yet
    
    days_elapsed = (datetime.utcnow().date() - progress.generation_date).days
    return rotation[days_elapsed % len(rotation)]


@main.route('/current_day', methods=['GET'])
@use_cors()
@login_required
def get_current_day():
    day = get_current_workout_day(current_user)
    if not day:
        return jsonify({'current_day': None, 'message': 'Workout plan not generated yet.'}), 200
    return jsonify({'current_day': day.capitalize()}), 200

@main.route('/favicon.ico')
@use_cors()
def favicon():
    return '', 204  # Respond with "No Content" for favicon requests


@main.route('/generate_workout_plan', methods=['POST'])
@use_cors()
@login_required
def generate_workout_plan():
    import json

    data = request.get_json()
    core_lifts = data.get('core_lifts')

    if not core_lifts:
        return jsonify({'error': 'Core lifts data is required'}), 400

    # Updated prompt with a specific example
    prompt = f"""
    You are a personal fitness assistant. Generate a comprehensive 3-day Pull-Push-Leg workout split based on the following core lifts (1RM):

    - Bench Press: {core_lifts['bench']} kg
    - Pull-Ups: {core_lifts['pullUps']} reps
    - Deadlift: {core_lifts['deadlift']} kg
    - Back Squat: {core_lifts['squat']} kg
    - Shoulder Press: {core_lifts['shoulderPress']} kg

    Guidelines:
    1. Each day must include at least 5 exercises. Ensure a variety of primary, secondary, and accessory exercises.
    2. Provide appropriate sets, reps, weights, rest times, and effort levels for each exercise.
    3. Use numerical values for weights in kilograms (e.g., 70.0). For bodyweight exercises like pull-ups, set weight to 0.
    4. Respond with valid JSON. Do not include any additional text, comments, or formatting.

    Example Output:

    Input:
    - Bench Press: 110 kg
    - Pull-Ups: 20 reps
    - Deadlift: 180 kg
    - Back Squat: 110 kg
    - Shoulder Press: 35 kg each side

    Output:
    ```json
    [
        {{
            "day": "pull",
            "workouts": [
                {{
                    "exercise_name": "Deadlift",
                    "sets": 4,
                    "reps": 5,
                    "weight": 160.0,
                    "rest_time": 180,
                    "effort_level": 8
                }},
                {{
                    "exercise_name": "Pull-Ups",
                    "sets": 4,
                    "reps": 10,
                    "weight": 10.0,
                    "rest_time": 120,
                    "effort_level": 7
                }},
                {{
                    "exercise_name": "Barbell Row",
                    "sets": 4,
                    "reps": 8,
                    "weight": 90.0,
                    "rest_time": 120,
                    "effort_level": 7
                }},
                {{
                    "exercise_name": "Face Pulls",
                    "sets": 3,
                    "reps": 12,
                    "weight": 25.0,
                    "rest_time": 90,
                    "effort_level": 6
                }},
                {{
                    "exercise_name": "Dumbbell Curls",
                    "sets": 3,
                    "reps": 10,
                    "weight": 15.0,
                    "rest_time": 90,
                    "effort_level": 6
                }}
            ]
        }},
        {{
            "day": "push",
            "workouts": [
                {{
                    "exercise_name": "Bench Press",
                    "sets": 4,
                    "reps": 6,
                    "weight": 95.0,
                    "rest_time": 180,
                    "effort_level": 8
                }},
                {{
                    "exercise_name": "Incline Dumbbell Press",
                    "sets": 4,
                    "reps": 8,
                    "weight": 32.5,
                    "rest_time": 120,
                    "effort_level": 7
                }},
                {{
                    "exercise_name": "Overhead Shoulder Press",
                    "sets": 4,
                    "reps": 8,
                    "weight": 30.0,
                    "rest_time": 120,
                    "effort_level": 7
                }},
                {{
                    "exercise_name": "Lateral Raises",
                    "sets": 3,
                    "reps": 12,
                    "weight": 10.0,
                    "rest_time": 90,
                    "effort_level": 6
                }},
                {{
                    "exercise_name": "Tricep Pushdowns",
                    "sets": 4,
                    "reps": 10,
                    "weight": 25.0,
                    "rest_time": 90,
                    "effort_level": 6
                }}
            ]
        }},
        {{
            "day": "leg",
            "workouts": [
                {{
                    "exercise_name": "Back Squat",
                    "sets": 4,
                    "reps": 6,
                    "weight": 100.0,
                    "rest_time": 180,
                    "effort_level": 8
                }},
                {{
                    "exercise_name": "Romanian Deadlifts",
                    "sets": 4,
                    "reps": 8,
                    "weight": 90.0,
                    "rest_time": 120,
                    "effort_level": 7
                }},
                {{
                    "exercise_name": "Leg Press",
                    "sets": 4,
                    "reps": 10,
                    "weight": 200.0,
                    "rest_time": 120,
                    "effort_level": 7
                }},
                {{
                    "exercise_name": "Walking Lunges",
                    "sets": 3,
                    "reps": 12,
                    "weight": 20.0,
                    "rest_time": 90,
                    "effort_level": 6
                }},
                {{
                    "exercise_name": "Calf Raises",
                    "sets": 4,
                    "reps": 15,
                    "weight": 60.0,
                    "rest_time": 60,
                    "effort_level": 6
                }}
            ]
        }}
    ]
    ```
    Ensure the response is valid JSON and follows the example format.
    """

    while True:
        try:
            # Initialize LLM
            llm = OpenAI(api_key=os.getenv("OPENAI_API_KEY"), model="gpt-3.5-turbo")
            messages = [
                ChatMessage(role=MessageRole.SYSTEM, content="You are a personal fitness assistant."),
                ChatMessage(role=MessageRole.USER, content=prompt)
            ]
            response = llm.chat(messages)
            workout_plan = response.message.content

            # Parse the JSON response
            if workout_plan.startswith("```") and workout_plan.endswith("```"):
                workout_plan = "\n".join(workout_plan.split("\n")[1:-1])

            workout_plan_json = json.loads(workout_plan)

            # Validate the plan
            valid = True
            for day in workout_plan_json:
                if len(day.get("workouts", [])) < 5:
                    valid = False
                    break

            if valid:
                progress = UserWorkoutProgress.query.filter_by(user_id=current_user.id).first()
                if progress:
                    progress.generation_date = datetime.utcnow().date()
                else:
                    print("bro")
                    progress = UserWorkoutProgress(
                        user_id=current_user.id,
                        generation_date=datetime.utcnow().date()
                    )
                    db.session.add(progress)
                db.session.commit()
                return jsonify({'plan': workout_plan_json}), 200
            
        except json.JSONDecodeError:
            # Regenerate if JSON is invalid
            print("Invalid JSON response. Regenerating...")

        except Exception as e:
            print(f"Error during plan generation: {e}")
            return jsonify({'error': str(e)}), 500
        



@main.route('/remove_workout_plan', methods=['DELETE'])
@use_cors()
@login_required
def remove_workout_plan():
    try:
        from app.models import WorkoutPlan, UserWorkoutProgress
        from app import db

        # Remove all workout plans for the current user
        WorkoutPlan.query.filter_by(user_id=current_user.id).delete()

        # Remove the user's workout progress
        UserWorkoutProgress.query.filter_by(user_id=current_user.id).delete()

        # Commit the changes to the database
        db.session.commit()

        return jsonify({'message': 'Workout plan and progress removed successfully.'}), 200
    except Exception as e:
        print(f"Error removing workout plan: {e}")
        return jsonify({'error': 'Failed to remove workout plan'}), 500

@main.route('/get_avatar', methods=['GET'])
@use_cors()
@login_required
def get_avatar():
    try:
        # Return only the avatar URL
        return jsonify({'avatar': current_user.avatar}), 200
    except Exception as e:
        print(f"Error fetching avatar: {e}")
        return jsonify({'error': 'Failed to fetch avatar'}), 500

# Initialize S3 client
s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('S3_ACCESS_KEY'),
    aws_secret_access_key=os.getenv('S3_SECRET_KEY')
)

# Route to upload avatar
@main.route('/upload-avatar', methods=['POST'])
@use_cors()
@login_required
def upload_avatar():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    bucket_name = os.getenv('S3_BUCKET_NAME')
    key = f"avatars/{current_user.id}/{file.filename}"  # Use user ID to ensure unique paths

    try:
        # Upload file to S3
        s3.upload_fileobj(
            file,
            bucket_name,
            key,
            ExtraArgs={"ContentType": file.content_type},
        )
        
        # Construct the S3 URL
        url = f"https://{bucket_name}.s3.amazonaws.com/{key}"

        # Update the user's avatar in the database
        current_user.avatar = url
        db.session.commit()

        return jsonify({'url': url}), 200
    except Exception as e:
        print(f"Error uploading avatar: {e}")
        return jsonify({'error': 'Failed to upload avatar'}), 500
    

@main.route('/get_consent', methods=['GET'])
@use_cors()
@login_required
def get_consent():
    print(current_user.location_consent)
    print(current_user.username)
    return jsonify({'consent': current_user.location_consent}), 200



@main.route('/gym_activity', methods=['GET'])
@use_cors()
@login_required
def get_gym_activity():
    try:
        from app.models import StrengthTraining, AerobicTraining
        year = int(request.args.get('year'))
        month = int(request.args.get('month'))

        # Fetch strength training sessions for the user in the specified month
        strength_trainings = StrengthTraining.query.filter_by(user_id=current_user.id).all()

        # Fetch aerobic training sessions for the user in the specified month
        aerobic_trainings = AerobicTraining.query.filter_by(user_id=current_user.id).all()

        # Combine the results from both tables
        activity = []

        # Add strength training sessions
        for s in strength_trainings:
            if s.date.year == year and s.date.month == month:
                activity.append({
                    'date': s.date.strftime('%Y-%m-%d'),
                    'workout_type': f"Strength - {s.type}"  # e.g., "Strength - Bench"
                })

        # Add aerobic training sessions
        for a in aerobic_trainings:
            if a.date.year == year and a.date.month == month:
                activity.append({
                    'date': a.date.strftime('%Y-%m-%d'),
                    'workout_type': f"Aerobic - {a.type}"  # e.g., "Aerobic - Running"
                })

        return jsonify({'activity': activity}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@main.route('/auth_check', methods=['GET'])
@use_cors()
def check_auth():
    if current_user.is_authenticated:
        return jsonify({"authenticated": True}), 200
    else:
        return jsonify({"authenticated": False}), 200
