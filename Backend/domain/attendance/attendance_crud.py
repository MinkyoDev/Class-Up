from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy import func

from datetime import date, datetime, timedelta
import calendar

from domain.user.user_schema import UserCreate
from models import Attendance, User

import lib.const as const


def get_all_attendance_list(db: Session):
    attendance_list = db.query(Attendance).order_by(Attendance.id).all()
    return attendance_list


def get_user_attendance_list(db: Session, user_id: str):
    return db.query(Attendance).filter(Attendance.user_id == user_id).order_by(Attendance.id).all()


def get_today_user_attendance_list(db: Session, user_id: str):
    today = datetime.now().date()

    return db.query(Attendance)\
             .filter(Attendance.user_id == user_id)\
             .filter(Attendance.date == today)\
             .order_by(Attendance.id)\
             .all()


def attendance_check(db: Session, check_attendance: UserCreate, state: str):
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = datetime.now().replace(hour=23, minute=59, second=59, microsecond=999999)

    db_attendance = db.query(Attendance).filter(
        Attendance.user_id == check_attendance.user_id,
        Attendance.time.between(today_start, today_end)
    ).first()

    if db_attendance:
        db_attendance.time = datetime.now()
        db_attendance.state = state
    else:
        new_attendance = Attendance(user_id=check_attendance.user_id,
                                    time=datetime.now(),
                                    date=datetime.now().date(),
                                    state=state)
        db.add(new_attendance)
    db.commit()


def get_existing_user(db: Session, user_id):
    return db.query(User).filter(User.user_id == user_id).first()


def get_attendance_count(db: Session, user_id: str, target_date: date):
    day_start = datetime.combine(target_date, datetime.min.time())
    day_end = datetime.combine(target_date, datetime.max.time())

    attendance_count = db.query(Attendance).filter(
        Attendance.user_id == user_id,
        Attendance.time >= day_start,
        Attendance.time <= day_end,
        Attendance.state != "absent"
    ).count()
    
    return attendance_count


def caculate_attendance_time(start, end):
    now = datetime.now()
    start_time = datetime.strptime(start, "%H:%M").time()
    end_time = datetime.strptime(end, "%H:%M").time()
    start_datetime = datetime.combine(now.date(), start_time)
    end_datetime = datetime.combine(now.date(), end_time)

    return start_datetime <= now <= end_datetime


def calculate_attendance_stats(db: Session, user_id: str):
    current_year = datetime.now().year
    current_month = datetime.now().month
    last_day = calendar.monthrange(current_year, current_month)[1]

    if const.START_DAY == 0:
        start_date = date(current_year, current_month, 1)
    else:
        start_date = date(current_year, current_month, const.START_DAY)

    if const.END_DAY == 0:
        end_date = datetime.now().date()
    elif const.END_DAY > last_day:
        end_date = date(current_year, current_month, last_day)
    else:
        end_date = date(current_year, current_month, const.END_DAY)

    end_date = end_date + timedelta(days=1)

    present_count = db.query(func.count()).filter(
        Attendance.user_id == user_id,
        Attendance.date.between(start_date, end_date),
        Attendance.state == 'present'
    ).scalar()

    late_count = db.query(func.count()).filter(
        Attendance.user_id == user_id,
        Attendance.date.between(start_date, end_date),
        Attendance.state == 'late'
    ).scalar()

    absent_count = db.query(func.count()).filter(
        Attendance.user_id == user_id,
        Attendance.date.between(start_date, end_date),
        Attendance.state == 'absent'
    ).scalar()

    off_count = db.query(func.count()).filter(
        Attendance.user_id == user_id,
        Attendance.date.between(start_date, end_date),
        Attendance.state == 'off'
    ).scalar()

    total_fine = late_count * const.LATE_FINE + absent_count * const.ABSENT_FINE

    return {
        "start_date": start_date,
        "end_date": end_date,
        "attendance_count": present_count,
        "late_count": late_count,
        "absent_count": absent_count,
        "off_count": off_count,
        "total_fine": total_fine
    }


def calculate_all_users_attendance_stats(db: Session):
    users_stats = []
    users = db.query(User).all()
    for user in users:
        stats = calculate_attendance_stats(db, user.user_id)
        users_stats.append({**stats, "user_id": user.user_id, "user_name": user.user_name})

    sorted_stats = sorted(users_stats, key=lambda x: x['total_fine'], reverse=True)
    return sorted_stats



def get_daily_attendance_stats(db: Session, date: datetime.date):
    users = db.query(User).all()
    attendance_records = db.query(Attendance).filter(Attendance.date >= date, Attendance.date < date + timedelta(days=1)).all()

    attendance_stats = []
    for user in users:
        record = next((r for r in attendance_records if r.user_id == user.user_id), None)
        if record:
            attendance_stats.append({"user_id": user.user_id, 
                                     "user_name": user.user_name, 
                                     "time": record.time, 
                                     "state": record.state})
        else:
            attendance_stats.append({"user_id": user.user_id, 
                                     "user_name": user.user_name, 
                                     "time": None, 
                                     "state": "absent"})

    return attendance_stats