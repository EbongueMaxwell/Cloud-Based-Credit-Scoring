from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from sqlalchemy.orm import Session
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
import logging
from typing import Optional, List
from pydantic import BaseModel, Field
from . import schemas, crud, auth
from .database import SessionLocal, engine, Base

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Load model and encoders
try:
    model_data = joblib.load('app/credit_scoring_model.pkl')
    model = model_data['model']
    label_encoders = model_data['label_encoders']
    num_cols = model_data['num_cols']
    cat_cols = model_data['cat_cols']
    logger.info("Model and encoders loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    raise RuntimeError(f"Model loading failed: {str(e)}")

# Pydantic models
class CreditApplication(BaseModel):
    client_name: str = Field(default="Applicant")
    age: int = Field(..., gt=18, lt=100)
    income: float = Field(..., gt=0)
    employment: str
    loanAmount: float = Field(..., gt=0)
    loanPurpose: str
    location: str
    phoneUsage: str
    utilityPayments: str
    interestRate: float = Field(..., gt=0, le=30)
    turnover: float = Field(..., gt=0)
    customerTenure: int = Field(..., ge=0)
    avgDaysLateCurrent: int = Field(..., ge=0)
    numLatePaymentsCurrent: int = Field(..., ge=0)
    unpaidAmount: float = Field(..., ge=0)
    industrySector: str
    creditType: str
    hasGuarantee: str
    guaranteeType: str
    repaymentFrequency: str

class CreditScoreResponse(BaseModel):
    client: str
    creditScore: int
    riskLevel: str
    approvalProbability: str
    decision: str
    keyFactors: dict
    modelVersion: str
    timestamp: str

# Feature mapping
FEATURE_MAPPING = {
    "age": "age",
    "income": "income",
    "loanAmount": "loan_amount",
    "interestRate": "interest_rate",
    "turnover": "turnover",
    "customerTenure": "customer_tenure",
    "avgDaysLateCurrent": "avg_days_late_current",
    "numLatePaymentsCurrent": "num_late_payments_current",
    "unpaidAmount": "unpaid_amount",
    "industrySector": "industry_sector",
    "creditType": "credit_type",
    "hasGuarantee": "has_guarantee",
    "guaranteeType": "guarantee_type",
    "repaymentFrequency": "repayment_frequency"
}

# Authentication endpoints
@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(request: Request, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token = request.headers.get("Authorization")
    if not token:
        raise credentials_exception
    try:
        token = token.split(" ")[1] if " " in token else token
        email = await auth.verify_token(token)
        if email is None:
            raise credentials_exception
        user = crud.get_user_by_email(db, email=email)
        if user is None:
            raise credentials_exception
        return user
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise credentials_exception

# Helper functions
def preprocess_input(data: dict) -> pd.DataFrame:
    """Convert form data to model input format"""
    input_dict = {}
    
    for form_field, model_feature in FEATURE_MAPPING.items():
        if form_field in data:
            if model_feature in num_cols:
                input_dict[model_feature] = float(data[form_field])
            elif model_feature == 'has_guarantee':
                input_dict[model_feature] = 1 if str(data[form_field]).lower() in ['yes', 'true', '1'] else 0
            else:
                input_dict[model_feature] = str(data[form_field])
    
    return pd.DataFrame([input_dict])

def encode_categorical_features(df: pd.DataFrame) -> pd.DataFrame:
    """Encode categorical features using saved label encoders with proper unknown value handling"""
    for col in cat_cols:
        if col in df.columns:
            raw_value = df[col].iloc[0]
            str_value = str(raw_value) if not pd.isna(raw_value) else "missing"
            
            # Handle unseen categories by using the most frequent category
            if str_value not in label_encoders[col].classes_:
                logger.warning(f"Unseen category '{str_value}' in column '{col}', using most frequent category")
                str_value = label_encoders[col].classes_[0]
            
            df[col] = label_encoders[col].transform([str_value])[0]
    
    return df

def calculate_credit_score(prob_default: float) -> int:
    """Convert probability of default to credit score (300-850)"""
    odds = (1 - prob_default) / (prob_default + 1e-9)
    score = 300 + (50 * np.log10(odds))
    return int(np.clip(score, 300, 850))

def determine_risk_level(score: int) -> str:
    """Categorize risk based on credit score"""
    if score >= 750:
        return "Very Low"
    elif score >= 650:
        return "Low"
    elif score >= 550:
        return "Medium"
    elif score >= 450:
        return "High"
    return "Very High"

def get_key_factors(input_data: dict) -> dict:
    """Generate key positive/negative factors for decision"""
    factors = {"positive": [], "negative": []}
    
    if input_data.get('income', 0) > 100000:
        factors["positive"].append("High income")
    if input_data.get('customer_tenure', 0) > 24:
        factors["positive"].append("Long customer tenure")
    
    if input_data.get('avg_days_late_current', 0) > 15:
        factors["negative"].append("Frequent late payments")
    if input_data.get('num_late_payments_current', 0) > 3:
        factors["negative"].append("Multiple late payments")
    
    debt_ratio = input_data.get('loan_amount', 0) / max(input_data.get('income', 1), 1)
    if debt_ratio > 0.35:
        factors["negative"].append(f"High debt ratio ({debt_ratio:.0%})")
    
    return factors

# Protected prediction endpoint
@app.post("/predict", response_model=CreditScoreResponse)
async def predict_credit_score(
    application: CreditApplication,
    db: Session = Depends(get_db)
):
    """Endpoint for credit scoring prediction (no authentication required)"""
    try:
        logger.info(f"Received application for {application.client_name}")
        
        app_data = application.dict()
        input_df = preprocess_input(app_data)
        
        try:
            input_df = encode_categorical_features(input_df)
        except ValueError as e:
            logger.error(f"Encoding error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid input data: {str(e)}"
            )
        
        if hasattr(model, 'feature_names_in_'):
            missing_features = set(model.feature_names_in_) - set(input_df.columns)
            if missing_features:
                for feature in missing_features:
                    if feature in cat_cols:
                        input_df[feature] = label_encoders[feature].transform(["missing"])[0]
                    else:
                        input_df[feature] = 0.0
            input_df = input_df[model.feature_names_in_]
        
        prob_default = model.predict_proba(input_df)[0][1]
        score = calculate_credit_score(prob_default)
        approval_prob = 100 * (1 - prob_default)
        decision = "Approved" if score >= 650 else "Approved with conditions" if score >= 550 else "Declined"
        
        # If you still want to store predictions without user association
        prediction_data = {
            "client_name": application.client_name,
            "credit_score": score,
            "risk_level": determine_risk_level(score),
            "decision": decision,
            "income": application.income,
            "loan_amount": application.loanAmount,
            "interest_rate": application.interestRate,
            "employment": application.employment,
            "loan_purpose": application.loanPurpose,
            "user_id": None  # No user association
        }
        
        try:
            crud.create_prediction(db, schemas.PredictionCreate(**prediction_data))
        except Exception as e:
            logger.error(f"Failed to save prediction: {str(e)}")
        
        response = {
            "client": application.client_name,
            "creditScore": score,
            "riskLevel": determine_risk_level(score),
            "approvalProbability": f"{approval_prob:.1f}%",
            "decision": decision,
            "keyFactors": get_key_factors(input_df.iloc[0].to_dict()),
            "modelVersion": "1.0",
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"Processed application for {application.client_name} - Score: {score}")
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )


@app.get("/predictions", response_model=List[schemas.Prediction])
async def get_predictions(
    request: Request,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get historical predictions for the authenticated user"""
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization header missing"
            )
        
        token = auth_header.split(" ")[1] if " " in auth_header else auth_header
        email = await auth.verify_token(token)
        user = crud.get_user_by_email(db, email=email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user"
            )
        
        predictions = crud.get_predictions(db, user_id=user.id, skip=skip, limit=limit)
        return predictions
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching predictions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch predictions"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "model_loaded": model is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)