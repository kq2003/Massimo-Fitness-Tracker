from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user, login_user, logout_user
from app.models import User  # Import the User model
from app.services import (
    add_aerobic_training, get_aerobic_training, update_aerobic_training, delete_aerobic_training,
    add_strength_training, get_strength_training, update_strength_training, delete_strength_training
)
from app import bcrypt  # Import bcrypt to handle password hashing

main = Blueprint('main', __name__)

@main.route('/register', methods=['POST'])
def register():
    from app import db
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201


# A route to log in the user
@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and bcrypt.check_password_hash(user.password, data['password']):
        login_user(user)  # This logs the user in
        return jsonify({'message': 'Logged in successfully'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# A route to log out the user
@main.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

# Route to add an aerobic training entry
@main.route('/add_aerobic', methods=['POST'])
@login_required
def add_aerobic():
    data = request.get_json()
    aerobic_session = add_aerobic_training(data, current_user.id)
    return jsonify({'message': 'Aerobic training added', 'id': aerobic_session.id}), 201

# Route to get all aerobic training entries
@main.route('/get_aerobic', methods=['GET'])
@login_required
def get_aerobic():
    sessions = get_aerobic_training(current_user.id)
    result = [{'type': s.type, 'duration': s.duration, 'calories_burnt': s.calories_burnt} for s in sessions]
    return jsonify(result), 200

# Route to update an aerobic training entry
@main.route('/update_aerobic/<int:aerobic_id>', methods=['PUT'])
@login_required
def update_aerobic(aerobic_id):
    updates = request.get_json()
    session = update_aerobic_training(aerobic_id, updates)
    if session:
        return jsonify({'message': 'Aerobic training updated successfully'}), 200
    return jsonify({'message': 'Session not found'}), 404

# Route to delete an aerobic training entry
@main.route('/delete_aerobic/<int:aerobic_id>', methods=['DELETE'])
@login_required
def delete_aerobic(aerobic_id):
    success = delete_aerobic_training(aerobic_id)
    if success:
        return jsonify({'message': 'Aerobic training deleted successfully'}), 200
    return jsonify({'message': 'Session not found'}), 404

# Route to add strength training
@main.route('/add_strength', methods=['POST'])
@login_required
def add_strength():
    data = request.get_json()
    strength_session = add_strength_training(data, current_user.id)
    return jsonify({'message': 'Strength training added', 'id': strength_session.id}), 201

# Route to get all strength training entries
@main.route('/get_strength', methods=['GET'])
@login_required
def get_strength():
    sessions = get_strength_training(current_user.id)
    result = [{'type': s.type, 'reps': s.reps, 'weight': s.weight, 'rest_time': s.rest_time, 'effort_level': s.effort_level} for s in sessions]
    return jsonify(result), 200


# Route to update strength training entry
@main.route('/update_strength/<int:strength_id>', methods=['PUT'])
@login_required
def update_strength(strength_id):
    updates = request.get_json()
    session = update_strength_training(strength_id, updates)
    if session:
        return jsonify({'message': 'Strength training updated successfully'}), 200
    return jsonify({'message': 'Session not found'}), 404

# Route to delete a strength training entry
@main.route('/delete_strength/<int:strength_id>', methods=['DELETE'])
@login_required
def delete_strength(strength_id):
    success = delete_strength_training(strength_id)
    if success:
        return jsonify({'message': 'Strength training deleted successfully'}), 200
    return jsonify({'message': 'Session not found'}), 404



