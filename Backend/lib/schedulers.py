from sqlalchemy.orm import Session
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
import subprocess
import holidays
import os
import platform

from database import get_db 
from models import Attendance, User, UserSchedules
import lib.const as const
from database import SessionLocal

if platform.system() == "Linux":
    MYSQLDUMP = const.MYSQLDUMP_LINUX
elif platform.system() == "Windows":
    MYSQLDUMP = const.MYSQLDUMP_WINDOWS
else:
    raise Exception("Unsupported operating system")

load_dotenv()
db_user = os.getenv('MYSQL_USER')
db_password = os.getenv('MYSQL_PASSWORD')
db_name = os.getenv('MYSQL_DATABASE')


def backup_database():
    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file_name = f"{db_name}_{current_time}.sql"

    backup_file_path = Path("backup/db") / backup_file_name
    backup_file_path.parent.mkdir(parents=True, exist_ok=True)

    # command = f'\"{const.MYSQLDUMP}/mysqldump\" -u {db_user} -p{db_password} {db_name} > {backup_file_path}'
    command = f'\"{MYSQLDUMP}/mysqldump\" --defaults-file=./mysql/my.cnf -u username database_name > {backup_file_path}'
    process = subprocess.Popen(command, shell=True)
    stdout, stderr = process.communicate()

    if process.returncode == 0:
        print("Backup successful")
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

    # 오늘 출석한 유저들의 ID 목록을 가져옵니다.
    attended_users = db.query(Attendance.user_id).filter(
        Attendance.date >= today,
        Attendance.state.in_(["present", "late", "absent", "off"])  # 출석 또는 지각으로 처리된 유저들
    ).all()
    attended_user_ids = [user.user_id for user in attended_users]
    print(attended_user_ids)
    # 스케줄이 있거나 출석한 유저를 제외한 나머지 유저들을 조회합니다.
    absent_users = db.query(User).filter(
        User.user_id.notin_(attended_user_ids)
    ).all()

    for user in absent_users:
        # 스케줄이 있는 유저들은 'off', 그 외는 'absent'로 처리합니다.
        state = "off" if user.user_id in scheduled_user_ids else "absent"
        absence = Attendance(user_id=user.user_id, 
                             time=None, 
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