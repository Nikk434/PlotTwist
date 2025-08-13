from fastapi import APIRouter, HTTPException, status
from app.models.User import UserCreate, UserModel
from app.core.database import user_collection  # Motor collection
from app.utils.hash import hash_password
from pymongo.errors import DuplicateKeyError

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    # Check for duplicate email
    if await user_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check for duplicate name (username)
    if await user_collection.find_one({"name": user.name}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    # Hash the password
    hashed_pw = hash_password(user.password)

    # Prepare user data for DB
    user_dict = user.dict()
    user_dict["password"] = hashed_pw

    try:
        result = await user_collection.insert_one(user_dict)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists with provided details"
        )

    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }
