from sqlalchemy.orm import Session, joinedload
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


def get_comments_by_post_id(db: Session, post_id: int):
    return db.query(FBComment).options(joinedload(FBComment.user)).filter(FBComment.post_id == post_id).all()


def update_comment(db: Session, comment_id: int, content: str, user_id: str):
    db_comment = db.query(FBComment).filter(FBComment.comment_id == comment_id).first()
    if db_comment is None:
        return None
    if db_comment.user_id != user_id:
        return "unauthorized"

    db_comment.content = content
    db_comment.updated_at = datetime.now()
    db.commit()
    db.refresh(db_comment)
    
    db_comment.user_name = db_comment.user.user_name
    return db_comment


def delete_comment(db: Session, comment_id: int, user_id: str):
    db_comment = db.query(FBComment).filter(FBComment.comment_id == comment_id).first()
    if db_comment is None:
        return None
    if db_comment.user_id != user_id:
        return "unauthorized"

    db.delete(db_comment)
    db.commit()
    return db_comment