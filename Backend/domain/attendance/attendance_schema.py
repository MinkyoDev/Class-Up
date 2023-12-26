from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional


class Attendance(BaseModel):
    user_id: str
    time : Optional[datetime]
    date : date
    state : str


class AttendanceStat(BaseModel):
    user_name: str
    time: Optional[datetime]
    state: str