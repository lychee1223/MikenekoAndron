from sqlalchemy.orm import Session
from sqlalchemy import desc

import models
import schemas
from security import hash_password

# ユーザ
#################################

def create_user(db: Session, user: schemas.UserCreate):
    # インスタンスを作成
    db_user = models.User(
        username=user.username,
        hashed_password=hash_password(user.password),
        is_admin=False
    )

    # DBにユーザを保存
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

# 記事
#################################

def create_article(db: Session, article: schemas.ArticleCreate):
    # インスタンスを作成
    db_article = models.Article(
        is_works = article.is_works,
        tag = article.tag,
        date = article.date,
        title = article.title,
        body = article.body,
    )

    # DBに記事を保存
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def get_articles(db: Session, is_works: bool, skip: int = 0, limit: int = 30):
    return db.query(models.Article).filter(models.Article.is_works == is_works).order_by(desc(models.Article.date), desc(models.Article.id)).offset(skip).limit(limit).all()

def get_article_by_id(db: Session, id: int):
    return db.query(models.Article).filter(models.Article.id == id).first()

def update_article(db: Session, id: int, article: schemas.ArticleUpdate):
    # DBの記事を更新
    db_article = db.query(models.Article).filter(models.Article.id == id).first()
    for field, value in vars(article).items():
        setattr(db_article, field, value)

    db.commit()
    db.refresh(db_article)
    return db_article

def delete_article(db: Session, id: int):
    # DBから記事を削除
    db_article = db.query(models.Article).filter(models.Article.id == id).first()
    db.delete(db_article)
    db.commit()
    return


# 画像
#################################

def create_image(db: Session, image: schemas.ImageCreate, article_id: int):
    # インスタンスを作成
    db_image = models.Image(
        path = image.path,
        article_id = article_id,
    )
    
    # 画像と記事を関連付け
    db_article = db.query(models.Article).filter(models.Article.id == article_id).first()
    db_article.images.append(db_image)

    # 画像をDBに保存
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def get_images_by_article_id(db: Session, article_id: int):
    return db.query(models.Image).filter(models.Image.article_id == article_id).all()

def get_image_by_path(db: Session, path: str):
    return db.query(models.Image).filter(models.Image.path == path).first()

def delete_images(db: Session, article_id: int):
    # 記事に関連する画像を削除
    db_article = db.query(models.Article).filter(models.Article.id == article_id).first()
    db_article.images = []

    # DBから画像を削除
    db_images = db.query(models.Image).filter(models.Image.article_id == article_id).all()
    for image in db_images:
        db.delete(image)
    db.commit()
    return
