from fastapi import Header, HTTPException, Depends, APIRouter
from pydantic import BaseModel
import duckdb
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "db" / "wattwise_fixed.duckdb"

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

class LoginRequest(BaseModel):
    user_id: str
    password: str

def get_con():
    return duckdb.connect(str(DB_PATH), read_only=True)

@router.post("/login")
def login(req: LoginRequest):
    with get_con() as con:
        user = con.execute(
            "SELECT user_id FROM users WHERE user_id = ? AND password = ?",
            [req.user_id, req.password],
        ).fetchone()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Simple token is just the user_id for now as per plan
    return {"token": user[0], "user_id": user[0]}

def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token")

    token = authorization.replace("Bearer ", "").strip()

    with get_con() as con:
        user = con.execute(
            "SELECT user_id FROM users WHERE user_id = ?",
            [token],
        ).fetchone()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user[0]
