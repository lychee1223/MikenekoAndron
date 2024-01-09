from sqlalchemy import Column, Boolean, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean)

class Article(Base):
    __tablename__ = "articles"
    
    id = Column(Integer, primary_key=True, index=True)
    is_works = Column(Boolean)
    tag = Column(String)
    date = Column(DateTime)
    title = Column(String)
    body = Column(Text)
    images = relationship("Image", back_populates="article")

class Image(Base):
    __tablename__ = "images"
    
    id = Column(Integer, primary_key=True, index=True)
    path = Column(String, unique=True)
    article_id = Column(Integer, ForeignKey('articles.id'))
    article = relationship("Article", back_populates="images")