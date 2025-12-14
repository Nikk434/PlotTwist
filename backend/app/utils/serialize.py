from bson import ObjectId

def serialize_match(match: dict) -> dict:
    print("PLAYER")
    return {
        "id": str(match["_id"]),
        "status": match.get("status"),
        "hostedBy": {
            "userId": match["hostedBy"]["userId"],
            "username": match["hostedBy"]["username"],
        },
        "participants": match.get("participants", {}),
        "ready_users": match.get("ready_users", []),
    }
