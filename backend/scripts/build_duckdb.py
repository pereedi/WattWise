import pandas as pd
import duckdb
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]

DATA_DIR = BASE_DIR / "data" / "wattwise_mvp_data"
DB_DIR = BASE_DIR / "db"
DB_DIR.mkdir(exist_ok=True)

DB_PATH = DB_DIR / "wattwise_mvp.duckdb"

homes = pd.read_csv(DATA_DIR / "homes.csv")
appliances = pd.read_csv(DATA_DIR / "appliances.csv")
home_appliances = pd.read_csv(DATA_DIR / "home_appliances.csv")
tariffs = pd.read_csv(DATA_DIR / "tariffs.csv")
calendar_features = pd.read_csv(DATA_DIR / "calendar_features.csv")
readings = pd.read_csv(DATA_DIR / "appliance_readings.csv")

if DB_PATH.exists():
    DB_PATH.unlink()

con = duckdb.connect(str(DB_PATH))

con.register("homes_df", homes)
con.register("appliances_df", appliances)
con.register("home_appliances_df", home_appliances)
con.register("tariffs_df", tariffs)
con.register("calendar_features_df", calendar_features)
con.register("readings_df", readings)

con.execute("CREATE TABLE homes AS SELECT * FROM homes_df;")
con.execute("CREATE TABLE appliances AS SELECT * FROM appliances_df;")
con.execute("CREATE TABLE home_appliances AS SELECT * FROM home_appliances_df;")
con.execute("CREATE TABLE tariffs AS SELECT * FROM tariffs_df;")
con.execute("CREATE TABLE calendar_features AS SELECT * FROM calendar_features_df;")

con.execute("""
CREATE TABLE appliance_readings AS
SELECT
  CAST(timestamp AS TIMESTAMP) AS ts,
  home_id,
  appliance_id,
  CAST(power_w AS DOUBLE) AS power_w,
  CAST(energy_kwh AS DOUBLE) AS energy_kwh,
  CAST(voltage_v AS DOUBLE) AS voltage_v,
  CAST(current_a AS DOUBLE) AS current_a,
  status
FROM readings_df;
""")

con.close()

print("DuckDB created at:", DB_PATH)
