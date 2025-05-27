# schemas.py
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    username: str
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    username: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
