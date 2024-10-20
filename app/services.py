import boto3
from config import Config

def upload_to_s3(file, bucket_name, acl="public-read"):
    s3 = boto3.client(
        "s3",
        aws_access_key_id=Config.S3_ACCESS_KEY,
        aws_secret_access_key=Config.S3_SECRET_KEY,
        region_name=Config.S3_REGION
    )

    try:
        s3.upload_fileobj(
            file,
            bucket_name,
            file.filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )
        return f"https://{bucket_name}.s3.amazonaws.com/{file.filename}"

    except Exception as e:
        print(f"Something went wrong: {e}")
        return None
