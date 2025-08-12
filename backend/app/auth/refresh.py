from fastapi import APIRouter, Request, Response, HTTPException, status
from auth.refresh import create_access_token, decode_token, create_refresh_token

router = APIRouter()

@router.post("/refresh", status_code=200)
async def refresh_token(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")
    access_token = request.cookies.get("access_token")
    
    print(f"Refresh token received: {refresh_token}")
    print(f"Access token received: {access_token}")
    print(f"Total cookies count: {len(request.cookies)}")
    
    print("=" * 50)
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token provided")

    payload = decode_token(refresh_token)
    if not payload:
       raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid token payload"
        )
    
    # Issue a new access token
    new_access_token = create_access_token(data={"sub": user_id})


    # # Issue a new refresh token (token rotation)
    new_refresh_token = create_refresh_token(data={"sub": user_id})
    return {
        "message": "Access token refreshed successfully",
        "new_access_token":new_access_token,
        "new_refresh_token":new_refresh_token    
    }
    # response.set_cookie(
    #     key="access_token",
    #     value=new_access_token,
    #     httponly=True,
    #     secure=False,  # set False if local
    #     samesite="Strict",
    #     max_age=15 * 60,
    #     path="/"
    # )
    # response.set_cookie(
    #     key="refresh_token",
    #     value=new_refresh_token,
    #     httponly=True,
    #     secure=False,
    #     samesite="Lax",
    #     max_age=7 * 24 * 60 * 60,
    #     path="/"  # ✅ Changed from "/auth/refresh" to "/auth"
    # )