from pydantic import BaseModel
from datetime import datetime, date


class ScheduleCreate(BaseModel):
    title: str
    content: str
    start_date: date
    end_date: date


class Schedule(ScheduleCreate):
    schedule_id: int
    user_id: str
    user_name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True