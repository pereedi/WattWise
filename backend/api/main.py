from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import duckdb
from pathlib import Path

# --------------------------------------------------
# Paths & App
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "db" / "wattwise_fixed.duckdb"

from .auth import router as auth_router, get_current_user
from .home_resolver import resolve_home_id

app = FastAPI(title="WattWise API", version="1.0")
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# DB Connection
# --------------------------------------------------

def get_con():
    return duckdb.connect(str(DB_PATH), read_only=True)

# --------------------------------------------------
# Root
# --------------------------------------------------

@app.get("/")
def root():
    return {"message": "WattWise API is running"}

# --------------------------------------------------
# Identity
# --------------------------------------------------

@app.get("/api/v1/me/home")
def my_home(user_id: str = Depends(get_current_user)):
    with get_con() as con:
        return (
            con.execute(
                "SELECT * FROM homes WHERE user_id = ?",
                [user_id],
            )
            .fetchdf()
            .to_dict("records")[0]
        )

# --------------------------------------------------
# Appliances
# --------------------------------------------------

@app.get("/api/v1/appliances")
def appliances(user_id: str = Depends(get_current_user)):
    home_id = resolve_home_id(user_id)

    with get_con() as con:
        return (
            con.execute(
                "SELECT * FROM appliances WHERE home_id = ?",
                [home_id],
            )
            .fetchdf()
            .to_dict("records")
        )

# --------------------------------------------------
# Live Snapshot
# --------------------------------------------------

@app.get("/api/v1/live/home")
def live_home(user_id: str = Depends(get_current_user)):
    home_id = resolve_home_id(user_id)

    q = """
    SELECT
      appliance_id,
      SUM(power_w) AS power_w
    FROM appliance_readings
    WHERE home_id = ?
      AND ts = (SELECT MAX(ts) FROM appliance_readings)
    GROUP BY appliance_id
    """

    with get_con() as con:
        return con.execute(q, [home_id]).fetchdf().to_dict("records")

# --------------------------------------------------
# Time Series
# --------------------------------------------------

@app.get("/api/v1/timeseries/home-daily")
def home_daily(
    start: str,
    end: str,
    user_id: str = Depends(get_current_user),
):
    home_id = resolve_home_id(user_id)

    q = """
    SELECT date, energy_kwh, cost_gbp
    FROM v_home_daily
    WHERE home_id = ?
      AND date BETWEEN ? AND ?
    ORDER BY date
    """

    with get_con() as con:
        return con.execute(q, [home_id, start, end]).fetchdf().to_dict("records")


@app.get("/api/v1/timeseries/appliance-daily")
def appliance_daily(
    appliance_id: str,
    start: str,
    end: str,
    user_id: str = Depends(get_current_user),
):
    home_id = resolve_home_id(user_id)

    q = """
    SELECT date, energy_kwh, cost_gbp
    FROM v_home_appliance_daily
    WHERE home_id = ?
      AND appliance_id = ?
      AND date BETWEEN ? AND ?
    ORDER BY date
    """

    with get_con() as con:
        return con.execute(
            q,
            [home_id, appliance_id, start, end],
        ).fetchdf().to_dict("records")


@app.get("/api/v1/timeseries/all-appliances-daily")
def all_appliances_daily(
    start: str,
    end: str,
    user_id: str = Depends(get_current_user),
):
    home_id = resolve_home_id(user_id)

    q = """
    SELECT date, appliance_id, energy_kwh, cost_gbp
    FROM v_home_appliance_daily
    WHERE home_id = ?
      AND date BETWEEN ? AND ?
    ORDER BY date, appliance_id
    """

    with get_con() as con:
        return con.execute(q, [home_id, start, end]).fetchdf().to_dict("records")

# --------------------------------------------------
# Peak vs Off-Peak
# --------------------------------------------------

@app.get("/api/v1/cost/peak-offpeak-daily")
def peak_offpeak(
    start: str,
    end: str,
    user_id: str = Depends(get_current_user),
):
    home_id = resolve_home_id(user_id)

    q = """
    SELECT date, tou_period, energy_kwh, cost_gbp
    FROM v_peak_offpeak_daily
    WHERE home_id = ?
      AND date BETWEEN ? AND ?
    ORDER BY date, tou_period
    """

    with get_con() as con:
        return con.execute(q, [home_id, start, end]).fetchdf().to_dict("records")
