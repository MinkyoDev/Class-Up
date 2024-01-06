from datetime import timedelta, datetime

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Form
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from starlette import status
from pathlib import Path
from uuid import uuid4

from database import get_db
from domain.user import user_crud, user_schema
from domain.user.user_crud import pwd_context

from models import User
from lib.S3 import save_file_in_S3

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
SECRET_KEY = "4ab2fce7a6bd79e1c014396315ed322dd6edb1c5d975c6b74a2904135172c03c"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")

router = APIRouter(
    prefix="/api/user",
)


def get_current_user(token: str = Depends(oauth2_scheme),
                     db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id: str = payload.get("sub")
        if id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    else:
        user = user_crud.get_user(db, user_id=id)
        if user is None:
            raise credentials_exception
        return user


@router.post("/create", 
             description="회원 가입 입니다.", 
             status_code=status.HTTP_204_NO_CONTENT, 
             tags=["User"])
async def user_create(_user_create: user_schema.UserCreate, db: Session = Depends(get_db)):
    user = user_crud.get_existing_user(db, user_create=_user_create)
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="이미 존재하는 사용자입니다.")
    user_crud.create_user(db=db, user_create=_user_create)


@router.post("/login_n", 
             description="로그인 입니다.", 
             response_model=user_schema.Token, 
             tags=["User"])
async def login_for_access_token_n(user_id: str = Form(...), password: str = Form(...),
                             db: Session = Depends(get_db)):

    user = user_crud.get_user(db, user_id)
    if not user or not pwd_context.verify(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect user ID or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.use:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is not active",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    data = {
        "sub": user.user_id,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    access_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.user_id,
        "user_name": user.user_name,
        "email": user.email,
        "phone_number": user.phone_number,
        "profile_image": user.profile_image,
        "employment": user.employment,
        "state": user.state,
        "attendance_type": user.attendance_type,
        "admin": user.admin
    }


@router.post("/login", 
             description="swager 페이지 로그인을 위한 API입니다. 실제로는 사용하지 않을 계획입니다.", 
             response_model=user_schema.Token, 
             tags=["User"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(),
                           db: Session = Depends(get_db)):

    # check user and password
    user = user_crud.get_user(db, form_data.username)
    if not user or not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.use:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is not active",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # make access token
    data = {
        "sub": user.user_id,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    access_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.user_id,
        "user_name": user.user_name,
        "email": user.email,
        "phone_number": user.phone_number,
        "profile_image": user.profile_image,
        "employment": user.employment,
        "state": user.state,
        "attendance_type": user.attendance_type,
        "admin": user.admin
    }


@router.get("/user_list", 
            description="모든 유저를 조회합니다.", 
            response_model=list[user_schema.UserState], 
            tags=["User"])
async def get_user_list(db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_user)):
    _user_list = user_crud.get_user_state(db)
    return _user_list


@router.get("/users/{user_id}", 
            description="해당 유저의 정보를 조회합니다.", 
            response_model=user_schema.UserResponse, 
            tags=["User"])
async def read_user(db: Session = Depends(get_db),
              current_user: User = Depends(get_current_user)):
    db_user = user_crud.get_user_by_id(db, current_user.user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    return db_user


@router.put("/update/{user_id}", 
            description="회원 정보를 수정합니다.", 
            response_model=user_schema.UserState, 
            tags=["User"])
async def update_user_info(password: str, 
                     user_update: user_schema.UserUpdate, 
                     db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_user)):
    user = user_crud.get_existing_user_for_update(db, user_create=user_update)
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="이미 존재하는 사용자입니다.")
    updated_user = user_crud.update_user(db, current_user.user_id, password, user_update)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found or password incorrect")
    return updated_user


@router.put("/deactivate/{user_id}", 
            description="해당 유저를 비활성화 시킵니다.", 
            tags=["User"])
async def deactivate_user_account(db: Session = Depends(get_db),
                            current_user: User = Depends(get_current_user)):
    deactivated_user = user_crud.deactivate_user(db, current_user.user_id)
    if deactivated_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"msg": "User deactivated successfully"}


@router.post("/change_profile_image", 
             description="프로필 사진을 변경합니다.", 
             tags=["User"])
async def change_profile_image(file: UploadFile = File(...), 
                               db: Session = Depends(get_db), 
                               current_user: User = Depends(get_current_user)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image")

    file_name = f"{uuid4()}{Path(file.filename).suffix}"
    object_name = f'profile_image/user_image/{file_name}'
    file_path = save_file_in_S3(file.file, object_name)

    if file_path is None:
        raise HTTPException(status_code=500, detail="Error uploading file to S3")

    user_crud.update_user_profile_image(db, current_user.user_id, file_path)

    return {"filename": file_path}