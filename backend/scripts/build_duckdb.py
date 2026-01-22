import pandas as pd
import duckdb
from pathlib import Path

# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[1]

DATA_DIR = BASE_DIR / "data" / "wattwise_mvp_data"
DB_DIR = BASE_DIR / "db"
DB_DIR.mkdir(exist_ok=True)

DB_PATH = DB_DIR / "wattwise_fixed.duckdb"

# --------------------------------------------------
# Load CSVs
# --------------------------------------------------

users = pd.read_csv(DATA_DIR / "users.csv")
homes = pd.read_csv(DATA_DIR / "homes.csv")
appliances = pd.read_csv(DATA_DIR / "appliances.csv")
home_appliances = pd.read_csv(DATA_DIR / "home_appliances.csv")
tariffs = pd.read_csv(DATA_DIR / "tariffs.csv")
calendar_features = pd.read_csv(DATA_DIR / "calendar_features.csv")
readings = pd.read_csv(DATA_DIR / "appliance_readings.csv")

# --------------------------------------------------
# Reset DB
# --------------------------------------------------

if DB_PATH.exists():
    DB_PATH.unlink()

con = duckdb.connect(str(DB_PATH))

# --------------------------------------------------
# Register DataFrames
# --------------------------------------------------

con.register("users_df", users)
con.register("homes_df", homes)
con.register("appliances_df", appliances)
con.register("home_appliances_df", home_appliances)
con.register("tariffs_df", tariffs)
con.register("calendar_features_df", calendar_features)
con.register("readings_df", readings)

# --------------------------------------------------
# Create Tables
# --------------------------------------------------

con.execute("""
CREATE TABLE users AS
SELECT * FROM users_df;
""")

con.execute("""
CREATE TABLE homes AS
WITH numbered_homes AS (
    SELECT *, (row_number() OVER() % 5) + 1 as rn FROM homes_df
),
numbered_users AS (
    SELECT user_id, row_number() OVER() as rn FROM users_df
)
SELECT 
    h.* EXCLUDE (rn),
    u.user_id 
FROM numbered_homes h
LEFT JOIN numbered_users u ON h.rn = u.rn;
""")

# Re-mapping homes to users since homes.csv doesn't have user_id
# Let's just assign user1 to all for now or distribute them.
# The previous script had user_id in homes.
# If homes.csv doesn't have user_id, we need to add it or the JOINs will fail.
# Let's fix homes.csv too.

con.execute("""
CREATE TABLE appliances AS
SELECT * FROM appliances_df;
""")

con.execute("""
CREATE TABLE home_appliances AS
SELECT * FROM home_appliances_df;
""")

con.execute("""
CREATE TABLE tariffs AS
SELECT * FROM tariffs_df;
""")

con.execute("""
CREATE TABLE calendar_features AS
SELECT * FROM calendar_features_df;
""")

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

print("DuckDB created successfully at:", DB_PATH)
