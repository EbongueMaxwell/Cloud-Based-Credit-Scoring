from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from typing import Optional
from datetime import datetime
from enum import Enum

# Enums for consistent values
class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Decision(str, Enum):
    APPROVED = "approved"
    REJECTED = "rejected"
    PENDING = "pending"

class EmploymentStatus(str, Enum):
    EMPLOYED = "employed"
    SELF_EMPLOYED = "self-employed"
    UNEMPLOYED = "unemployed"
    STUDENT = "student"

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str
    email: EmailStr
    username: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: Optional[str] = None
    
class User(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Password reset schemas
class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    token: str
    new_password: str

   
# Prediction schemas
class PredictionBase(BaseModel):
    client_name: str
    credit_score: int
    income: float
    loan_amount: float
    interest_rate: float
    employment: EmploymentStatus
    loan_purpose: str

class PredictionCreate(PredictionBase):
    risk_level: RiskLevel
    decision: Decision

class Prediction(PredictionBase):
    id: int
    risk_level: RiskLevel
    decision: Decision
    timestamp: datetime
    user_id: int
    model_config = ConfigDict(from_attributes=True)

# Response schemas
class StandardResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

# Admin schemas (optional)
class UserAdminView(User):
    created_at: datetime
    last_login: Optional[datetime] = None