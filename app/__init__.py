from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from config import Config
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_cors import CORS
from flask_session import Session  # Import Flask-Session

load_dotenv()

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view = 'main.login'

# Load user function for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    from app.models import User  # Import here to avoid circular import
    return User.query.get(int(user_id))

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    migrate = Migrate(app, db)

    # Set up session management and CORS
    app.config['SESSION_TYPE'] = 'filesystem'  # Store session data on the file system
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = True  # Use True if using HTTPS
    Session(app)

    # Globally enable CORS with credentials for all routes
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    # Register blueprints
    from app.routes import main
    app.register_blueprint(main)

    return app





