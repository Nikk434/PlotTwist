# from fastapi import Depends, Security
# from fastapi.security import OAuth2PasswordBearer
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# from fastapi import Request, HTTPException, status
# from app.utils.validate import decode_jwt
# from app.core.database import user_collection
# from bson import ObjectId

# async def get_current_user(request: Request, token: str = Depends(oauth2_scheme)):
#     # fallback if header not found
#     print("TOK 1 ",token)
#     if not token:
#         token = request.cookies.get("authToken")
#         token = request.cookies.get("refresh_token")
#     print("TOK 2 ",token)

#     if not token:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing access token")

#     user_id = decode_jwt(token)
#     user = await user_collection.find_one({"_id": ObjectId(user_id)})
#     if not user:
#         raise HTTPException(status_code=401, detail="User not found")
#     return user
from fastapi import Request, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from app.utils.validate import decode_jwt
from app.core.database import user_collection
from bson import ObjectId

# Keep this for Swagger UI compatibility
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

async def get_current_user(request: Request, token: Optional[str] = Depends(oauth2_scheme)):
    # Priority 1: Check cookies (for browser)
    if not token:
        token = request.cookies.get("access_token")
        token = request.cookies.get("refresh_token")

    # Priority 2: If still no token, check refresh token
    if not token:
        token = request.cookies.get("refresh_token")
        token = request.cookies.get("access_token")

    
    # print("Token found:", token[:20] if token else "None")
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Missing access token"
        )

    try:
        user_id = decode_jwt(token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )
    
    user = await user_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    print("UUU",user)
    return user