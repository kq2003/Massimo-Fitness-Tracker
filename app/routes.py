from flask import Blueprint, request, jsonify, make_response
from flask_login import login_required, current_user, login_user, logout_user
from app.models import User
from app.services import (
    add_aerobic_training, get_aerobic_training, update_aerobic_training, delete_aerobic_training,
    add_strength_training, get_strength_training, update_strength_training, delete_strength_training, get_strength_training_by_exercise,
    get_unique_exercise_types
)
from app import bcrypt
from flask_cors import cross_origin

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

@main.route('/login', methods=['POST'])
# @cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and bcrypt.check_password_hash(user.password, data['password']):
        login_user(user)
        response = make_response(jsonify({'message': 'Logged in successfully'}), 200)
        return response
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@main.route('/logout', methods=['GET'])
# @cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
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

@main.route('/get_aerobic', methods=['GET'])
# @cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
@login_required
def get_aerobic():
    sessions = get_aerobic_training(current_user.id)
    result = [{'type': s.type, 'duration': s.duration, 'calories_burnt': s.calories_burnt} for s in sessions]
    return jsonify(result), 200

@main.route('/update_aerobic/<int:aerobic_id>', methods=['PUT'])
# @cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
@login_required
def update_aerobic(aerobic_id):
    updates = request.get_json()
    session = update_aerobic_training(aerobic_id, updates)
    if session:
        return jsonify({'message': 'Aerobic training updated successfully'}), 200
    return jsonify({'message': 'Session not found'}), 404

@main.route('/delete_aerobic/<int:aerobic_id>', methods=['DELETE'])
# @cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
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



@main.route('/workout_progress/<exercise_type>', methods=['GET'])
@login_required
def workout_progress(exercise_type):
    sessions = get_strength_training_by_exercise(current_user.id, exercise_type)

    data = {}
    for session in sessions:
        date_str = session.date.strftime("%Y-%m-%d")
        if date_str not in data:
            data[date_str] = []
        data[date_str].append({
            'reps': session.reps,
            'weight': session.weight,
            'rest_time': session.rest_time,
            'effort_level': session.effort_level,
            'volume': session.weight * session.reps  # Calculate volume
        })

    response = {
        "dates": list(data.keys()),
        "first_set_weights": [sets[0]['weight'] for sets in data.values()],
        "first_set_reps": [sets[0]['reps'] for sets in data.values()],
        "total_volumes": [sum(set['volume'] for set in sets) for sets in data.values()],
        "details": data  # All sets per day
    }
    return jsonify(response), 200

@main.route('/exercise_types', methods=['GET'])
@login_required
def get_exercise_types():
    """Endpoint to retrieve unique exercise types for dropdown selection."""
    types = get_unique_exercise_types()
    return jsonify(types), 200








