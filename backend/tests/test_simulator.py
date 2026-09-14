from app.simulator import simulate_readings, detect_anomaly


def test_simulate_readings_returns_requested_count():
    readings = simulate_readings(hour_start=0, count=24, inject_spike=False)
    assert len(readings) == 24
    for r in readings:
        assert r["usage_kwh"] >= 0
        assert 0 <= r["reading_hour"] <= 23


def test_simulate_readings_with_spike_has_a_high_value():
    readings = simulate_readings(hour_start=0, count=24, inject_spike=True)
    assert any(r["usage_kwh"] >= 3.0 for r in readings)


def test_detect_anomaly_flags_statistical_outlier():
    history = [1.0, 1.1, 0.9, 1.0, 1.2, 0.95]
    is_anomaly, reason = detect_anomaly(usage=10.0, hour=14, history=history)
    assert is_anomaly is True
    assert reason is not None


def test_detect_anomaly_normal_reading_not_flagged():
    history = [1.0, 1.1, 0.9, 1.0, 1.2, 0.95]
    is_anomaly, reason = detect_anomaly(usage=1.05, hour=14, history=history)
    assert is_anomaly is False


def test_detect_anomaly_insufficient_history_not_flagged():
    is_anomaly, reason = detect_anomaly(usage=5.0, hour=14, history=[1.0])
    assert is_anomaly is False
