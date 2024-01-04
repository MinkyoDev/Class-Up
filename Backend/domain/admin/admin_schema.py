from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import re


class Attendance(BaseModel):
    user_id: str
    time : datetime
    state : str


class UserSchema(BaseModel):
    user_id: str
    user_name: str
    employment: bool
    state: bool
    attendance_type: bool

    class Config:
        from_attributes = True
