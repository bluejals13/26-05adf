import { useEffect, useRef, useState } from "react";

interface RequestLog {
  method: string;
  uri: string;
  body: string;
}

type Mode = "polling" | "push";

export default function Monitor() {
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState(false);

  const [intervalMs, setIntervalMs] = useState(1000);
  const [running, setRunning] = useState(true);
  const [mode, setMode] = useState<Mode>("polling");

  // const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Monitor.tsx
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/monitor");
      const data: RequestLog[] = await res.json();
      setLogs(data.slice(0, 10));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode !== "polling" || !running) return;

    fetchLogs();

    timerRef.current = setInterval(fetchLogs, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [intervalMs, running, mode]);

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: 12, color: "#333" }}>Monitor</h2>

      {/* TOOLBAR */}
      <div
        style={{
          marginBottom: 16,
          padding: 12,
          background: "#020617",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <button disabled={loading} onClick={fetchLogs}>
          {loading ? "Loading..." : "Refresh"}
        </button>

        <button onClick={() => setRunning((v) => !v)}>
          {running ? "Stop" : "Start"}
        </button>

        <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
          <option value="polling">Polling</option>
          <option value="push">Push</option>
        </select>

        <input
          type="number"
          value={intervalMs}
          min={500}
          step={500}
          onChange={(e) => setIntervalMs(Number(e.target.value))}
          style={{ width: 80 }}
        />

        <span style={{ color: "#666" }}>ms</span>
      </div>

      {/* LOGS */}
      {logs.length === 0 ? (
        <p style={{ color: "#999" }}>No logs</p>
      ) : (
        logs.map((log, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              gap: 4,
              padding: 8,
              marginBottom: 10,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#4555",
            }}
          >
            {/* METHOD (회색 강조만) */}
            <div
              style={{
                minWidth: 70,
                fontWeight: 600,
                color: "#555",
              }}
            >
              {log.method}
            </div>

            {/* CONTENT */}
            <div style={{ flex: 1 }}>
              <div style={{ color: "#333", fontWeight: 500 }}>
                {log.uri}
              </div>

              <pre
                style={{
                  marginTop: 2,
                  background: "#f3f4f6",
                  padding: 2,
                  borderRadius: 2,
                  fontSize: 14,
                  color: "#555",
                  overflowX: "auto",
                }}
              >
                {log.body}
              </pre>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
