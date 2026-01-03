import duckdb
from pathlib import Path
import pandas as pd

pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)

BASE_DIR = Path(".").resolve()
DB_PATH = BASE_DIR / "db" / "debug_copy.duckdb"

try:
    con = duckdb.connect(str(DB_PATH), read_only=True)
    print("\n--- Tariffs Sample ---")
    print(con.execute("SELECT * FROM tariffs LIMIT 5").fetchdf())
    
    print("\n--- Homes Sample ---")
    print(con.execute("SELECT * FROM homes LIMIT 5").fetchdf())
    
    print("\n--- Appliance Readings Sample ---")
    print(con.execute("SELECT * FROM appliance_readings LIMIT 5").fetchdf())
    
except Exception as e:
    print(f"ERROR: {e}")
