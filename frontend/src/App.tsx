import { useEffect, useState } from "react";
import type { HealthStatus } from "@physio/contracts";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/health`)
      .then((response) => response.json() as Promise<HealthStatus>)
      .then(setHealth)
      .catch(() => setHealth({ status: "unavailable", service: "api" }));
  }, []);

  return (
    <main className="shell">
      <section className="hero-card">
        <p className="eyebrow">Physio Center · Egypt</p>
        <h1>مركز فيزيو للعلاج الطبيعي</h1>
        <p className="lead">Foundation workspace for appointments, patient records, and center operations.</p>
        <div className="status" role="status">
          <span className={`status-dot ${health?.status === "ok" ? "online" : ""}`} />
          API status: {health?.status ?? "checking"}
        </div>
      </section>
    </main>
  );
}
