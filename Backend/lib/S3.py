import boto3
from dotenv import load_dotenv
import os

load_dotenv()
ACCESS_KEY = os.getenv('AWS_ACCESSKEY')
SECRET_KEY = os.getenv('AWS_SECRETKEY')
BUCKET_NAME = 'class-up'
REGION_NAME = 'ap-northeast-2'


def save_file_in_S3(file, object_name):
    s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY)
    
    try:
        s3.put_object(Bucket=BUCKET_NAME, Key=object_name, Body=file)
        file_url = f"https://{BUCKET_NAME}.s3.{REGION_NAME}.amazonaws.com/{object_name}"
        
        print('Save fbx file in AWS S3 done')
        return file_url
    except:
        return None
