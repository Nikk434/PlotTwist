# from fastapi import APIRouter, HTTPException, status
# from models.User import UserCreate, UserModel
# from database import user_collection  # Motor collection
# from utils.hash import verify_password
# from utils.jwt import create_jwt_token  
# from pymongo.errors import DuplicateKeyError
# from pydantic import BaseModel

# router = APIRouter()

# class LoginRequest(BaseModel):
#     name:str
#     password:str

# @router.post("/login",status_code=200)
# async def login(creds: LoginRequest):
#     db_user =  await user_collection.find_one({"name":creds.name})
#     print(creds.name)
#     if not db_user:
#         raise HTTPException(
#             status_code=404,
#             detail = "User not found"
#         )

#     if not verify_password(creds.password,db_user["password"]):
#         raise HTTPException(
#             status_code=401,
#             detail = "Wrong password"
#         )
#     token = create_jwt_token(data={"sub":str(db_user["_id"])})
#     return {
#         "message":"Welcome back "+str(creds.name)+"!",
#         "user_id":str(db_user["_id"]),
#         "access_token":token,
#         "token_type":"bearer"
#     }
 

from fastapi import APIRouter, HTTPException, status, Response
from models.User import UserModel
from core.database import user_collection
from utils.hash import verify_password
from auth.jwt_utils import create_access_token, create_refresh_token
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    name: str
    password: str

@router.post("/login", status_code=200)
async def login(creds: LoginRequest, response: Response):
    db_user = await user_collection.find_one({"name": creds.name})
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(creds.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Wrong password")

    user_id = str(db_user["_id"])
    access_token = create_access_token(data={"sub": user_id})
    refresh_token = create_refresh_token(data={"sub": user_id})

    print("ACCESS = ",access_token)
    print("REFRES = ",refresh_token)

    # Set access token cookie
    # try:
    #     response.set_cookie(
    #         key="access_token",
    #         value=access_token,
    #         httponly=True,
    #         secure=False,  # Set to False for local testing
    #         samesite="Strict",
    #         max_age=15 * 60,
    #         path="/"
    #     )
    #     print("✓ Access token cookie set successfully")
    # except Exception as e:
    #     print(f"✗ Error setting access token cookie: {e}")


    # # Set refresh token cookie
    # try:
    #     response.set_cookie(
    #     key="refresh_token",
    #     value=refresh_token,
    #     httponly=True,
    #     secure=False,
    #     samesite="Lax",
    #     max_age=7 * 24 * 60 * 60,
    #     path="/"
    # )
    #     print("✓ refres token cookie set successfully")
    # except Exception as e:
    #     print(f"✗ Error setting refresh token cookie: {e}")


    return {
        "message": f"Welcome back {creds.name}!",
        "user_id": user_id,
        "access_token":access_token,
        "refresh_token":refresh_token
    }
