from datetime import datetime
from dotenv import load_dotenv
import os
import subprocess
from pathlib import Path

from database import get_db 
from models import Attendance, User
import lib.const as const

load_dotenv()

db_user = os.getenv('MYSQL_USER')
db_password = os.getenv('MYSQL_PASSWORD')
db_name = os.getenv('MYSQL_DATABASE')

def add_attendance_to_db():
    print("Add today's attendance")
    db = next(get_db())
    try:
        all_users = db.query(User).all()
        today_midnight = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

        for user in all_users:
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


def schedulers():
    print("Scheduler Run!")
    add_attendance_to_db()
    backup_database()