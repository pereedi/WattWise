from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import duckdb
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "db" / "wattwise_fixed.duckdb"

app = FastAPI(title="WattWise API", version="1.0")

# ✅ CORS (allows your React dev server to call the API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175", "http://127.0.0.1:5175", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_con():
    return duckdb.connect(str(DB_PATH), read_only=True)

@app.get("/")
def root():
    return {"message": "WattWise API is running"}

# ---- Metadata ----
@app.get("/api/v1/homes")
def homes():
    with get_con() as con:
        return con.execute("SELECT * FROM homes").fetchdf().to_dict("records")

@app.get("/api/v1/appliances")
def appliances():
    with get_con() as con:
        return con.execute("SELECT * FROM appliances").fetchdf().to_dict("records")

# ---- Live snapshot ----
@app.get("/api/v1/live/home")
def live_home(home_id: str):
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

# ---- Time series ----
@app.get("/api/v1/timeseries/home-daily")
def home_daily(home_id: str, start: str, end: str):
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
def appliance_daily(home_id: str, appliance_id: str, start: str, end: str):
    q = """
    SELECT date, energy_kwh, cost_gbp
    FROM v_home_appliance_daily
    WHERE home_id = ?
      AND appliance_id = ?
      AND date BETWEEN ? AND ?
    ORDER BY date
    """
    with get_con() as con:
        return con.execute(q, [home_id, appliance_id, start, end]).fetchdf().to_dict("records")

# ---- Peak vs off-peak ----
@app.get("/api/v1/cost/peak-offpeak-daily")
def peak_offpeak(home_id: str, start: str, end: str):
    q = """
    SELECT date, tou_period, energy_kwh, cost_gbp
    FROM v_peak_offpeak_daily
    WHERE home_id = ?
      AND date BETWEEN ? AND ?
    ORDER BY date, tou_period
    """
    with get_con() as con:
        return con.execute(q, [home_id, start, end]).fetchdf().to_dict("records")
# ---- Appliances Time Series ----
@app.get("/api/v1/timeseries/all-appliances-daily")
def all_appliances_daily(home_id: str, start: str, end: str):
    q = """
    SELECT date, appliance_id, energy_kwh, cost_gbp
    FROM v_home_appliance_daily
    WHERE home_id = ?
      AND date BETWEEN ? AND ?
    ORDER BY date, appliance_id
    """
    with get_con() as con:
        return con.execute(q, [home_id, start, end]).fetchdf().to_dict("records")
