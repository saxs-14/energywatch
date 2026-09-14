import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "EnergyWatch"
    database_url: str = "sqlite:///./energywatch.db"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    anomaly_z_threshold: float = 2.5
    cost_per_kwh: float = 2.50  # currency units per kWh, configurable per market
    api_key: str = "dev-local-key-change-me"

    class Config:
        env_file = ".env"


settings = Settings()
