from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200


def test_dashboard_summary_shape():
    r = client.get("/api/dashboard/summary")
    assert r.status_code == 200
    for key in ["total_devices", "today_usage_kwh", "week_usage_kwh", "month_usage_kwh", "estimated_month_cost", "peak_usage_kwh", "active_alerts"]:
        assert key in r.json()


def test_create_device_and_simulate_readings():
    r = client.post("/api/devices", json={"name": "Main panel", "property_type": "residential"})
    assert r.status_code == 200
    device_id = r.json()["id"]

    r2 = client.post(f"/api/simulate/{device_id}", params={"hours": 12, "inject_spike": True})
    assert r2.status_code == 200
    assert len(r2.json()) == 12

    r3 = client.get("/api/alerts")
    assert r3.status_code == 200


def test_simulate_unknown_device_returns_404():
    r = client.post("/api/simulate/999999", params={"hours": 5})
    assert r.status_code == 404
