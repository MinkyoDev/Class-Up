from sqlalchemy.orm import Session
from datetime import datetime

from domain.schedules.schedules_schema import ScheduleCreate
from models import User, UserSchedules


def create_user_schedule(db: Session, schedule: ScheduleCreate, user_id: str):
    db_schedule = UserSchedules(
        user_id=user_id,
        title=schedule.title,
        content=schedule.content,
        start_date=schedule.start_date,
        end_date=schedule.end_date,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    db_schedule.user_name = db_schedule.user.user_name
    return db_schedule


def get_user_schedules(db: Session, user_id: str):
    return db.query(UserSchedules, User.user_id, User.user_name).join(User, UserSchedules.user_id == User.user_id).filter(UserSchedules.user_id == user_id).all()


def get_all_schedules(db: Session):
    return db.query(UserSchedules, User.user_id, User.user_name).join(User, UserSchedules.user_id == User.user_id).all()


def get_schedule_by_id(db: Session, schedule_id: int):
    return db.query(UserSchedules).filter(UserSchedules.schedule_id == schedule_id).first()


def update_user_schedule(db: Session, schedule_id: int, schedule_data: ScheduleCreate):
    db_schedule = db.query(UserSchedules).filter(UserSchedules.schedule_id == schedule_id).first()
    if db_schedule is None:
        return None
    for var, value in vars(schedule_data).items():
        setattr(db_schedule, var, value) if value else None
    db_schedule.updated_at = datetime.now()
    db.commit()
    db.refresh(db_schedule)
    db_schedule.user_name = db_schedule.user.user_name
    return db_schedule


def delete_user_schedule(db: Session, schedule_id: int):
    db_schedule = db.query(UserSchedules).filter(UserSchedules.schedule_id == schedule_id).first()
    if db_schedule:
        db.delete(db_schedule)
        db.commit()
        return True
    return False