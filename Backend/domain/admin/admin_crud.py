from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from models import Attendance, User
from domain.user.user_schema import UserCreate, UserUpdate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def caculate_attendance_time(start, end):
    now = datetime.now()
    start_time = datetime.strptime(start, "%H:%M").time()
    end_time = datetime.strptime(end, "%H:%M").time()
    start_datetime = datetime.combine(now.date(), start_time)
    end_datetime = datetime.combine(now.date(), end_time)

    return start_datetime <= now <= end_datetime


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
                                    state=state)
        db.add(new_attendance)
    db.commit()


def get_all_attendance_list(db: Session):
    attendance_list = db.query(Attendance).order_by(Attendance.id).all()
    return attendance_list


def get_daily_attendance_stats(db: Session, date: datetime.date):
    users = db.query(User).all()
    attendance_records = db.query(Attendance).filter(Attendance.time >= date, Attendance.time < date + timedelta(days=1)).all()

    attendance_stats = []
    for user in users:
        record = next((r for r in attendance_records if r.user_id == user.user_id), None)
        if record:
            attendance_stats.append({"user_id": user.user_id, 
                                     "user_name": user.user_name, 
                                     "email": user.email, 
                                     "phone_number": user.phone_number, 
                                     "profile_image": user.profile_image, 
                                     "state": user.state, 
                                     "attendance_type": user.attendance_type, 
                                     "time": record.time, 
                                     "attendance_state": record.state})
        else:
            attendance_stats.append({"user_id": user.user_id, 
                                     "user_name": user.user_name, 
                                     "email": user.email, 
                                     "phone_number": user.phone_number, 
                                     "profile_image": user.profile_image, 
                                     "state": user.state, 
                                     "attendance_type": user.attendance_type, 
                                     "time": None, 
                                     "attendance_state": record.state})

    return attendance_stats


def update_user_employment(db: Session, user_id: str, new_employment: bool):
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        return None

    user.employment = new_employment
    db.commit()
    db.refresh(user)
    return user


def update_user_state(db: Session, user_id: str, new_state: bool):
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        return None

    user.state = new_state
    db.commit()
    db.refresh(user)
    return user


def update_user_attendance_type(db: Session, user_id: str, new_attendance_type: bool):
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        return None

    user.attendance_type = new_attendance_type
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user_id: str, user_update: UserUpdate):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if db_user is None:
        return None
    
    if user_update.user_name is not None:
        db_user.user_name = user_update.user_name
    if user_update.email is not None:
        db_user.email = user_update.email
    if user_update.phone_number is not None:
        db_user.phone_number = user_update.phone_number

    if user_update.new_password is not None:
        db_user.password = pwd_context.hash(user_update.new_password)

    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_id(db: Session, user_id: str):
    return db.query(User).filter(User.user_id == user_id).first()


def update_user_profile_image(db: Session, user_id: str, image_path: str):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if db_user:
        db_user.profile_image = image_path
        db.commit()
        return db_user