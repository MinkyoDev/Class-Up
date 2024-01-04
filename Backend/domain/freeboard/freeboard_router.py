from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from fastapi.responses import Response
from typing import List
from pathlib import Path
from uuid import uuid4
import shutil

from domain.freeboard import freeboard_crud, freeboard_schema
from database import get_db

from domain.user.user_router import get_current_user
from models import User
from lib.S3 import save_file_in_S3

router = APIRouter(
    prefix="/api/freeboard",
)

@router.post("/create_freeboard", 
             description="자유 게시판에 글을 등록합니다.", 
             response_model=freeboard_schema.FreeBoardCreateReturn, 
             status_code=status.HTTP_201_CREATED,
             tags=["Freeboard"])
async def create_freeboard_post(post: freeboard_schema.FreeBoardCreate, 
                          db: Session = Depends(get_db), 
                          current_user: User = Depends(get_current_user)):
    return freeboard_crud.create_freeboard_post(db=db, post=post, user_id=current_user.user_id)


@router.get("/read_freeboard/user/{user_id}", 
            description="해당 유저의 게시글만 조회합니다.", 
            response_model=List[freeboard_schema.FreeBoardDisplay], 
            tags=["Freeboard"])
async def read_freeboard_posts_by_user(user_id: str, db: Session = Depends(get_db)):
    posts = freeboard_crud.get_freeboard_posts_by_user(db=db, user_id=user_id)
    return [{
        "post_id": post.post_id, 
        "user_id": post.user_id,
        "user_name": user_name, 
        "title": post.title, 
        "content": post.content, 
        "image_url": post.image_url, 
        "created_at": post.created_at, 
        "updated_at": post.updated_at
    } for post, user_name in posts]


@router.get("/read_freeboard/all", 
            description="모든 게시글을 조회합니다.", 
            response_model=List[freeboard_schema.FreeBoardDisplay], 
            tags=["Freeboard"])
async def read_all_freeboard_posts(db: Session = Depends(get_db)):
    posts = freeboard_crud.get_all_freeboard_posts(db=db)
    return [{
        "post_id": post.post_id, 
        "user_id": post.user_id,
        "user_name": user_name, 
        "title": post.title, 
        "content": post.content, 
        "image_url": post.image_url, 
        "created_at": post.created_at, 
        "updated_at": post.updated_at
    } for post, user_name in posts]


@router.get("/read_freeboard/my_posts", 
            description="현제 로그인 되어있는 유저의 게시글만 조회합니다.", 
            response_model=List[freeboard_schema.FreeBoardDisplay], 
            tags=["Freeboard"])
async def read_my_freeboard_posts(db: Session = Depends(get_db), 
                            current_user: User = Depends(get_current_user)):
    posts = freeboard_crud.get_freeboard_posts_by_user(db=db, user_id=current_user.user_id)
    return [{
        "post_id": post.post_id, 
        "user_id": post.user_id,
        "user_name": user_name, 
        "title": post.title, 
        "content": post.content, 
        "image_url": post.image_url, 
        "created_at": post.created_at, 
        "updated_at": post.updated_at
    } for post, user_name in posts]



@router.get("/read_freeboard/{post_id}", 
            description="특정 게시글을 조회합니다.", 
            response_model=freeboard_schema.FreeBoardDisplay, 
            tags=["Freeboard"])
async def read_freeboard_post(post_id: int, db: Session = Depends(get_db)):
    post = freeboard_crud.get_freeboard_post_by_id(db=db, post_id=post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    print(post.post_id)
    return {
        "post_id": post.post_id, 
        "user_id": post.user_id,
        "user_name": post.user.user_name,
        "title": post.title, 
        "content": post.content, 
        "image_url": post.image_url, 
        "created_at": post.created_at, 
        "updated_at": post.updated_at
    }


@router.put("/update_freeboard/{post_id}", 
            description="게시글의 내용을 수정합니다.", 
            response_model=freeboard_schema.FreeBoardDisplay, 
            tags=["Freeboard"])
async def update_freeboard_post(post_id: int, 
                          post: freeboard_schema.FreeBoardCreate, 
                          db: Session = Depends(get_db), 
                          current_user: User = Depends(get_current_user)):
    db_post = freeboard_crud.get_freeboard_post_by_id(db, post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    if db_post.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this post")
    
    return freeboard_crud.update_freeboard_post(db=db, post_id=post_id, post_update=post)


@router.delete("/delete_freeboard/{post_id}", 
               description="게시글을 삭제합니다.", 
               status_code=status.HTTP_204_NO_CONTENT, 
               tags=["Freeboard"])
async def delete_freeboard_post(post_id: int, 
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
    

@router.post("/upload_image", 
             description="자유게시판에 사진을 등록 합니다.", 
             tags=["Freeboard"])
async def upload_image(file: UploadFile = File(...), 
                               db: Session = Depends(get_db), 
                               current_user: User = Depends(get_current_user)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image")

    file_name = f"{uuid4()}{Path(file.filename).suffix}"
    object_name = f'freeboard/{file_name}'
    file_path = save_file_in_S3(file.file, object_name)

    if file_path is None:
        raise HTTPException(status_code=500, detail="Error uploading file to S3")

    return {"file_path": file_path}