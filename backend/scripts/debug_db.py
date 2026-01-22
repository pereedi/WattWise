import duckdb
from pathlib import Path
import pandas as pd

pd.set_option("display.max_columns", None)
pd.set_option("display.width", 1000)

# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "db" / "wattwise_mvp.duckdb"

print(f"Debugging DB at: {DB_PATH}")

# --------------------------------------------------
# Debug Queries
# --------------------------------------------------

try:
    con = duckdb.connect(str(DB_PATH), read_only=True)

    print("\n--- Users Sample ---")
    print(con.execute("SELECT * FROM users LIMIT 5").fetchdf())

    print("\n--- Homes Sample ---")
    print(con.execute("SELECT * FROM homes LIMIT 5").fetchdf())

    print("\n--- Appliances Sample ---")
    print(con.execute("SELECT * FROM appliances LIMIT 5").fetchdf())

    print("\n--- Tariffs Sample ---")
    print(con.execute("SELECT * FROM tariffs LIMIT 5").fetchdf())

    print("\n--- Appliance Readings Sample ---")
    print(con.execute("SELECT * FROM appliance_readings LIMIT 5").fetchdf())

    print("\n--- User → Home Mapping ---")
    print(
        con.execute(
            """
            SELECT
              u.user_id,
              u.full_name,
              h.home_id,
              h.location
            FROM users u
            JOIN homes h
            ON u.user_id = h.user_id
            LIMIT 5
            """
        ).fetchdf()
    )

    con.close()
    print("\nDB debug completed successfully.")

except Exception as e:
    print(f"\nERROR: {e}")
