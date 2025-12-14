import socketio

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)

# socket events live here
@sio.event
async def connect(sid, environ):
    print("[SOCKET] Connected:", sid)

@sio.event
async def join_lobby(sid, match_id):
    await sio.enter_room(sid, match_id)
    print("[SOCKET] Joined lobby:", match_id)

@sio.event
async def leave_lobby(sid, match_id):
    await sio.leave_room(sid, match_id)
    print("[SOCKET] Left lobby:", match_id)

@sio.event
async def disconnect(sid):
    print("[SOCKET] Disconnected:", sid)
