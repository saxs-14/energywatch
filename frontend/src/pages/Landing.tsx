import { Link } from "react-router-dom";

const FEATURES = [
  { title: "Real-time usage dashboard", desc: "Daily, weekly and monthly electricity usage." },
  { title: "Anomaly detection", desc: "Statistical detection of abnormal consumption spikes." },
  { title: "Cost estimation", desc: "Converts usage into an estimated bill using your rate." },
  { title: "Peak usage tracking", desc: "See when and how much your peak draw is." },
  { title: "Simulated IoT mode", desc: "Demonstrate the full pipeline without physical hardware." },
  { title: "Hardware-ready architecture", desc: "Same API accepts real smart-meter/ESP32 readings later." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-500" />
          EnergyWatch
        </div>
        <Link to="/app" className="rounded-lg bg-yellow-600 hover:bg-yellow-500 transition px-4 py-2 text-sm font-medium">
          Open dashboard
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        <section className="py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Spot abnormal <span className="text-yellow-400">electricity usage</span> early
          </h1>
          <p className="mt-5 text-slate-400 max-w-2xl mx-auto text-lg">
            Simulated meter mode today, real smart-meter/ESP32 hardware tomorrow — same
            API, same dashboard, same anomaly-detection pipeline.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/app" className="rounded-lg bg-yellow-600 hover:bg-yellow-500 transition px-5 py-3 font-medium">
              Try the live demo
            </Link>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </section>

        <section className="py-16 grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-3">Who it's for</h2>
            <ul className="text-slate-400 space-y-1.5 text-sm">
              <li>Households</li>
              <li>Shops & restaurants</li>
              <li>Schools & offices</li>
              <li>Factories</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3">Pricing model</h2>
            <ul className="text-slate-400 space-y-1.5 text-sm">
              <li>Monthly subscription</li>
              <li>Energy-monitoring hardware bundle</li>
              <li>Business analytics package</li>
              <li>Energy consultancy partnerships</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        EnergyWatch — energy monitoring MVP. Simulated data by default, hardware-ready.
      </footer>
    </div>
  );
}
