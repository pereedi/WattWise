WattWise MVP Data (5 homes × 6 appliances × 60 days @ 5-minute intervals)

Files
- homes.csv: home metadata (static)
- appliances.csv: appliance catalog (static)
- home_appliances.csv: mapping of appliances installed per home (static)
- tariffs.csv: time-of-use tariff assumptions (static)
- calendar_features.csv: date-level flags (derived)
- appliance_readings.csv: simulated smart-plug stream (main fact table)

appliance_readings.csv columns
- timestamp (ISO-8601): reading time (5-min cadence)
- home_id: H1..H5
- appliance_id: A_FRIDGE, A_WASHER, A_TV, A_KETTLE, A_LIGHTS, A_HEATER
- power_w: instantaneous power draw (W)
- energy_kwh: incremental energy for the 5-min interval (kWh)
- voltage_v: simulated mains voltage around 230V
- current_a: power_w / voltage_v
- status: off | standby | on

Time range
- 2025-10-23 00:00:00 to 2025-12-21 23:55:00 (inclusive)
