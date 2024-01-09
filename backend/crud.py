from sqlalchemy.orm import Session
from sqlalchemy import desc

import models
import schemas
from security import hash_password

# ユーザ
#################################

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        username=user.username,
        hashed_password=hash_password(user.password),
        is_admin=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# 記事
#################################

def get_articles(db: Session, skip: int = 0, limit: int = 30):
    return db.query(models.Article).order_by(desc(models.Article.date)).offset(skip).limit(limit).all()

def get_articles_by_tag(db: Session, tag: str, skip: int = 0, limit: int = 30):
    return db.query(models.Article).filter(models.Article.tag == tag).order_by(desc(models.Article.date)).offset(skip).limit(limit).all()

def get_article_by_id(db: Session, id: int):
    return db.query(models.Article).filter(models.Article.id == id).first()

def create_article(db: Session, article: schemas.ArticleCreate):
    db_article = models.Article(
        is_works = article.is_works,
        tag = article.tag,
        date = article.date,
        title = article.title,
        body = article.body,
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

# 画像
#################################

def get_images(db: Session, article_id: int, skip: int = 0, limit: int = 30):
    return db.query(models.Image).filter(models.Image.article_id == article_id).all()

def get_image_by_path(db: Session, path: str):
    return db.query(models.Image).filter(models.Image.path == path).first()

def create_image(db: Session, image: schemas.ImageCreate, article_id: int):
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    db_image = models.Image(
        path = image.path,
        article_id = article_id,
    )
    
    # 記事に画像を保存
    article.images.append(db_image)

    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image
