import os

class Config:
    SECRET_KEY = '8bc6dbc692c5d20d516b46ad206d11fb6ab2c9ce7de2a96f878befa779754f56'
    SQLALCHEMY_DATABASE_URI = 'postgresql://broski_qin:Tonyqin2003@massimodb.crois6sgstj6.us-east-1.rds.amazonaws.com:5432/massimo'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # AWS S3 Configuration
    S3_BUCKET_NAME = 'massimo-gym-videos'
    S3_ACCESS_KEY = 'AKIAVPEYV6NA7JJ3SMJO'
    S3_SECRET_KEY = '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'
    S3_REGION = 'us-east-1'
    OPENAI_API_KEY= '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'



