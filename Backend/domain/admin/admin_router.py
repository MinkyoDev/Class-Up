from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from starlette import status
from datetime import date, datetime

from database import get_db
from domain.admin import admin_crud, admin_schema
from domain.user.user_router import get_current_user

from models import User

import lib.const as const

router = APIRouter(
    prefix="/api/admin",
)


@router.get("/daily_attendance_for_admin", 
            description="해당 날짜의 모든 유저의 정보와 출석 상태를 조회합니다.", 
            tags=["Admin"])
async def get_daily_attendance(attendance_date: date = Query(..., description="The date to check the attendance for"),
                         db: Session = Depends(get_db), 
                         current_user: User = Depends(get_current_user)):
    if not current_user.admin:
        raise HTTPException(status_code=400, detail="관리자가 아닙니다.")
    attendance_stats = admin_crud.get_daily_attendance_stats(db, attendance_date)
    return attendance_stats


@router.get("/attendance_for_admin", 
            description="관리자로 출석을 합니다.", 
            status_code=status.HTTP_200_OK, 
            tags=["Admin"])
async def check_attendance(user_id: str = Query(...), db: Session = Depends(get_db), 
                     current_user: User = Depends(get_current_user)):
    if not current_user.admin:
        raise HTTPException(status_code=400, detail="관리자가 아닙니다.")

    check_present_time = admin_crud.caculate_attendance_time(const.PRESENT_START, const.PRESENT_END)
    check_late_time = admin_crud.caculate_attendance_time(const.PRESENT_END, const.LATE_END)
    if not check_present_time and not check_late_time:
        raise HTTPException(status_code=400, detail="현재 시간에는 출석을 할 수 없습니다.")
    
    user_exists = admin_crud.get_existing_user(db, user_id)
    if not user_exists:
        raise HTTPException(status_code=400, detail="사용자가 존재하지 않습니다.")
    
    count = admin_crud.get_attendance_count(db, user_id, date.today())
    if count != 0:
        raise HTTPException(status_code=400, detail="출석은 하루에 한번만 할 수 있습니다.")
    
    if check_present_time:
        admin_crud.attendance_check(db=db, check_attendance=user_exists, state="present")
        return {"message" : "출석"}
    elif check_late_time:
        admin_crud.attendance_check(db=db, check_attendance=user_exists, state="late")
        return {"message" : "지각"}


@router.put("/update_employment/{user_id}", 
            response_model=admin_schema.UserSchema, 
            tags=["Admin"])
async def update_user_employment_endpoint(user_id: str, 
                                    new_employment: bool, 
                                    db: Session = Depends(get_db),
                                    current_user: User = Depends(get_current_user)):
    updated_user = admin_crud.update_user_employment(db=db, user_id=user_id, new_employment=new_employment)

    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return updated_user


@router.put("/update_state/{user_id}", 
            response_model=admin_schema.UserSchema, 
            tags=["Admin"])
async def update_user_state_endpoint(user_id: str, 
                               new_state: bool, 
                               db: Session = Depends(get_db),
                               current_user: User = Depends(get_current_user)):
    updated_user = admin_crud.update_user_state(db=db, user_id=user_id, new_state=new_state)

    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return updated_user


@router.put("/update_attendance_type/{user_id}", 
            response_model=admin_schema.UserSchema, 
            tags=["Admin"])
async def update_user_attendance_type_endpoint(user_id: str, 
                                         new_attendance_type: bool, 
                                         db: Session = Depends(get_db),
                                         current_user: User = Depends(get_current_user)):
    updated_user = admin_crud.update_user_attendance_type(db=db, user_id=user_id, new_attendance_type=new_attendance_type)

    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return updated_user