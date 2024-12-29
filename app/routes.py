from flask import Blueprint, request, jsonify, make_response
from flask_login import login_required, current_user, login_user, logout_user
from app.models import User, Location, UserWorkoutProgress, WorkoutPlan
from app.services import (
    add_aerobic_training, get_aerobic_training, update_aerobic_training, delete_aerobic_training,
    add_strength_training, get_strength_training, update_strength_training, delete_strength_training, get_strength_training_by_exercise,
    get_unique_aerobic_exercise_types, get_unique_strength_exercise_types, get_aerobic_progress, get_all_workouts,
    generate_llm_recommendation
)
from app import bcrypt, db
from flask_cors import cross_origin
from datetime import datetime
from llama_index.llms.openai import OpenAI
from llama_index.core.llms import ChatMessage, MessageRole
from config import Config
import json


main = Blueprint('main', __name__)

@main.route('/register', methods=['POST'])
# @cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
def register():
    from app import db
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

# @main.route('/login', methods=['POST'])
# # @cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
# def login():
#     data = request.get_json()
#     user = User.query.filter_by(email=data['email']).first() #TODO Alex: is filtering by email enough?
    
#     if user and bcrypt.check_password_hash(user.password, data['password']):
#         login_user(user)
#         response = make_response(jsonify({
#             'message': 'Logged in successfully',
#             'locationConsent': user.location_consent,
#             'needsConsent': user.location_consent is None
#         }), 200)
#         return response
#     else:
#         return jsonify({'message': 'Invalid credentials'}), 401

from sqlalchemy import or_

@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data['email']  # Can be either email or username
    user = User.query.filter(or_(User.email == identifier, User.username == identifier)).first()

    if user and bcrypt.check_password_hash(user.password, data['password']):
        login_user(user)
        response = make_response(jsonify({
            'message': 'Logged in successfully',
            'locationConsent': user.location_consent,
            'needsConsent': user.location_consent is None,
            'username': user.username,
            'avatar': user.avatar
        }), 200)
        return response
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
    

@main.route('/update_user', methods=['POST'])
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


@main.route('/logout', methods=['POST'])
@cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

@main.route('/add_aerobic', methods=['POST'])
# @cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
@login_required
def add_aerobic():
    data = request.get_json()
    aerobic_session = add_aerobic_training(data, current_user.id)
    return jsonify({'message': 'Aerobic training added', 'id': aerobic_session.id}), 201


@main.route('/get_username', methods=['GET'])
@login_required
def get_username():
    if not current_user.is_authenticated:
        return jsonify({'error': 'User not authenticated'}), 401

    return jsonify({'username': current_user.username}), 200


@main.route('/get_aerobic', methods=['GET'])
@login_required
def get_aerobic():
    sessions = get_aerobic_training(current_user.id)
    result = [{'type': s.type, 'duration': s.duration, 'calories_burnt': s.calories_burnt} for s in sessions]
    return jsonify(result), 200

@main.route('/update_aerobic/<int:aerobic_id>', methods=['PUT'])
@login_required
def update_aerobic(aerobic_id):
    updates = request.get_json()
    session = update_aerobic_training(aerobic_id, updates)
    if session:
        return jsonify({'message': 'Aerobic training updated successfully'}), 200
    return jsonify({'message': 'Session not found'}), 404

@main.route('/delete_aerobic/<int:aerobic_id>', methods=['DELETE'])
@login_required
def delete_aerobic(aerobic_id):
    success = delete_aerobic_training(aerobic_id)
    if success:
        return jsonify({'message': 'Aerobic training deleted successfully'}), 200
    return jsonify({'message': 'Session not found'}), 404

@main.route('/add_strength', methods=['POST'])
# @cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
@login_required
def add_strength():
    data = request.get_json()
    strength_session = add_strength_training(data, current_user.id)
    return jsonify({'message': 'Strength training added', 'id': strength_session.id}), 201

@main.route('/get_strength', methods=['GET'])
@cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
@login_required
def get_strength():
    sessions = get_strength_training(current_user.id)
    result = [{'type': s.type, 'reps': s.reps, 'weight': s.weight, 'rest_time': s.rest_time, 'effort_level': s.effort_level} for s in sessions]
    return jsonify(result), 200

@main.route('/update_strength/<int:strength_id>', methods=['PUT'])
@cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
@login_required
def update_strength(strength_id):
    updates = request.get_json()
    session = update_strength_training(strength_id, updates)
    if session:
        return jsonify({'message': 'Strength training updated successfully'}), 200
    return jsonify({'message': 'Session not found'}), 404

