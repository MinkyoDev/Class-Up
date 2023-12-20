from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

from models import User, Attendance, Base

load_dotenv()

DB_USER = os.getenv('MYSQL_USER')
DB_PASSWORD = os.getenv('MYSQL_PASSWORD')
DB_HOST = os.getenv('MYSQL_HOST')
DB_PORT = os.getenv('MYSQL_PORT')
DATABASE = os.getenv('MYSQL_DATABASE')

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
