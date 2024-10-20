from flask import Blueprint, render_template, url_for, flash, redirect, request
from app import db, bcrypt
from app.models import User, Workout
from app.services import upload_to_s3
from flask_login import login_user, current_user, logout_user, login_required

main = Blueprint('main', __name__)

@main.route("/register", methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(username=username, email=email, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Account created!', 'success')
        return redirect(url_for('main.login'))
    
    return render_template('register.html')

@main.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))

    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('main.dashboard'))
        else:
            flash('Login failed. Check email and password.', 'danger')
    
    return render_template('login.html')

@main.route("/dashboard")
@login_required
def dashboard():
    workouts = Workout.query.filter_by(user_id=current_user.id).all()
    return render_template('dashboard.html', workouts=workouts)

@main.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('main.login'))

@main.route("/workout", methods=['POST'])
@login_required
def log_workout():
    workout_type = request.form.get('workout_type')
    duration = request.form.get('duration')
    calories_burned = request.form.get('calories_burned')
    workout = Workout(workout_type=workout_type, duration=duration, calories_burned=calories_burned, user_id=current_user.id)
    db.session.add(workout)
    db.session.commit()
    flash('Workout logged!', 'success')
    return redirect(url_for('main.dashboard'))

@main.route('/upload_video', methods=['POST'])
@login_required
def upload_video():
    if 'video' not in request.files:
        flash('No video file found', 'danger')
        return redirect(url_for('main.dashboard'))

    video = request.files['video']
    if video.filename == '':
        flash('No selected file', 'danger')
        return redirect(url_for('main.dashboard'))

    if video:
        video_url = upload_to_s3(video, Config.S3_BUCKET_NAME)
        if video_url:
            flash('Video uploaded successfully!', 'success')
            # Optional: Store video_url in the database with the workout record
            return redirect(url_for('main.dashboard'))
        else:
            flash('Upload failed. Please try again.', 'danger')
    
    return redirect(url_for('main.dashboard'))
