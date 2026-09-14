# EnergyWatch

Intelligent electricity monitoring and anomaly-detection MVP, IoT-hardware-ready but
demoable with zero physical meters.

## Problem statement

Businesses and households often can't easily tell when their electricity usage becomes
abnormal until the bill arrives — by then it's too late to catch a faulty appliance or
unexpected drain early.

## Solution

Register a property/device, generate (or later, ingest real) usage readings, and
EnergyWatch flags abnormal consumption statistically, estimates cost, and tracks peak
usage on a live dashboard.

## Features

- Real-time usage dashboard (daily/weekly/monthly)
- Simulated electricity meter (no hardware required to demo)
- IoT-ready ingestion architecture — same data model a real smart meter would use
- Statistical anomaly detection (z-score vs. device history)
- Estimated cost from a configurable rate
- Peak usage tracking, alerts, CSV export

## Architecture

```text
frontend (React/Vite/TS/Tailwind)  ->  backend (FastAPI)  ->  SQLite
                                              |
                                     simulated meter OR real ESP32/smart-meter/Modbus
                                     -> same ingestion path -> z-score anomaly detection
```

Connecting real hardware later (ESP32, smart meters, Modbus, or a utility API) means
adding an ingestion endpoint that posts into the same `usage_kwh`/`reading_hour` schema
and calls the same `detect_anomaly()` function the simulator already uses.

## Technology stack

Python, FastAPI, SQLAlchemy, SQLite, NumPy; React, TypeScript, Vite, Tailwind CSS,
Recharts.

## Folder structure

```text
energywatch/
├── backend/
│   ├── app/          # FastAPI app, simulator + anomaly detection
│   └── tests/
├── frontend/
│   └── src/             # Landing page + dashboard
├── docker-compose.yml
└── README.md
```

## Installation

```bash
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

```bash
cd frontend && npm install
```

## Environment variables

`ANOMALY_Z_THRESHOLD`, `COST_PER_KWH` (used for the cost estimate), `CORS_ORIGINS` — see
`backend/.env.example`.

## Running locally

```bash
# Terminal 1
cd backend && venv\Scripts\activate && uvicorn app.main:app --reload
# Terminal 2
cd frontend && npm run dev
```

Open http://localhost:5173. Docker: `docker compose up --build`.

## Demo instructions

1. Add a device (e.g. "Main panel").
2. Click **Simulate normal day** for a realistic usage curve.
3. Click **Simulate with spike** to inject an abnormal consumption spike — watch it flag
   as an alert.

## API documentation

Docs at `/docs`. Key endpoints: `POST /api/devices`, `GET /api/devices`,
`POST /api/simulate/{device_id}`, `GET /api/readings`, `GET /api/readings/export`,
`GET /api/alerts`, `GET /api/dashboard/summary`.

## Database

SQLite: `devices`, `readings`, `alerts`.

## Security considerations

- **API key required on every endpoint except `/api/health`.** Set `API_KEY` (backend
  `.env`) and `VITE_API_KEY` (frontend `.env`) to the same value before deploying anywhere
  reachable outside your own machine — the default (`dev-local-key-change-me`) is for
  local development only. Single-tenant "licensed instance" model, not per-user accounts.
- Rate limiting (30 req/60s/IP) on the readings/simulate endpoints.
- CORS restricted, no secrets in source.

## Privacy considerations

Usage data is property-level, not individual-level. No personal data collected by
default.

## Limitations

- **Simulated data by default** — real hardware integration (ESP32/smart meter/Modbus/
  utility API) is architecturally supported but not implemented in this MVP.
- Anomaly detection is a single z-score threshold — a production deployment should
  calibrate per property type and consider seasonal/weather effects (e.g. AC usage).
- Cost estimate uses a single flat `COST_PER_KWH` — real tariffs (time-of-use, tiered
  pricing) would need a more detailed billing model.

## Business model

**Target customers**: households, shops, restaurants, schools, offices, factories.

**Revenue**: monthly subscription, energy-monitoring hardware bundle, business analytics
package, energy consultancy partnerships.

## Future improvements

- Real smart-meter/ESP32/Modbus ingestion endpoint
- Time-of-use and tiered tariff support for accurate cost estimates
- Per-property-type baseline calibration
- Device-level breakdown (sub-metering) for appliance-level insight

## Screenshots

Run locally (see "Running locally"), add a device, and click **Simulate with spike** on
`/app`.
