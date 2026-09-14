const API_BASE = "";

export interface Device {
  id: number;
  name: string;
  property_type: string;
  created_at: string;
}

export interface Reading {
  id: number;
  device_id: number;
  usage_kwh: number;
  reading_hour: number;
  is_anomaly: boolean;
  anomaly_reason: string | null;
  timestamp: string;
}

export interface Alert {
  id: number;
  device_id: number;
  message: string;
  timestamp: string;
}

export interface DashboardSummary {
  total_devices: number;
  today_usage_kwh: number;
  week_usage_kwh: number;
  month_usage_kwh: number;
  estimated_month_cost: number;
  peak_usage_kwh: number;
  active_alerts: number;
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

export const api = {
  health: () => fetch(`${API_BASE}/api/health`).then((r) => json<{ status: string }>(r)),
  summary: () => fetch(`${API_BASE}/api/dashboard/summary`).then((r) => json<DashboardSummary>(r)),
  devices: () => fetch(`${API_BASE}/api/devices`).then((r) => json<Device[]>(r)),
  createDevice: (name: string, propertyType: string) =>
    fetch(`${API_BASE}/api/devices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, property_type: propertyType }),
    }).then((r) => json<Device>(r)),
  readings: (deviceId?: number) =>
    fetch(`${API_BASE}/api/readings${deviceId ? `?device_id=${deviceId}` : ""}`).then((r) => json<Reading[]>(r)),
  alerts: () => fetch(`${API_BASE}/api/alerts`).then((r) => json<Alert[]>(r)),
  exportCsvUrl: () => `${API_BASE}/api/readings/export`,
  simulate: (deviceId: number, hours: number, injectSpike: boolean) =>
    fetch(`${API_BASE}/api/simulate/${deviceId}?hours=${hours}&inject_spike=${injectSpike}`, {
      method: "POST",
    }).then((r) => json<Reading[]>(r)),
};