@main.route('/delete_strength/<int:strength_id>', methods=['DELETE'])
@cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
@login_required
def delete_strength(strength_id):
    success = delete_strength_training(strength_id)
    if success:
        return jsonify({'message': 'Strength training deleted successfully'}), 200
    return jsonify({'message': 'Session not found'}), 404



# @main.route('/workout_progress/<exercise_type>', methods=['GET'])
# @login_required
# def workout_progress(exercise_type):
#     sessions = get_strength_training_by_exercise(current_user.id, exercise_type)

#     data = {}
#     for session in sessions:
#         date_str = session.date.strftime("%Y-%m-%d")
#         if date_str not in data:
#             data[date_str] = []
#         data[date_str].append({
#             'reps': session.reps,
#             'weight': session.weight,
#             'rest_time': session.rest_time,
#             'effort_level': session.effort_level,
#         })

#     response = {
#         "dates": list(data.keys()),
#         "first_set_weights": [sets[0]['weight'] for sets in data.values()],
#         "first_set_reps": [sets[0]['reps'] for sets in data.values()],
#         "details": data  # All sets per day
#     }
#     return jsonify(response), 200
@main.route('/workout_progress/<exercise_type>', methods=['GET'])
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


def calculate_1rm(weight, reps):
    """Calculate 1RM using Epley formula."""
    return weight * (1 + reps / 30)


@main.route('/strength_exercise_types', methods=['GET'])
@login_required
def get_strength_exercise_types():
    strength_types = get_unique_strength_exercise_types()
    return jsonify(strength_types), 200

@main.route('/aerobic_exercise_types', methods=['GET'])
@login_required
def get_aerobic_exercise_types():
    aerobic_types = get_unique_aerobic_exercise_types()
    return jsonify(aerobic_types), 200


@main.route('/aerobic_progress/<exercise_type>', methods=['GET'])
@login_required
def aerobic_progress(exercise_type):
    """Route for fetching aerobic training progress data for a specific exercise."""
    response = get_aerobic_progress(current_user.id, exercise_type)
    return jsonify(response), 200

@main.route('/all_workouts', methods=['GET'])
@login_required
def all_workouts():
    """Route for fetching all workouts for the listed display view."""
    workouts = get_all_workouts(current_user.id)
    return jsonify(workouts), 200

@main.route('/update_location_consent', methods=['POST'])
@login_required
def update_location_consent():
    data = request.get_json()
    current_user.location_consent = data.get('consent')
    from app import db #TODO Alex: is this valid? Should I implement another layer at service?
    db.session.commit()
    return jsonify({'message': 'Location consent updated'}), 200


@main.route('/update_location', methods=['POST'])
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




@main.route('/workout_plan', methods=['POST'])
@login_required
def save_workout_plan():
    data = request.get_json()
    plan = data.get('plan')  # List of workout data per day

    if not plan:
        return jsonify({'error': 'Workout plan is required'}), 400

    # Delete old plan
    from app.models import WorkoutPlan
    WorkoutPlan.query.filter_by(user_id=current_user.id).delete()

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
    rotation = ['push', 'pull', 'legs', 'rest']
    progress = UserWorkoutProgress.query.filter_by(user_id=user.id).first()
    
    if not progress or not progress.generation_date:
        return None  # No workout plan generated yet
    
    days_elapsed = (datetime.utcnow().date() - progress.generation_date).days
    return rotation[days_elapsed % len(rotation)]


@main.route('/current_day', methods=['GET'])
@login_required
def get_current_day():
    day = get_current_workout_day(current_user)
    if not day:
        return jsonify({'current_day': None, 'message': 'Workout plan not generated yet.'}), 200
    return jsonify({'current_day': day.capitalize()}), 200

