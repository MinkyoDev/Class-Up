from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import mysql.connector
import os
from dotenv import load_dotenv

from models import User, Attendance, Base

load_dotenv()

DB_USER = os.getenv('MYSQL_USER')
DB_PASSWORD = os.getenv('MYSQL_PASSWORD')
DB_HOST = os.getenv('MYSQL_HOST')
DB_PORT = os.getenv('MYSQL_PORT')
DATABASE = os.getenv('MYSQL_DATABASE')

def create_database_if_not_exists():
    """ 데이터베이스가 존재하지 않으면 생성합니다. """
    try:
        # 데이터베이스를 지정하지 않고 연결
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT
        )
        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DATABASE}")
            cursor.close()
        connection.close()
    except mysql.connector.Error as e:
        print(f"Error while connecting to MySQL: {e}")

# 먼저 데이터베이스 생성 확인
create_database_if_not_exists()

DB_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DATABASE}?charset-utf8"

engine = create_engine(DB_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(engine)

session = SessionLocal()

query = session.query(User, Attendance).join(Attendance, User.user_id == Attendance.user_id)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
