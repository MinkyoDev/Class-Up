from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FreeBoardCreate(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None

class FreeBoardDisplay(BaseModel):
    post_id: int
    user_id: str
    user_name: str
    title: str
    content: str
    image_url: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True