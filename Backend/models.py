from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Date
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
    profile_color = Column(String(255), unique=False, nullable=True)
    employment = Column(Boolean, nullable=False)
    state = Column(Boolean, nullable=False)
    attendance_type = Column(Boolean, nullable=False)
    admin = Column(Boolean, nullable=False)
    use = Column(Boolean, nullable=False)


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True)
    user_id = Column(String(255), ForeignKey('user.user_id'), nullable=False)
    time = Column(DateTime, nullable=True)
    date = Column(Date, nullable=False)
    state = Column(String(255), nullable=False)

    user = relationship("User", foreign_keys=[user_id]) 


class UserSchedules(Base):
    __tablename__ = "schedules"

    schedule_id = Column(Integer, primary_key=True)
    user_id = Column(String(255), ForeignKey('user.user_id'), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
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
    

class FBComment(Base):
    __tablename__ = "fb_comment"

    comment_id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey('free_board.post_id'), nullable=False)
    user_id = Column(String(255), ForeignKey('user.user_id'), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    user = relationship("User", foreign_keys=[user_id])
    post = relationship("FreeBoard", foreign_keys=[post_id])

    def __repr__(self):
        return f"<Comment(comment_id={self.comment_id}, post_id={self.post_id}, user_id={self.user_id})>"