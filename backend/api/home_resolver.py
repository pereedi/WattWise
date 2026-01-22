import duckdb
from pathlib import Path
from fastapi import HTTPException

BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "db" / "wattwise_fixed.duckdb"

def get_con():
    return duckdb.connect(str(DB_PATH), read_only=True)

def resolve_home_id(user_id: str) -> str:
    with get_con() as con:
        row = con.execute(
            "SELECT home_id FROM homes WHERE user_id = ?",
            [user_id],
        ).fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Home not found")

    return row[0]
