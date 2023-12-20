from pydantic import BaseModel
from datetime import datetime

class ScheduleCreate(BaseModel):
    title: str
    content: str
    start_datetime: datetime
    end_datetime: datetime

class Schedule(ScheduleCreate):
    schedule_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True