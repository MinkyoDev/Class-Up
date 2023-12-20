from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FreeBoardCreate(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None

class FreeBoardDisplay(FreeBoardCreate):
    post_id: int
    created_at: datetime
    updated_at: datetime
    user_id: str

    class Config:
        from_attributes = True