from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class Attendance(BaseModel):
    user_id: str
    time : datetime
    state : str


class AttendanceStat(BaseModel):
    user_name: str
    time: Optional[datetime]
    state: str