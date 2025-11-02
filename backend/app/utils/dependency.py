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

# async def get_current_user(request: Request, token: Optional[str] = Depends(oauth2_scheme)):
#     # Priority 1: Check cookies (for browser)
#     print("TOK 1  = ", token)
#     if not token:
#         token = request.cookies.get("access_token")
#         token = request.cookies.get("refresh_token")
#     print("TOK 2  = ", token)

#     # Priority 2: If still no token, check refresh token
#     if not token:
#         token = request.cookies.get("refresh_token")
#         token = request.cookies.get("access_token")
#     print("TOK 3  = ", token)

    
#     # print("Token found:", token[:20] if token else "None")
    
#     if not token:
#         print("COOKED 1")
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, 
#             detail="Missing access token"
#         )

#     try:
#         user_id = decode_jwt(token)
#     except Exception as e:
#         print("COOKED 2")

#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail=f"Invalid token: {str(e)}"
#         )
    
#     user = await user_collection.find_one({"_id": ObjectId(user_id)})
#     if not user:
#         raise HTTPException(status_code=401, detail="User not found")
#     # print("UUU",user)
#     return user
async def get_current_user(request: Request, token: Optional[str] = Depends(oauth2_scheme)):
    # 1. Check Authorization header (Bearer)
    if token:
        print("Auth header token found")
    else:
        # 2. Otherwise, try cookies
        token = request.cookies.get("access_token")
        if token:
            print("Using access_token from cookies")
        else:
            # 3. Finally, try refresh token only as fallback
            token = request.cookies.get("refresh_token")
            if token:
                print("Using refresh_token (fallback)")
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Missing authentication token"
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

    return user
