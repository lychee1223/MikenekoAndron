from datetime import timedelta

from fastapi import Depends, FastAPI, HTTPException, status, Body, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import mimetypes
from typing import List
import os


import crud
import schemas
import markdown
from db import get_db
from security import (ACCESS_TOKEN_EXPIRE_MINUTES, authenticate_user,
                      create_access_token, get_current_user)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# セキュリティ
#################################

@app.post("/token", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ユーザー名またはパスワードが正しくありません",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# ユーザ
#################################

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db=db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="同じユーザー名がすでに登録済みです")
    return crud.create_user(db=db, user=user)

@app.get("/users/me", response_model=schemas.User)
def read_user_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@app.get("/users/admin", response_model=schemas.User)
def read_admin_user(current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="アクセス権限がありません")
    return current_user

# 記事
#################################

@app.post("/articles", response_model=schemas.Article)
def create_article(article: schemas.ArticleCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="アクセス権限がありません")
    # Articleを作成し、DBに保存
    db_article = crud.create_article(db=db, article=article)
    return db_article

@app.get("/articles", response_model=list[schemas.Article])
def read_articles(skip: int = 0, limit: int = 30, db: Session = Depends(get_db)):
    articles = crud.get_articles(db=db, skip=skip, limit=limit)

    # マークダウンをHTMLに変換
    for article in articles:
        article.body = markdown.markdown(article.body, extensions=['markdown.extensions.fenced_code'])

    return articles

@app.get("/articles/{tag}", response_model=list[schemas.Article])
def read_articles_by_tag(tag:str, skip: int = 0, limit: int = 30, db: Session = Depends(get_db)):
    return crud.get_articles_by_tag(db=db, tag=tag, skip=skip, limit=limit)

# 画像
#################################

@app.post("/images", response_model=list[schemas.Image])
def upload_image(article_id: int, images: List[UploadFile] = File(...), db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="アクセス権限がありません")

    # DBにidのデータがあるかチェック
    # if not crud.get_article_by_id(db=db, id=article_id):

    for image_file in images:
        image_path = f"public/img/{image_file.filename}"

        # ファイル名が同じ画像が存在する場合はスキップ
        existing_image = crud.get_image_by_path(db=db, path=image_file.filename)
        if existing_image:
            continue

        # 画像をサーバに保存
        with open(image_path, "wb") as image:
            image.write(image_file.file.read())
        
        # Imageを作成し、DBに保存
        image_create = schemas.ImageCreate(path=image_file.filename)
        db_image = crud.create_image(db=db, image=image_create, article_id=article_id)
    
    return crud.get_images(db=db, article_id=article_id)

@app.get("/images/{path:path}")
def read_image(path: str):
    image_path = f"public/img/{path}"

    # 画像が存在しない場合
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")
    
    # 画像のメディアタイプを取得
    media_type, _ = mimetypes.guess_type(image_path)

    # メディアタイプが画像でない場合
    if not media_type or not media_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Unsupported media type")

    return FileResponse(image_path, media_type=media_type)