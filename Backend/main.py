from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

from domain.user import user_router
from domain.attendance import attendance_router


description = """
기능 목록:

* **Say Hello** (_completely implemented_).
* **Conversation with User** (_not implemented_).
* **Conversation between Npcs** (_not implemented_).
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
]

app = FastAPI(
    title="Class Up",
    # description=description,
    version="0.0.1",
    openapi_tags=tags_metadata
)

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 오리진 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메소드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

STATIC_DIR = "static/profile_image"
os.makedirs(STATIC_DIR, exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(user_router.router)
app.include_router(attendance_router.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7783)