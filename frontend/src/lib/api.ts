const API_BASE = (import.meta.env.VITE_API_BASE as string) || "https://energywatch-607032555709.us-central1.run.app";
const API_KEY = (import.meta.env.VITE_API_KEY as string) || "52e4074b563e3a83103066b090fcc23b7427feb0861b2051";

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

function authHeaders(): HeadersInit {
  return { "X-API-Key": API_KEY };
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

async function downloadFile(url: string, filename: string) {
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

export const api = {
  health: () => fetch(`${API_BASE}/api/health`).then((r) => json<{ status: string }>(r)),
  summary: () =>
    fetch(`${API_BASE}/api/dashboard/summary`, { headers: authHeaders() }).then((r) => json<DashboardSummary>(r)),
  devices: () => fetch(`${API_BASE}/api/devices`, { headers: authHeaders() }).then((r) => json<Device[]>(r)),
  createDevice: (name: string, propertyType: string) =>
    fetch(`${API_BASE}/api/devices`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ name, property_type: propertyType }),
    }).then((r) => json<Device>(r)),
  readings: (deviceId?: number) =>
    fetch(`${API_BASE}/api/readings${deviceId ? `?device_id=${deviceId}` : ""}`, { headers: authHeaders() }).then(
      (r) => json<Reading[]>(r)
    ),
  alerts: () => fetch(`${API_BASE}/api/alerts`, { headers: authHeaders() }).then((r) => json<Alert[]>(r)),
  exportEvents: () => downloadFile(`${API_BASE}/api/readings/export`, "energywatch_readings.csv"),
  simulate: (deviceId: number, hours: number, injectSpike: boolean) =>
    fetch(`${API_BASE}/api/simulate/${deviceId}?hours=${hours}&inject_spike=${injectSpike}`, {
      method: "POST",
      headers: authHeaders(),
    }).then((r) => json<Reading[]>(r)),
};
