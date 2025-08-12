from datetime import timedelta
from dotenv import load_dotenv
import os

load_dotenv()

JWT_SECRET = os.getenv("JWT_KEY") 
JWT_ALGO = "HS256"
JWT_EXPIRY = 15