from datetime import datetime

from database import get_db 
from models import Attendance, User


def add_attendance_to_db():
    print("Scheduler Run!")
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