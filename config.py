import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://username:password@your-rds-instance-url:5432/db_name'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    S3_BUCKET_NAME = 'your-s3-bucket-name'
    S3_ACCESS_KEY = os.environ.get('S3_ACCESS_KEY')
    S3_SECRET_KEY = os.environ.get('S3_SECRET_KEY')
    S3_REGION = 'your-aws-region'

