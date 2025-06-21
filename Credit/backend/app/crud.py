from sqlalchemy.orm import Session
from sqlalchemy import desc
from passlib.context import CryptContext
from datetime import datetime
from . import models, schemas
from typing import List, Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User CRUD operations
def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def get_user(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(
    db: Session, 
    user_id: int, 
    user_update: schemas.UserUpdate
) -> Optional[models.User]:
    db_user = get_user(db, user_id)
    if db_user:
        update_data = user_update.dict(exclude_unset=True)
        if "password" in update_data:
            hashed_password = pwd_context.hash(update_data["password"])
            db_user.hashed_password = hashed_password
        db.commit()
        db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not pwd_context.verify(password, user.hashed_password):
        return False
    return user

# Prediction CRUD operations
def create_prediction(
    db: Session, 
    prediction_data: schemas.PredictionCreate,
    user_id: int
) -> models.Prediction:
    db_prediction = models.Prediction(
        **prediction_data.dict(),
        user_id=user_id,
        timestamp=datetime.utcnow()
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

def get_prediction(db: Session, prediction_id: int) -> Optional[models.Prediction]:
    return db.query(models.Prediction).filter(models.Prediction.id == prediction_id).first()

def get_predictions(
    db: Session, 
    user_id: int, 
    skip: int = 0, 
    limit: int = 100,
    order_by: str = "timestamp",
    order_direction: str = "desc"
) -> List[models.Prediction]:
    query = db.query(models.Prediction).filter(models.Prediction.user_id == user_id)
    
    # Apply ordering
    order_column = getattr(models.Prediction, order_by, models.Prediction.timestamp)
    if order_direction.lower() == "desc":
        query = query.order_by(desc(order_column))
    else:
        query = query.order_by(order_column)
    
    return query.offset(skip).limit(limit).all()

def get_user_prediction_count(db: Session, user_id: int) -> int:
    return db.query(models.Prediction).filter(models.Prediction.user_id == user_id).count()

def delete_prediction(db: Session, prediction_id: int, user_id: int) -> bool:
    db_prediction = db.query(models.Prediction).filter(
        models.Prediction.id == prediction_id,
        models.Prediction.user_id == user_id
    ).first()
    if db_prediction:
        db.delete(db_prediction)
        db.commit()
        return True
    return False