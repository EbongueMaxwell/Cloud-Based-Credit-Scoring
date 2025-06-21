import os
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")  # Always use environment variables in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
PASSWORD_RESET_TOKEN_EXPIRE_HOURS = 1

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hashed version"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate a hashed version of the password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """
    Creates a JWT access token with expiration time
    
    Args:
        data: Dictionary containing the claims to encode
        expires_delta: Optional timedelta for token expiration
        
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    logger.info(f"Created access token expiring at {expire}")
    return encoded_jwt

def create_refresh_token(data: dict, expires_delta: timedelta = None) -> str:
    """
    Creates a JWT refresh token with longer expiration time
    
    Args:
        data: Dictionary containing the claims to encode
        expires_delta: Optional timedelta for token expiration
        
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    logger.info(f"Created refresh token expiring at {expire}")
    return encoded_jwt

async def verify_token(token: str, token_type: str = "access") -> Optional[str]:
    """
    Verifies a JWT token and returns the email if valid
    
    Args:
        token: JWT token to verify
        token_type: Expected token type ("access" or "refresh")
        
    Returns:
        Email from the token if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        token_type_check: str = payload.get("type")
        
        if email is None or token_type_check != token_type:
            logger.warning(f"Invalid token payload: email={email}, type={token_type_check}")
            return None
            
        logger.info(f"Verified {token_type} token for {email}")
        return email
    except JWTError as e:
        logger.error(f"Token verification failed: {str(e)}")
        return None

def create_password_reset_token(email: str) -> str:
    """
    Creates a password reset token that expires in 1 hour
    
    Args:
        email: User's email address
        
    Returns:
        Encoded JWT token string
    """
    expires = datetime.utcnow() + timedelta(hours=PASSWORD_RESET_TOKEN_EXPIRE_HOURS)
    to_encode = {"sub": email, "exp": expires, "type": "reset"}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    logger.info(f"Created password reset token for {email} expiring at {expires}")
    return encoded_jwt

async def verify_password_reset_token(token: str) -> Optional[str]:
    """
    Verifies a password reset token
    
    Args:
        token: JWT token to verify
        
    Returns:
        Email from the token if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if email is None or token_type != "reset":
            logger.warning(f"Invalid reset token payload: email={email}, type={token_type}")
            return None
            
        logger.info(f"Verified password reset token for {email}")
        return email
    except JWTError as e:
        logger.error(f"Password reset token verification failed: {str(e)}")
        return None