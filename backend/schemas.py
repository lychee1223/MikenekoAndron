from pydantic import BaseModel
from datetime import datetime
from fastapi import UploadFile

# セキュリティ
#################################

class Token(BaseModel):
    access_token: str
    token_type: str

# ユーザ
#################################

class User(BaseModel):
    id: int
    username: str
    is_admin: bool

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    password: str

# 画像
#################################

class Image(BaseModel):
    id: int
    path: str

    class Config:
        from_attributes = True

class ImageCreate(BaseModel):
    path: str
    

# 記事
#################################

class Article(BaseModel):
    id: int
    is_works: bool
    tag: str
    date: datetime
    title: str
    body: str
    images: list[Image] = []

    class Config:
        from_attributes = True

class ArticleCreate(BaseModel):
    is_works: bool
    tag: str
    date: datetime
    title: str
    body: str

class ArticleUpdate(BaseModel):
    tag: str
    date: datetime
    title: str
    body: str