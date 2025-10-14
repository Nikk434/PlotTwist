from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from baauth import register
from app.auth import register  # This is your /register route module
from app.auth import login
from app.auth import refresh
# from routers import protected_route
# from services import user_profile
from app.services import user_profile
from app.services import add_progress 
# from set_reminders import set
# from notification import send, subscribe
# from set_reminders import router as set_or_update_reminder
# from routers.notifications import router as notification_router
from app.match.setting import validate
from app.services import editor
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080", "http://127.0.0.1:8080"],  # Add your frontend URLs
    allow_credentials=True,  # THIS IS THE KEY LINE - allows cookies
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include the router from register.py
app.include_router(register.router, prefix="/auth", tags=["Auth"])
app.include_router(login.router, prefix="/auth", tags=["Auth"])
# app.include_router(protected_route.router, tags=["home"])
app.include_router(refresh.router,prefix="/auth",tags=["Auth"])
app.include_router(user_profile.router,prefix="/auth",tags=["Profile"])
app.include_router(add_progress.router,tags=["Progress"])
app.include_router(editor.router)
# app.include_router(set.router,tags=["Set Reminder"])
# app.include_router(notification_router)
# app.include_router(send.router,tags=["U send noti"])
# app.include_router(subscribe.router,tags=["noti hora ke"])
app.include_router(validate.router,tags=["pop"])

