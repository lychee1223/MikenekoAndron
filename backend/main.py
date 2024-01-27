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
    # DBに既にユーザが存在しないかチェック
    if crud.get_user_by_username(db=db, username=user.username):
        raise HTTPException(status_code=400, detail="同じユーザー名がすでに登録済みです")
    
    # ユーザを作成
    return crud.create_user(db=db, user=user)

@app.get("/users/me", response_model=schemas.User)
def read_user_me(current_user: schemas.User = Depends(get_current_user)):
    # ログイン中のユーザ情報を取得
    return current_user

# 記事
#################################

@app.post("/articles", response_model=schemas.Article)
def create_article(article: schemas.ArticleCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    # 管理者権限をチェック
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="アクセス権限がありません")

    # 記事を作成
    return crud.create_article(db=db, article=article)

@app.get("/articles", response_model=list[schemas.Article])
def read_articles(is_works: bool, skip: int = 0, limit: int = 30, db: Session = Depends(get_db)):
    # 記事を取得
    db_articles = crud.get_articles(db=db, is_works=is_works, skip=skip, limit=limit)

    # マークダウンをHTMLに変換
    for article in db_articles:
        article.body = markdown.markdown(article.body, extensions=['markdown.extensions.fenced_code'])

    return db_articles

@app.get("/articles/{id}", response_model=schemas.Article)
def read_article(id: int, db: Session = Depends(get_db)):
    db_article = crud.get_article_by_id(db=db, id=id)

    # DBに記事が存在するかチェック
    if not db_article:
        raise HTTPException(status_code=404, detail="記事が見つかりません")

    return db_article

@app.put("/articles", response_model=schemas.Article)
def update_article(id: int, article: schemas.ArticleUpdate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    # 管理者権限をチェック
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="アクセス権限がありません")

    # DBに記事が存在するかチェック
    if not crud.get_article_by_id(db=db, id=id):
        raise HTTPException(status_code=404, detail="記事が見つかりません")

    # 記事を更新
    return crud.update_article(db=db, id=id, article=article)

@app.delete("/articles")
def delete_article(id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    # 管理者権限をチェック
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="アクセス権限がありません")

    # 画像のentityをサーバから削除
    db_images = crud.get_images_by_article_id(db=db, article_id=id)
    for image in db_images:
        image_path = f"public/img/{image.path}"
        if os.path.exists(image_path):
            os.remove(image_path)

    # 記事を削除
    return crud.delete_article(db=db, id=id)

# 画像
#################################

@app.post("/images", response_model=list[schemas.Image])
def create_images(article_id: int, images: List[UploadFile] = File(...), db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    # 管理者権限をチェック
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="アクセス権限がありません")

    # DBに記事が存在するかチェック
    if not crud.get_article_by_id(db=db, id=article_id):
        raise HTTPException(status_code=404, detail="記事が見つかりません")

    for image_file in images:
        path = f"{article_id}_{image_file.filename}"    # DBに保存するパス
        image_path = f"public/img/{path}"               # 画像のentityのパス

        # 画像のentityをサーバに保存
        with open(image_path, "wb") as image:
            image.write(image_file.file.read())
        
        # 画像を保存
        image_create = schemas.ImageCreate(path=path)
        db_image = crud.create_image(db=db, image=image_create, article_id=article_id)
    
    return crud.get_images_by_article_id(db=db, article_id=article_id)

@app.get("/images")
def read_image(path: str):
    image_path = f"public/img/{path}"   # 画像のentityのパス

    # 画像のentityが存在するかチェック
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")
    
    # 画像のメディアタイプを取得
    media_type, _ = mimetypes.guess_type(image_path)

    # メディアタイプが画像かチェック
    if not media_type or not media_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Unsupported media type")

    # 画像を取得
    return FileResponse(image_path, media_type=media_type)

@app.put("/images", response_model=list[schemas.Image])
def update_images(article_id: int, images: List[UploadFile] = File(default=[]), db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    # 管理者権限をチェック
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="アクセス権限がありません")

    # DBに記事が存在するかチェック
    if not crud.get_article_by_id(db=db, id=article_id):
        raise HTTPException(status_code=404, detail="記事が見つかりません")

    # 画像のentityをサーバから削除
    db_images = crud.get_images_by_article_id(db=db, article_id=article_id)
    for image in db_images:
        image_path = f"public/img/{image.path}" # 画像のentityのパス
        if os.path.exists(image_path):
            os.remove(image_path)
    
    # DBから画像を削除
    crud.delete_images(db=db, article_id=article_id)

    for image_file in images:
        image_path = f"public/img/{image_file.filename}"

        # 画像のentityをサーバに保存
        with open(image_path, "wb") as image:
            image.write(image_file.file.read())
        
        # 画像を保存
        image_create = schemas.ImageCreate(path=image_file.filename)
        db_image = crud.create_image(db=db, image=image_create, article_id=article_id)
    
    return crud.get_images_by_article_id(db=db, article_id=article_id)