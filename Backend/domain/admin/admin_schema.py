from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class Attendance(BaseModel):
    user_id: str
    time : datetime
    state : str