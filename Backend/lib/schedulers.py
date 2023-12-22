from sqlalchemy.orm import Session
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
import subprocess
import holidays
import os

from database import get_db 
from models import Attendance, User
import lib.const as const
from database import SessionLocal

load_dotenv()

db_user = os.getenv('MYSQL_USER')
db_password = os.getenv('MYSQL_PASSWORD')
db_name = os.getenv('MYSQL_DATABASE')


def process_absent_users(db: Session):
    today = datetime.today().date()

    attended_users = db.query(Attendance.user_id).filter(Attendance.time >= today).all()
    attended_user_ids = [user.user_id for user in attended_users]

    absent_users = db.query(User).filter(User.user_id.notin_(attended_user_ids)).all()

    for user in absent_users:
        absence = Attendance(user_id=user.user_id, time=None, state="absent")
        db.add(absence)
    db.commit()


def add_attendance_to_db():
    print("Add today's attendance")
    db = next(get_db())
    try:
        today = datetime.now()
        today_midnight = today.replace(hour=0, minute=0, second=0, microsecond=0)

        if today.weekday() in [5, 6]:
            print("주말에는 출석 기록을 추가하지 않습니다.")
            return
        kr_holidays = holidays.KR()
        if today.date() in kr_holidays:
            print("공휴일에는 출석 기록을 추가하지 않습니다.")
            return

        all_users = db.query(User).all()

        for user in all_users:
            existing_record = db.query(Attendance).filter(
                Attendance.user_id == user.user_id,
                Attendance.time == today_midnight
            ).first()
            if not existing_record:
                new_record = Attendance(user_id=user.user_id,
                                        time=today_midnight,
                                        state="absent")
                db.add(new_record)

        db.commit()

    finally:
        db.close()


def backup_database():
    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file_name = f"{db_name}_{current_time}.sql"

    backup_file_path = Path("backup/db") / backup_file_name
    backup_file_path.parent.mkdir(parents=True, exist_ok=True)

    command = f'\"{const.MYSQLDUMP}/mysqldump\" -u {db_user} -p{db_password} {db_name} > {backup_file_path}'

    process = subprocess.Popen(command, shell=True)
    stdout, stderr = process.communicate()

    if process.returncode == 0:
        print("Backup successful")
    else:
        print(f"Backup failed: {stderr}")


# def schedulers():
#     print("Scheduler Run!")
#     add_attendance_to_db()
#     backup_database()
        

def scheduled_task():
    print("Scheduler Run!")
    db = SessionLocal()
    try:
        process_absent_users(db)
    finally:
        db.close()