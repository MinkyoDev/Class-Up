from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from datetime import datetime

from .freeboard_schema import FreeBoardCreate
from models import User, FreeBoard, FBComment


def create_freeboard_post(db: Session, post: FreeBoardCreate, user_id: str):
    db_post = FreeBoard(
        title=post.title,
        content=post.content,
        user_id=user_id,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        announcement=post.announcement
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


def get_freeboard_posts_by_user(db: Session, user_id: str):
    return db.query(
        FreeBoard, 
        User.user_name,
        func.count(FBComment.comment_id).label('comments_count')
    ).join(User, FreeBoard.user_id == User.user_id) \
     .outerjoin(FBComment, FreeBoard.post_id == FBComment.post_id) \
     .filter(FreeBoard.user_id == user_id) \
     .group_by(FreeBoard.post_id, User.user_name) \
     .all()


def get_all_freeboard_posts(db: Session):
    return db.query(
        FreeBoard, 
        User.user_name,
        func.count(FBComment.comment_id).label('comments_count')
    ).join(User, FreeBoard.user_id == User.user_id) \
     .outerjoin(FBComment, FreeBoard.post_id == FBComment.post_id) \
     .order_by(FreeBoard.post_id.desc()) \
     .group_by(FreeBoard.post_id, User.user_name) \
     .all()


def get_announcement_freeboard_posts(db: Session):
    return db.query(
        FreeBoard, 
        User.user_name,
        func.count(FBComment.comment_id).label('comments_count')
    ).join(User, FreeBoard.user_id == User.user_id) \
     .outerjoin(FBComment, FreeBoard.post_id == FBComment.post_id) \
     .filter(FreeBoard.announcement == True) \
     .order_by(FreeBoard.post_id.desc()) \
     .group_by(FreeBoard.post_id, User.user_name) \
     .all()


def get_freeboard_post_by_id(db: Session, post_id: int):
    return db.query(
        FreeBoard, 
        User.user_name,
        func.count(FBComment.comment_id).label('comments_count')
    ).join(User, FreeBoard.user_id == User.user_id) \
     .outerjoin(FBComment, FreeBoard.post_id == FBComment.post_id) \
     .filter(FreeBoard.post_id == post_id) \
     .group_by(FreeBoard.post_id, User.user_name) \
     .first()


def get_freeboard_post_by_id_to_update(db: Session, post_id: int):
    return db.query(FreeBoard).filter(FreeBoard.post_id == post_id).first()


def update_freeboard_post(db: Session, post_id: int, post_update: FreeBoardCreate):
    db_post = db.query(FreeBoard).filter(FreeBoard.post_id == post_id).first()

    if db_post is None:
        return None

    for var, value in vars(post_update).items():
        if value is not None:
            setattr(db_post, var, value)
    db_post.updated_at = datetime.now()
    db.commit()
    db.refresh(db_post)
    db_post.user_name = db_post.user.user_name
    return db_post


def delete_freeboard_post(db: Session, post_id: int):
    db_post = db.query(FreeBoard).filter(FreeBoard.post_id == post_id).first()
    if db_post:
        db.delete(db_post)
        db.commit()
        return True
    return False


def increase_view_count(db: Session, post_id: int):
    post = db.query(FreeBoard).filter(FreeBoard.post_id == post_id).first()
    if post:
        post.view_count += 1
        db.commit()


def increase_likes_count(db: Session, post_id: int):
    post = db.query(FreeBoard).filter(FreeBoard.post_id == post_id).first()
    if post:
        post.likes_count += 1
        db.commit()
