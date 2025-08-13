from datetime import datetime,timedelta
from jose import jwt
from app.core.config import JWT_SECRET,JWT_ALGO,JWT_EXPIRY

from jose import JWTError, jwt

def decode_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        return payload
    except JWTError:
        return None


def create_access_token(data: dict):
    to_encode = data.copy()
    now = datetime.utcnow()
    expire = now+timedelta(minutes=JWT_EXPIRY)
    print("EXP",expire)

    to_encode.update({
        "iat":now,
        "exp":expire,
    })

    encode_jwt=jwt.encode(to_encode,JWT_SECRET,algorithm=JWT_ALGO)
    return encode_jwt

def create_refresh_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
    to_encode = data.copy()
    now = datetime.utcnow()
    to_encode.update({
        "iat": now,
        "exp": now + expires_delta
    })
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGO )