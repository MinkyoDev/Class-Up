from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "user"

    user_id = Column(String(255), primary_key=True)
    user_name = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone_number = Column(String(255), unique=True, nullable=False)
    profile_image = Column(String(255), unique=False, nullable=False)
    employment = Column(Boolean, nullable=False)
    state = Column(Boolean, nullable=False)
    attendance_type = Column(Boolean, nullable=False)
    admin = Column(Boolean, nullable=False)
    use = Column(Boolean, nullable=False)


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True)
    user_id = Column(String(255), ForeignKey('user.user_id'), nullable=False)
    time = Column(DateTime, nullable=False)
    state = Column(String(255), nullable=False)

    user = relationship("User", foreign_keys=[user_id]) 


class UserSchedules(Base):
    __tablename__ = "schedules"

    schedule_id = Column(Integer, primary_key=True)
    user_id = Column(String(255), ForeignKey('user.user_id'), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    user = relationship("User", foreign_keys=[user_id])


class FreeBoard(Base):
    __tablename__ = "free_board"

    post_id = Column(Integer, primary_key=True)
    user_id = Column(String(255), ForeignKey('user.user_id'), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String(255), unique=False, nullable=True)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    user = relationship("User", foreign_keys=[user_id])

    def __repr__(self):
        return f"<FreeBoard(post_id={self.post_id}, title={self.title}, image_url={self.image_url})>"