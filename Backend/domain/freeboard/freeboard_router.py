from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.responses import Response
from typing import List

from domain.freeboard import freeboard_crud, freeboard_schema
from database import get_db

from domain.user.user_router import get_current_user
from models import User

router = APIRouter(
    prefix="/api/freeboard",
)

@router.post("/create_freeboard", 
             description="자유 게시판에 글을 등록합니다.", 
             response_model=freeboard_schema.FreeBoardDisplay, 
             status_code=status.HTTP_201_CREATED,
             tags=["Freeboard"])
def create_freeboard_post(post: freeboard_schema.FreeBoardCreate, 
                          db: Session = Depends(get_db), 
                          current_user: User = Depends(get_current_user)):
    return freeboard_crud.create_freeboard_post(db=db, post=post, user_id=current_user.user_id)


@router.get("/freeboard/user/{user_id}", 
            description="해당 유저의 게시글만 조회합니다.", 
            response_model=List[freeboard_schema.FreeBoardDisplay], 
            tags=["FreeBoard"])
def read_freeboard_posts_by_user(user_id: str, db: Session = Depends(get_db)):
    return freeboard_crud.get_freeboard_posts_by_user(db=db, user_id=user_id)


@router.get("/freeboard/all", 
            description="모든 게시글을 조회합니다.", 
            response_model=List[freeboard_schema.FreeBoardDisplay], 
            tags=["FreeBoard"])
def read_all_freeboard_posts(db: Session = Depends(get_db)):
    return freeboard_crud.get_all_freeboard_posts(db=db)


@router.get("/freeboard/my_posts", 
            description="현제 로그인 되어있는 유저의 게시글만 조회합니다.", 
            response_model=List[freeboard_schema.FreeBoardDisplay], 
            tags=["FreeBoard"])
def read_my_freeboard_posts(db: Session = Depends(get_db), 
                            current_user: User = Depends(get_current_user)):
    return freeboard_crud.get_freeboard_posts_by_user(db=db, user_id=current_user.user_id)


@router.put("/freeboard/{post_id}", 
            description="게시글의 내용을 수정합니다.", 
            response_model=freeboard_schema.FreeBoardDisplay, 
            tags=["FreeBoard"])
def update_freeboard_post(post_id: int, 
                          post: freeboard_schema.FreeBoardCreate, 
                          db: Session = Depends(get_db), 
                          current_user: User = Depends(get_current_user)):
    db_post = freeboard_crud.get_freeboard_post_by_id(db, post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    if db_post.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this post")
    
    return freeboard_crud.update_freeboard_post(db=db, post_id=post_id, post_update=post)


@router.delete("/freeboard/{post_id}", 
               description="게시글을 삭제합니다.", 
               status_code=status.HTTP_204_NO_CONTENT, 
               tags=["FreeBoard"])
def delete_freeboard_post(post_id: int, 
                          db: Session = Depends(get_db), 
                          current_user: User = Depends(get_current_user)):
    db_post = freeboard_crud.get_freeboard_post_by_id(db, post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    if db_post.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")

    if freeboard_crud.delete_freeboard_post(db, post_id):
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    else:
        raise HTTPException(status_code=500, detail="Error deleting post")