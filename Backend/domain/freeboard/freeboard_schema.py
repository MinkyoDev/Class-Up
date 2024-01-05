from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FreeBoardCreate(BaseModel):
    title: str
    content: str
    announcement: Optional[bool] = False


class FreeBoardDisplay(BaseModel):
    post_id: int
    user_id: str
    user_name: str
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    announcement: bool
    view_count: int
    likes_count: int
    comments_count: int

    class Config:
        from_attributes = True


class FreeBoardCreateReturn(BaseModel):
    post_id: int
    user_id: str
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    announcement: bool
    view_count: int
    likes_count: int

    class Config:
        from_attributes = True


class FreeBoardUpdateDisplay(BaseModel):
    post_id: int
    user_id: str
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    announcement: bool
    view_count: int
    likes_count: int

    class Config:
        from_attributes = True
