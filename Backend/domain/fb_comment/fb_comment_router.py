from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List

from . import fb_comment_crud, fb_comment_schema
from database import get_db

from domain.user.user_router import get_current_user
from models import User

router = APIRouter(
    prefix="/api/fb_comments",
)

@router.post("/create_comment", 
            description="댓글을 등록합니다.", 
             response_model=fb_comment_schema.CommentDisplay,
             tags=["Freeboard Comment"])
async def add_comment(comment: fb_comment_schema.CommentCreate, 
                db: Session = Depends(get_db), 
                current_user: User = Depends(get_current_user)):
    comment = fb_comment_crud.create_comment(db=db, comment_create=comment, user_id=current_user.user_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Invalid post_id: Post does not exist")
    return comment


@router.get("/read_comment/{post_id}", 
            description="해당 게시글에 대한 댓글을 조회합니다.", 
            response_model=List[fb_comment_schema.CommentDisplay],
            tags=["Freeboard Comment"])
async def read_comments(post_id: int, db: Session = Depends(get_db)):
    comments = fb_comment_crud.get_comments_by_post_id(db, post_id)
    return [fb_comment_schema.CommentDisplay(
        comment_id=comment.comment_id,
        post_id=comment.post_id,
        user_id=comment.user_id,
        user_name=comment.user.user_name,
        content=comment.content,
        created_at=comment.created_at,
        updated_at=comment.updated_at
    ) for comment in comments]


@router.put("/update_comment/{comment_id}", 
            description="댓글을 수정합니다.", 
            response_model=fb_comment_schema.CommentDisplay, 
            tags=["Freeboard Comment"])
async def update_comment_endpoint(comment_id: int, 
                            content: str, 
                            db: Session = Depends(get_db), 
                            current_user: User = Depends(get_current_user)):
    updated_comment = fb_comment_crud.update_comment(db=db, comment_id=comment_id, content=content, user_id=current_user.user_id)

    if updated_comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    elif updated_comment == "unauthorized":
        raise HTTPException(status_code=403, detail="Not authorized to edit this comment")

    return fb_comment_schema.CommentDisplay.from_orm(updated_comment)


@router.delete("/delete_comment/{comment_id}", 
            description="댓글을 삭제합니다.", 
               status_code=204, 
               tags=["Freeboard Comment"])
async def delete_comment_endpoint(comment_id: int, 
                            db: Session = Depends(get_db), 
                            current_user: User = Depends(get_current_user)):
    result = fb_comment_crud.delete_comment(db=db, comment_id=comment_id, user_id=current_user.user_id)

    if result is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    elif result == "unauthorized":
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")

    return Response(status_code=status.HTTP_204_NO_CONTENT)