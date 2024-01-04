from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

from apscheduler.schedulers.background import BackgroundScheduler
from lib.schedulers import scheduled_task, backup_database

from domain.user import user_router
from domain.attendance import attendance_router
from domain.admin import admin_router
from domain.schedules import schedules_router
from domain.freeboard import freeboard_router
from domain.fb_comment import fb_comment_router


description = """
**Class Up은 스터디의 출석 관리를 위한 웹페이지 입니다.**

기능 목록:

* **User** (_completely implemented_).
* **Attendance** (_not implemented_).
* **Schedules** (_not implemented_).
* **Freeboard** (_not implemented_).
* **Admin** (_not implemented_).
"""

tags_metadata = [
    {
        "name": "User",
        "description": "유저 관련 API입니다.",
    },
    {
        "name": "Attendance",
        "description": "출석 관리를 위한 API입니다.",
    },
    {
        "name": "Schedules",
        "description": "스케줄 관리를 위한 API입니다.",
    },
    {
        "name": "Freeboard",
        "description": "자유 게시판을 위한 API입니다.",
    },
    {
        "name": "Freeboard Comment",
        "description": "자유 게시판의 댓글 기능을 위한 API입니다.",
    },
    {
        "name": "Admin",
        "description": "관리자를 위한 API입니다.",
    },
]

app = FastAPI(
    title="Class Up",
    description=description,
    version="0.0.1",
    openapi_tags=tags_metadata
)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 오리진 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메소드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

# Make Static directory
STATIC_DIR = "static/profile_image"
os.makedirs(STATIC_DIR, exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

# Scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(scheduled_task, 'cron', hour=12, minute=1)
scheduler.start()

backup_database()

# Router
app.include_router(user_router.router)
app.include_router(attendance_router.router)
app.include_router(admin_router.router)
app.include_router(schedules_router.router)
app.include_router(freeboard_router.router)
app.include_router(fb_comment_router.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7783)