@main.route('/generate_workout_plan', methods=['POST'])
@login_required
def generate_workout_plan():
    data = request.get_json()
    core_lifts = data.get('core_lifts')

    if not core_lifts:
        return jsonify({'error': 'Core lifts data is required'}), 400

    # Updated prompt with clearer instructions and expected format
    prompt = f"""
    You are a personal fitness assistant. Generate a comprehensive 3-day Pull-Push-Leg workout split based on the following core lifts （1RM):

    - Bench Press: {core_lifts['bench']} kg
    - Pull-Ups: {core_lifts['pullUps']} reps
    - Deadlift: {core_lifts['deadlift']} kg
    - Back Squat: {core_lifts['squat']} kg
    - Shoulder Press: {core_lifts['shoulderPress']} kg

    Guidelines:
    1. Each day should follow the Pull-Push-Leg split.
    2. Include multiple exercises for each category: primary, secondary, and accessory.
    3. Ensure all exercises have appropriate sets, reps, and weights.
    4. Represent weights as numerical values in kilograms (e.g., 70.0).
    5. Include consistent fields: "exercise_name", "sets", "reps", "weight", "rest_time", and "effort_level" for each workout.
    6. Format the response as a valid JSON array enclosed within triple backticks and specify the language as JSON.
    7. For body weight exercises, such as pull ups, set weight as 0.
    8. Give reasonable value for the weights. For instance, if the inputted 1rm for bench press is 120kg, 5 sets of 5 reps with 100kg is reasonable; with 70kg isn't.

    Example Format:


    [
        {{
            "day": "push",
            "workouts": [
                {{
                    "exercise_name": "Bench Press",
                    "sets": 4,
                    "reps": 8,
                    "weight": 70.0,
                    "rest_time": 120,
                    "effort_level": 7
                }},
                {{
                    "exercise_name": "Incline Dumbbell Press",
                    "sets": 3,
                    "reps": 10,
                    "weight": 35.0,
                    "rest_time": 90,
                    "effort_level": 6
                }}
            ]
        }},
        {{
            "day": "pull",
            "workouts": [
                {{
                    "exercise_name": "Deadlift",
                    "sets": 4,
                    "reps": 6,
                    "weight": 100.0,
                    "rest_time": 180,
                    "effort_level": 8
                }},
                {{
                    "exercise_name": "Pull Up",
                    "sets": 3,
                    "reps": 12,
                    "weight": 0.0,
                    "rest_time": 60,
                    "effort_level": 8
                }}

            ]
        }},
        {{
            "day": "leg",
            "workouts": [
                {{
                    "exercise_name": "Back Squat",
                    "sets": 4,
                    "reps": 8,
                    "weight": 80.0,
                    "rest_time": 120,
                    "effort_level": 7
                }}
            ]
        }}
    ]
    

    Ensure that the JSON is properly formatted and can be parsed without errors.
    """

    try:
        # Initialize the LLM with your API key and desired model
        llm = OpenAI(api_key=Config.OPENAI_API_KEY, model="gpt-3.5-turbo")
        messages = [
            ChatMessage(role=MessageRole.SYSTEM, content="You are a personal fitness assistant."),
            ChatMessage(role=MessageRole.USER, content=prompt)
        ]
        response = llm.chat(messages)
        workout_plan = response.message.content

        # Extract JSON from the response
        try:
            # Remove any code block formatting if present
            if workout_plan.startswith("```") and workout_plan.endswith("```"):
                workout_plan = "\n".join(workout_plan.split("\n")[1:-1])
            workout_plan_json = json.loads(workout_plan)
            print("Workout Plan JSON:", workout_plan_json)
        except json.JSONDecodeError as e:
            print("JSON Decode Error:", e)
            return jsonify({'error': 'Invalid response format from GPT. Please try again.'}), 500

        # Optional: Further validation to ensure structure matches expectations
        if not isinstance(workout_plan_json, list):
            return jsonify({'error': 'Workout plan should be a list of days.'}), 500

        for day in workout_plan_json:
            if not all(k in day for k in ("day", "workouts")):
                return jsonify({'error': 'Each day should have "day" and "workouts" keys.'}), 500
            if not isinstance(day["workouts"], list):
                return jsonify({'error': '"workouts" should be a list.'}), 500
            for workout in day["workouts"]:
                required_keys = ["exercise_name", "sets", "reps", "weight", "rest_time", "effort_level"]
                if not all(k in workout for k in required_keys):
                    return jsonify({'error': f'Each workout should have keys: {required_keys}.'}), 500

        # === Added Functionalities Start ===

        # 1. Delete existing workout plans for the user
        WorkoutPlan.query.filter_by(user_id=current_user.id).delete()

        # 2. Save the new workout plan to the database
        for day in workout_plan_json:
            day_name = day['day'].lower()
            for workout in day['workouts']:
                new_plan = WorkoutPlan(
                    user_id=current_user.id,
                    day=day_name,
                    exercise_name=workout['exercise_name'],
                    sets=workout['sets'],
                    reps=workout['reps'],
                    weight=workout['weight'],
                    rest_time=workout['rest_time'],
                    effort_level=workout['effort_level']
                )
                db.session.add(new_plan)

        # 3. Update or create UserWorkoutProgress with the current generation date
        progress = UserWorkoutProgress.query.filter_by(user_id=current_user.id).first()
        if progress:
            progress.generation_date = datetime.utcnow().date()
        else:
            progress = UserWorkoutProgress(
                user_id=current_user.id,
                generation_date=datetime.utcnow().date()
            )
            db.session.add(progress)

        db.session.commit()
        # === Added Functionalities End ===

        return jsonify({'plan': workout_plan_json}), 200
    except Exception as e:
        print("Error in generate_workout_plan:", e)
        return jsonify({'error': str(e)}), 500
