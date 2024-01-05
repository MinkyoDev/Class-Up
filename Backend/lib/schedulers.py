from sqlalchemy.orm import Session
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
import subprocess
import holidays
import os
import platform

from models import Attendance, User, UserSchedules
import lib.const as const
from lib.S3 import save_file_in_S3
from database import SessionLocal

load_dotenv()
db_name = os.getenv('MYSQL_DATABASE')


def backup_database():
    current_file_path = Path(__file__).resolve()
    current_directory = current_file_path.parent.parent

    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file_name = f"{db_name}_{current_time}.sql"

    backup_file_path = current_directory / Path("backup/db") / backup_file_name
    backup_file_path.parent.mkdir(parents=True, exist_ok=True)

    cnf_file = current_directory / Path("mysql/my.cnf")

    if platform.system() == "Linux":
        command = f'mysqldump --defaults-file={cnf_file} {db_name} > {backup_file_path}'
    elif platform.system() == "Windows":
        command = f'"{const.MYSQLDUMP_WINDOWS}/mysqldump" --defaults-file={cnf_file} {db_name} > {backup_file_path}'
    else:
        raise Exception("Unsupported operating system")

    process = subprocess.Popen(command, shell=True)
    stdout, stderr = process.communicate()

    if process.returncode == 0:
        print("Backup successful")
        object_name = f'backup/db/{backup_file_name}'
        with open(backup_file_path, 'rb') as file:
            save_file_in_S3(file, object_name)
    else:
        print(f"Backup failed: {stderr}")


def process_absent_users(db: Session):
    today = datetime.today().date()

    if today.weekday() in [5, 6]:
        print("주말에는 출석 기록을 추가하지 않습니다.")
        return
    kr_holidays = holidays.KR()
    if today in kr_holidays:
        print("공휴일에는 출석 기록을 추가하지 않습니다.")
        return

    # 오늘 스케줄이 있는 유저들의 ID 목록을 가져옵니다.
    scheduled_users = db.query(UserSchedules.user_id).filter(
        UserSchedules.start_date <= today,
        UserSchedules.end_date >= today
    ).all()
    scheduled_user_ids = [user.user_id for user in scheduled_users]

    # 고용 상태가 True인 유저들의 ID 목록을 가져옵니다.
    employed_users = db.query(User.user_id).filter(User.employment == True).all()
    employed_user_ids = [user.user_id for user in employed_users]

    # 스케줄이 있거나 고용 상태가 True인 유저들의 ID 목록
    off_users_ids = list(set(scheduled_user_ids + employed_user_ids))

    # 오늘 출석한 유저들의 ID 목록을 가져옵니다.
    attended_users = db.query(Attendance.user_id).filter(
        Attendance.date == today,
        Attendance.state.in_(["present", "late"])
    ).all()
    attended_user_ids = [user.user_id for user in attended_users]

    # 출석 또는 'off' 상태인 유저를 제외한 나머지 유저들을 조회합니다.
    absent_users = db.query(User).filter(
        User.user_id.notin_(attended_user_ids)
    ).all()

    for user in absent_users:
        # 스케줄이 있거나 고용 상태가 True인 경우 'off', 그 외는 'absent'로 처리합니다.
        state = "off" if user.user_id in off_users_ids else "absent"
        absence = Attendance(user_id=user.user_id, 
                             date=today, 
                             state=state)
        db.add(absence)
    
    db.commit()


def scheduled_task():
    print("Scheduled Task Running!")
    db = SessionLocal()
    try:
        process_absent_users(db)
        backup_database()
    finally:
        db.close()