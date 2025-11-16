import React, { useState } from "react";

const CATEGORIES = [
  "All categories",
  "Functional correctness",
  "Termination",
  "Complexity bounds",
  "Neural network verification",
  "QBF evaluation",
];

export function AdminLlmFetchPage() {
  const [status, setStatus] = useState("Idle");
  const [lastRun, setLastRun] = useState(null);
  const [triggeredBy, setTriggeredBy] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [category, setCategory] = useState("All categories");
  const [dryRun, setDryRun] = useState(false);

  const [history, setHistory] = useState([]);
  const [lastResults, setLastResults] = useState([]);

  const handleFetch = () => {
    {/* Într-o implementare reală ai apela backend-ul aici */}
    setIsFetching(true);
    setStatus("Fetching suggestions from LLM...");

    setTimeout(() => {
      const now = new Date();
      const runId = Date.now().toString();

      {/* Mock results */}
      const results = [
        {
          toolName: "Generated Tool 1",
          operation: "New suggestion",
          category: "Functional correctness",
          status: "Saved as pending",
          details: dryRun
            ? "Dry run: not persisted."
            : "Inserted into pending tools.",
        },
        {
          toolName: "Generated Tool 2",
          operation: "Update existing",
          category: "Neural network verification",
          status: "Saved as pending",
          details: "Marked as potential update of Tool B.",
        },
      ];

      setLastResults(results);
      setLastRun(now.toISOString());
      setTriggeredBy("admin@example.com");

      setHistory((prev) => [
        {
          runId,
          dateTime: now.toISOString(),
          triggeredBy: "admin@example.com",
          newCount: 1,
          updatedCount: 1,
          errorsCount: 0,
        },
        ...prev,
      ]);

      setStatus(
        `${results.length} tools processed: ${
          dryRun ? "DRY RUN (no changes saved)" : "saved as pending"
        }.`
      );
      setIsFetching(false);
    }, 1000);
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <header style={{ marginBottom: "1rem" }}>
        <h1>Admin – LLM Fetch & Logs</h1>
        <p>
          Interfață pentru declanșarea manuală a procesului „Fetch new data from
          LLM” și vizualizarea rezultatelor și a istoricului.
        </p>
      </header>

      {/* Panou de control */}
      <section
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <h2>Fetch new data from LLM</h2>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "0.75rem",
          }}
        >
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label>
            <input
              type="checkbox"
              checked={dryRun}
              onChange={(e) => setDryRun(e.target.checked)}
            />{" "}
            Dry run (do not save)
          </label>
        </div>

        <button type="button" onClick={handleFetch} disabled={isFetching}>
          {isFetching ? "Fetching..." : "Fetch new data from LLM"}
        </button>

        <div style={{ marginTop: "0.75rem" }}>
          <p>
            <strong>Status:</strong> {status}
          </p>
          <p>
            <strong>Last run:</strong>{" "}
            {lastRun ? lastRun : "No runs yet."}
          </p>
          <p>
            <strong>Triggered by:</strong>{" "}
            {triggeredBy ? triggeredBy : "-"}
          </p>
        </div>
      </section>

      {/* Rezultatele ultimei rulări */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Recent fetch results</h2>

        {lastResults.length === 0 ? (
          <p>No LLM fetch has been executed yet.</p>
        ) : (
          <table border="1" cellPadding="6" cellSpacing="0" width="100%">
            <thead>
              <tr>
                <th>Tool name</th>
                <th>Operation</th>
                <th>Category</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {lastResults.map((result, idx) => (
                <tr key={idx}>
                  <td>{result.toolName}</td>
                  <td>{result.operation}</td>
                  <td>{result.category}</td>
                  <td>{result.status}</td>
                  <td>{result.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p style={{ marginTop: "0.5rem" }}>
          All new suggestions are saved in the{" "}
          <strong>"Pending tools"</strong> section for manual review.
        </p>
      </section>

      {/* Istoric rulări */}
      <section>
        <h2>Fetch history</h2>

        {history.length === 0 ? (
          <p>No history yet.</p>
        ) : (
          <table border="1" cellPadding="6" cellSpacing="0" width="100%">
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Date & Time</th>
                <th>Triggered by</th>
                <th>#New</th>
                <th>#Updated</th>
                <th>#Errors</th>
              </tr>
            </thead>
            <tbody>
              {history.map((run) => (
                <tr key={run.runId}>
                  <td>{run.runId}</td>
                  <td>{run.dateTime}</td>
                  <td>{run.triggeredBy}</td>
                  <td>{run.newCount}</td>
                  <td>{run.updatedCount}</td>
                  <td>{run.errorsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
