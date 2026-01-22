import duckdb
from pathlib import Path

# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "db" / "wattwise_mvp.duckdb"

print(f"Testing views in DB at: {DB_PATH}")

# --------------------------------------------------
# Views SQL
# --------------------------------------------------

sql = """
CREATE OR REPLACE VIEW v_scored_readings AS
SELECT
  r.ts,
  r.home_id,
  r.appliance_id,
  r.energy_kwh,
  t.tariff_type AS tou_period,
  r.energy_kwh * t.rate_gbp_per_kwh AS cost_gbp
FROM appliance_readings r
JOIN homes h ON r.home_id = h.home_id
JOIN tariffs t ON h.region = t.region
WHERE
  (
    CAST(t.start_time AS TIME) <= CAST(t.end_time AS TIME)
    AND CAST(r.ts AS TIME) >= CAST(t.start_time AS TIME)
    AND CAST(r.ts AS TIME) < CAST(t.end_time AS TIME)
  )
  OR
  (
    CAST(t.start_time AS TIME) > CAST(t.end_time AS TIME)
    AND (
      CAST(r.ts AS TIME) >= CAST(t.start_time AS TIME)
      OR CAST(r.ts AS TIME) < CAST(t.end_time AS TIME)
    )
  );
"""

sql += """
CREATE OR REPLACE VIEW v_home_daily AS
SELECT
  CAST(ts AS DATE) AS date,
  home_id,
  SUM(energy_kwh) AS energy_kwh,
  SUM(cost_gbp) AS cost_gbp
FROM v_scored_readings
GROUP BY 1, 2;
"""

sql += """
CREATE OR REPLACE VIEW v_home_appliance_daily AS
SELECT
  CAST(ts AS DATE) AS date,
  home_id,
  appliance_id,
  SUM(energy_kwh) AS energy_kwh,
  SUM(cost_gbp) AS cost_gbp
FROM v_scored_readings
GROUP BY 1, 2, 3;
"""

sql += """
CREATE OR REPLACE VIEW v_peak_offpeak_daily AS
SELECT
  CAST(ts AS DATE) AS date,
  home_id,
  tou_period,
  SUM(energy_kwh) AS energy_kwh,
  SUM(cost_gbp) AS cost_gbp
FROM v_scored_readings
GROUP BY 1, 2, 3;
"""

# --------------------------------------------------
# Execute & Test
# --------------------------------------------------

try:
    con = duckdb.connect(str(DB_PATH), read_only=False)

    con.execute(sql)
    print("Views created successfully.")

    print("\n--- Testing v_peak_offpeak_daily (H1 sample) ---")
    q = """
    SELECT *
    FROM v_peak_offpeak_daily
    WHERE home_id = 'H1'
    LIMIT 5
    """
    print(con.execute(q).fetchdf())

    con.close()
    print("\nView tests completed successfully.")

except Exception as e:
    print(f"\nERROR: {e}")
