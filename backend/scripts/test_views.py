import duckdb
from pathlib import Path

BASE_DIR = Path(".").resolve()
DB_PATH = BASE_DIR / "db" / "debug_copy.duckdb"

sql = """
CREATE OR REPLACE VIEW v_scored_readings AS
SELECT
  r.ts,
  r.home_id,
  r.appliance_id,
  r.energy_kwh,
  t.tariff_type as tou_period,
  r.energy_kwh * t.rate_gbp_per_kwh as cost_gbp
FROM appliance_readings r
JOIN homes h ON r.home_id = h.home_id
JOIN tariffs t ON h.region = t.region
WHERE
  (
    CAST(t.start_time AS TIME) <= CAST(t.end_time AS TIME) AND
    CAST(r.ts AS TIME) >= CAST(t.start_time AS TIME) AND CAST(r.ts AS TIME) < CAST(t.end_time AS TIME)
  )
  OR
  (
    CAST(t.start_time AS TIME) > CAST(t.end_time AS TIME) AND
    (CAST(r.ts AS TIME) >= CAST(t.start_time AS TIME) OR CAST(r.ts AS TIME) < CAST(t.end_time AS TIME))
  );

CREATE OR REPLACE VIEW v_home_daily AS
SELECT
  CAST(ts AS DATE) as date,
  home_id,
  SUM(energy_kwh) as energy_kwh,
  SUM(cost_gbp) as cost_gbp
FROM v_scored_readings
GROUP BY 1, 2;

CREATE OR REPLACE VIEW v_home_appliance_daily AS
SELECT
  CAST(ts AS DATE) as date,
  home_id,
  appliance_id,
  SUM(energy_kwh) as energy_kwh,
  SUM(cost_gbp) as cost_gbp
FROM v_scored_readings
GROUP BY 1, 2, 3;

CREATE OR REPLACE VIEW v_peak_offpeak_daily AS
SELECT
  CAST(ts AS DATE) as date,
  home_id,
  tou_period,
  SUM(energy_kwh) as energy_kwh,
  SUM(cost_gbp) as cost_gbp
FROM v_scored_readings
GROUP BY 1, 2, 3;
"""

try:
    # Open read-write
    con = duckdb.connect(str(DB_PATH), read_only=False)
    con.execute(sql)
    
    print("Views created successfully.")
    
    # Test Query
    print("\n--- Testing v_peak_offpeak_daily ---")
    q = """
    SELECT *
    FROM v_peak_offpeak_daily
    WHERE home_id = 'H1'
    LIMIT 5
    """
    print(con.execute(q).fetchdf())
    
    con.close()
    
except Exception as e:
    print(f"ERROR: {e}")
