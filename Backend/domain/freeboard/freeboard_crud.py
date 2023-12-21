from sqlalchemy.orm import Session
from datetime import datetime

from domain.freeboard.freeboard_schema import FreeBoardCreate
from models import FreeBoard, User

def create_freeboard_post(db: Session, post: FreeBoardCreate, user_id: str):
    db_post = FreeBoard(**post.dict(), user_id=user_id, created_at=datetime.now(), updated_at=datetime.now())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


def get_freeboard_posts_by_user(db: Session, user_id: str):
    return db.query(FreeBoard, User.user_name).join(User, FreeBoard.user_id == User.user_id).filter(FreeBoard.user_id == user_id).all()

    
def get_all_freeboard_posts(db: Session):
    return db.query(FreeBoard, User.user_name).join(User, FreeBoard.user_id == User.user_id).all()


def get_freeboard_posts_by_user(db: Session, user_id: str):
    return db.query(FreeBoard).filter(FreeBoard.user_id == user_id).all()


def get_freeboard_post_by_id(db: Session, post_id: int):
    return db.query(FreeBoard).filter(FreeBoard.post_id == post_id).first()


def update_freeboard_post(db: Session, post_id: int, post_update: FreeBoardCreate):
    db_post = db.query(FreeBoard).filter(FreeBoard.post_id == post_id).first()
    if db_post is None:
        return None
    for var, value in vars(post_update).items():
        setattr(db_post, var, value) if value else None
    db_post.updated_at = datetime.now()
    db.commit()
    db.refresh(db_post)
    return db_post


def delete_freeboard_post(db: Session, post_id: int):
    db_post = db.query(FreeBoard).filter(FreeBoard.post_id == post_id).first()
    if db_post:
        db.delete(db_post)
        db.commit()
        return True
    return False