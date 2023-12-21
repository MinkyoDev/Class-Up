from sqlalchemy.orm import Session
from datetime import datetime

from models import FBComment, User
from .fb_comment_schema import CommentCreate


def create_comment(db: Session, comment_create: CommentCreate, user_id: str):
    db_comment = FBComment(
        post_id=comment_create.post_id,
        user_id=user_id,
        content=comment_create.content,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment
