"""
Simulated electricity meter + statistical anomaly detection - same
architecture pattern as WaterGuard AI. Real deployments would feed the same
`detect_anomaly()` function from an ESP32/smart-meter/Modbus reading instead
of the simulator, over the ingestion path described in the README.
"""
import random
from typing import List, Optional

import numpy as np

from app.config import settings

# Baseline kWh by hour-of-day (typical household-shaped usage curve with morning/evening peaks)
HOURLY_BASELINE = [
    0.3, 0.3, 0.2, 0.2, 0.3, 0.5,   # 00-05
    0.9, 1.4, 1.0, 0.6, 0.5, 0.5,   # 06-11
    0.6, 0.5, 0.5, 0.5, 0.7, 1.2,   # 12-17
    1.8, 1.6, 1.1, 0.7, 0.5, 0.4,   # 18-23
]


def simulate_readings(hour_start: int, count: int, inject_spike: bool) -> List[dict]:
    readings = []
    spike_hour = random.choice(range(0, 24)) if inject_spike else None

    for i in range(count):
        hour = (hour_start + i) % 24
        base = HOURLY_BASELINE[hour]
        noise = max(0.0, random.gauss(base, base * 0.2 + 0.03))
        usage = round(noise, 2)

        if inject_spike and hour == spike_hour:
            usage = round(base + random.uniform(3.0, 6.0), 2)  # abnormal spike, e.g. faulty appliance

        readings.append({"usage_kwh": usage, "reading_hour": hour})

    return readings


def detect_anomaly(usage: float, hour: int, history: List[float]) -> tuple[bool, Optional[str]]:
    if len(history) >= 5:
        mean = float(np.mean(history))
        std = float(np.std(history)) or 0.01
        z = (usage - mean) / std
        if z >= settings.anomaly_z_threshold:
            return True, f"Usage {usage} kWh is {round(z, 1)} standard deviations above this device's normal pattern"
    return False, None
