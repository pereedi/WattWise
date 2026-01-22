import duckdb
from pathlib import Path
import traceback

# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "db" / "wattwise_mvp.duckdb"

print(f"Checking DB at: {DB_PATH}")

# --------------------------------------------------
# Checks
# --------------------------------------------------

try:
    con = duckdb.connect(str(DB_PATH), read_only=True)

    print("\nTables:")
    print(con.execute("SHOW TABLES").fetchdf())

    print("\nSample users:")
    print(
        con.execute(
            "SELECT user_id, full_name FROM users LIMIT 5"
        ).fetchdf()
    )

    print("\nSample homes:")
    print(
        con.execute(
            "SELECT home_id, user_id FROM homes LIMIT 5"
        ).fetchdf()
    )

    print("\nTesting view: v_peak_offpeak_daily (H1 sample):")
    q = """
    SELECT date, tou_period, energy_kwh, cost_gbp
    FROM v_peak_offpeak_daily
    WHERE home_id = 'H1'
      AND date BETWEEN '2025-11-29' AND '2025-12-29'
    ORDER BY date, tou_period
    LIMIT 5
    """
    print(con.execute(q).fetchdf())

    con.close()

    print("\nDB check completed successfully.")

except Exception as e:
    print(f"\nERROR: {e}")
    traceback.print_exc()
