from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from . import fb_comment_crud, fb_comment_schema
from database import get_db

from domain.user.user_router import get_current_user
from models import User

router = APIRouter()


@router.post("/create_comment", 
             response_model=fb_comment_schema.CommentDisplay,
             tags=["Freeboard Comment"])
def add_comment(comment: fb_comment_schema.CommentCreate, 
                db: Session = Depends(get_db), 
                current_user: User = Depends(get_current_user)):
    return fb_comment_crud.create_comment(db=db, comment_create=comment, user_id=current_user.user_id)
