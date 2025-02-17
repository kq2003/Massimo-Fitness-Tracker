from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_cors import CORS
from flask_session import Session
from dotenv import load_dotenv
from datetime import timedelta
import os 

load_dotenv()
db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view = 'main.login'

@login_manager.user_loader
def load_user(user_id):
    from app.models import User
    return User.query.get(int(user_id))

def create_app():
    app = Flask(__name__)
    load_dotenv()

    # Initialize extensions
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    Migrate(app, db)

    #for local, switch back later
    # CORS(app, supports_credentials=True, resources={r"/*": {"origins": r"https://.*\.vercel\.app"}})

    
    # configs for session
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = True  # Use HTTPS in production
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=1) 
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    

    Session(app)

    # Register blueprints
    from app.routes import main
    app.register_blueprint(main)

    return app








