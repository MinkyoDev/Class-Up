from pydantic import BaseModel
from datetime import datetime


class CommentCreate(BaseModel):
    post_id: int
    content: str


class CommentDisplay(BaseModel):
    comment_id: int
    post_id: int
    user_id: str
    user_name: str
    content: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True