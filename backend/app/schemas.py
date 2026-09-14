from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class DeviceCreate(BaseModel):
    name: str
    property_type: str = "residential"


class DeviceOut(BaseModel):
    id: int
    name: str
    property_type: str
    created_at: datetime

    class Config:
        from_attributes = True


class ReadingOut(BaseModel):
    id: int
    device_id: int
    usage_kwh: float
    reading_hour: int
    is_anomaly: bool
    anomaly_reason: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True


class AlertOut(BaseModel):
    id: int
    device_id: int
    message: str
    timestamp: datetime

    class Config:
        from_attributes = True


class DashboardSummary(BaseModel):
    total_devices: int
    today_usage_kwh: float
    week_usage_kwh: float
    month_usage_kwh: float
    estimated_month_cost: float
    peak_usage_kwh: float
    active_alerts: int
