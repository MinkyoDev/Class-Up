from passlib.context import CryptContext
from sqlalchemy.orm import Session
from domain.user.user_schema import UserCreate, UserUpdate
from models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_user(db: Session, user_create: UserCreate):
    db_user = User(user_id=user_create.user_id,
                   user_name=user_create.user_name,
                   password=pwd_context.hash(user_create.password1),
                   email=user_create.email,
                   phone_number=user_create.phone_number,
                   profile_image = 'static/profile_image/default.png',
                   state=True,
                   attendance_type=True,
                   admin=False,
                   use=True)
    db.add(db_user)
    db.commit()


def get_existing_user(db: Session, user_create: UserCreate):
    return db.query(User).filter(
        (User.user_id == user_create.user_id) |
        (User.user_name == user_create.user_name) |
        (User.email == user_create.email) |
        (User.phone_number == user_create.phone_number)
    ).first()


def get_existing_user_for_update(db: Session, user_create: UserCreate):
    return db.query(User).filter(
        (User.email == user_create.email) |
        (User.phone_number == user_create.phone_number)
    ).first()
    
    
def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.user_id == user_id).first()


def get_user_state(db: Session):
    user_list = db.query(User).filter(User.use == True).order_by(User.user_id).all()
    return user_list


def get_user_by_id(db: Session, user_id: str):
    return db.query(User).filter(User.user_id == user_id).first()


def update_user(db: Session, user_id: str, password: str, user_update: UserUpdate):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if db_user is None:
        return None
    if not pwd_context.verify(password, db_user.password):
        return None
    
    if user_update.user_name is not None:
        db_user.user_name = user_update.user_name
    if user_update.email is not None:
        db_user.email = user_update.email
    if user_update.phone_number is not None:
        db_user.phone_number = user_update.phone_number

    if user_update.new_password is not None:
        db_user.password = pwd_context.hash(user_update.new_password)

    db.commit()
    db.refresh(db_user)
    return db_user


def deactivate_user(db: Session, user_id: str):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if db_user is None:
        return None

    db_user.use = False
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user_profile_image(db: Session, user_id: str, image_path: str):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if db_user:
        db_user.profile_image = image_path
        db.commit()
        return db_user
