from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean
from datetime import datetime, timezone
from app.database import Base


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    property_type = Column(String, default="residential")  # residential | shop | restaurant | school | office | factory
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Reading(Base):
    __tablename__ = "readings"

    id = Column(Integer, primary_key=True)
    device_id = Column(Integer, index=True)
    usage_kwh = Column(Float)
    reading_hour = Column(Integer)
    is_anomaly = Column(Boolean, default=False)
    anomaly_reason = Column(String, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True)
    device_id = Column(Integer, index=True)
    message = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
