from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.orm import Session
from datetime import datetime, time
from typing import List

from domain.schedules import schedules_crud, schedules_schema
from database import get_db

from domain.user.user_router import get_current_user
from models import User

import lib.const as const

router = APIRouter(
    prefix="/api/schedules",
)

@router.post("/create_schedule", 
             description="스케줄을 등록합니다. 스케줄은 18시 이전까지만 등록 가능합니다.", 
             response_model=schedules_schema.Schedule, 
             status_code=status.HTTP_201_CREATED,
             tags=["Schedules"])
def create_schedule(schedule: schedules_schema.ScheduleCreate, 
                    db: Session = Depends(get_db), 
                    current_user: User = Depends(get_current_user)):
    
    cutoff_hour, cutoff_minute = map(int, const.SCHEDULE_REGISTRATION_CUTOFF_HOUR.split(":"))
    cutoff_time = time(cutoff_hour, cutoff_minute)
    now_time = datetime.now().time()
    if now_time >= cutoff_time:
        raise HTTPException(status_code=400, detail=f"현재 시간에는 스케줄을 등록할 수 없습니다.")
    
    return schedules_crud.create_user_schedule(db=db, schedule=schedule, user_id=current_user.user_id)


@router.get("/read_user_schedules", 
            description="해당 유저의 스케줄을 조회합니다.", 
            response_model=List[schedules_schema.Schedule], 
            tags=["Schedules"])
def read_user_schedules(db: Session = Depends(get_db), 
                        current_user: User = Depends(get_current_user)):
    schedules = schedules_crud.get_user_schedules(db=db, user_id=current_user.user_id)
    return [
        {
            "schedule_id": schedule.schedule_id,
            "user_id": user_id,
            "user_name": user_name,
            "title": schedule.title,
            "content": schedule.content,
            "start_date": schedule.start_date,
            "end_date": schedule.end_date,
            "created_at": schedule.created_at,
            "updated_at": schedule.updated_at
        } for schedule, user_id, user_name in schedules
    ]


@router.get("/read_all_schedules/", 
            description="모든 유저의 스케줄을 조회합니다.", 
            response_model=List[schedules_schema.Schedule], 
            tags=["Schedules"])
def read_all_schedules(db: Session = Depends(get_db),
                       current_user: User = Depends(get_current_user)):
    schedules = schedules_crud.get_all_schedules(db=db)
    return [
        {
            "schedule_id": schedule.schedule_id,
            "user_id": user_id,
            "user_name": user_name,
            "title": schedule.title,
            "content": schedule.content,
            "start_date": schedule.start_date,
            "end_date": schedule.end_date,
            "created_at": schedule.created_at,
            "updated_at": schedule.updated_at
        } for schedule, user_id, user_name in schedules
    ]


@router.put("/schedules/{schedule_id}", 
            description="스케줄 정보를 수정합니다.", 
            response_model=schedules_schema.Schedule, 
            tags=["Schedules"])
def update_schedule(schedule_id: int, 
                    schedule: schedules_schema.ScheduleCreate, 
                    db: Session = Depends(get_db), 
                    current_user: User = Depends(get_current_user)):
    
    existing_schedule = schedules_crud.get_schedule_by_id(db, schedule_id)
    if not existing_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    if existing_schedule.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this schedule")

    updated_schedule = schedules_crud.update_user_schedule(db, schedule_id, schedule)
    return updated_schedule


@router.delete("/schedules/{schedule_id}", 
               description="스케줄을 삭제합니다.", 
               status_code=status.HTTP_204_NO_CONTENT, 
               tags=["Schedules"])
def delete_schedule(schedule_id: int, 
                    db: Session = Depends(get_db), 
                    current_user: User = Depends(get_current_user)):
    existing_schedule = schedules_crud.get_schedule_by_id(db, schedule_id)
    if not existing_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    if existing_schedule.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this schedule")

    if not schedules_crud.delete_user_schedule(db, schedule_id):
        raise HTTPException(status_code=500, detail="Error deleting schedule")
    return Response(status_code=status.HTTP_204_NO_CONTENT)