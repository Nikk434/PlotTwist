from jose import JWTError,jwt
from fastapi import HTTPException, status
from datetime import datetime
from auth.jwt_utils import JWT_ALGO,JWT_EXPIRY,JWT_SECRET

def decode_jwt(token):
    try:
        payload = jwt.decode(token,JWT_SECRET,algorithms=JWT_ALGO)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status=404,
                detail="Token missing user id",
                headers={"WWW-Authentication":"Bearer"},
            )
        
        exp = payload.get("exp")
        if exp and datetime.utcfromtimestamp(exp)<datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authentication":"Bearer"},
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authentication":"Bearer"},
        ) 