from fastapi import Depends, Security
from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
from fastapi import Request, HTTPException, status
from app.utils.validate import decode_jwt
from app.core.database import user_collection
from bson import ObjectId

async def get_current_user(request: Request, token: str = Depends(oauth2_scheme)):
    # fallback if header not found
    if not token:
        token = request.cookies.get("authToken")

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing access token")

    user_id = decode_jwt(token)
    user = await user_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user