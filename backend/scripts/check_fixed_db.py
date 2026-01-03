import duckdb
from pathlib import Path
import traceback

BASE_DIR = Path(".").resolve()
DB_PATH = BASE_DIR / "db" / "wattwise_fixed.duckdb"

print(f"Checking DB at: {DB_PATH}")

try:
    con = duckdb.connect(str(DB_PATH), read_only=True)
    print("\nTables:")
    print(con.execute("SHOW TABLES").fetchdf())
    
    print("\nTesting Query:")
    q = """
    SELECT date, tou_period, energy_kwh, cost_gbp
    FROM v_peak_offpeak_daily
    WHERE home_id = 'H1'
      AND date BETWEEN '2025-11-29' AND '2025-12-29'
    ORDER BY date, tou_period
    limit 5
    """
    print(con.execute(q).fetchdf())
    
except Exception as e:
    print(f"\nERROR: {e}")
    traceback.print_exc()
