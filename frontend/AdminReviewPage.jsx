import React, { useState } from "react";

const mockPendingTools = [
  {
    id: 101,
    name: "New Tool X",
    category: "QBF evaluation",
    shortDescription: "LLM-suggested tool for QBF evaluation.",
    proposedSource: "https://example.com/new-tool-x",
    status: "New", // New / Edited by admin
  },
  {
    id: 102,
    name: "New Tool Y",
    category: "Functional correctness",
    shortDescription: "Static analysis for C programs.",
    proposedSource: "https://example.com/new-tool-y",
    status: "New",
  },
];

const mockApprovedTools = [
  {
    id: 1,
    name: "Tool A",
    category: "Functional correctness",
    description: "Checks functional correctness for C programs.",
    source: "https://github.com/example/tool-a",
    syncStatus: "In sync", // In sync / Pending update / Error
  },
];

export function AdminReviewPage() {
  const [pendingTools, setPendingTools] = useState(mockPendingTools);
  const [approvedTools, setApprovedTools] = useState(mockApprovedTools);

  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingCategory, setPendingCategory] = useState("All");

  const [approvedSearch, setApprovedSearch] = useState("");
  const [approvedCategory, setApprovedCategory] = useState("All");

  const [selectedTool, setSelectedTool] = useState(null);

  const CATEGORIES = [
    "All",
    "Functional correctness",
    "Termination",
    "Complexity bounds",
    "Neural network verification",
    "QBF evaluation",
  ];

  const filteredPending = pendingTools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(pendingSearch.toLowerCase()) ||
      tool.shortDescription
        .toLowerCase()
        .includes(pendingSearch.toLowerCase());
    const matchesCategory =
      pendingCategory === "All" || tool.category === pendingCategory;

    return matchesSearch && matchesCategory;
  });

  const filteredApproved = approvedTools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(approvedSearch.toLowerCase()) ||
      tool.description.toLowerCase().includes(approvedSearch.toLowerCase());
    const matchesCategory =
      approvedCategory === "All" || tool.category === approvedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAccept = (toolId) => {
    const tool = pendingTools.find((t) => t.id === toolId);
    if (!tool) return;

    {/* Transformăm tool-ul pending într-un tool aprobat simplificat */}
    const newApproved = {
      id: Date.now(),
      name: tool.name,
      category: tool.category,
      description: tool.shortDescription,
      source: tool.proposedSource,
      syncStatus: "Pending update",
    };

    setApprovedTools((prev) => [...prev, newApproved]);
    setPendingTools((prev) => prev.filter((t) => t.id !== toolId));
  };

  const handleReject = (toolId) => {
    {/* Într-o implementare reală am putea cere și motivul de respingere */}
    setPendingTools((prev) => prev.filter((t) => t.id !== toolId));
  };

  const handleMarkSync = (toolId, newStatus) => {
    setApprovedTools((prev) =>
      prev.map((tool) =>
        tool.id === toolId ? { ...tool, syncStatus: newStatus } : tool
      )
    );
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <header style={{ marginBottom: "1rem" }}>
        <h1>Admin Dashboard – Tool Review</h1>
        <p>
          Pagină de administrare pentru vizualizarea, aprobarea și respingerea
          intrărilor noi propuse de LLM, precum și gestionarea uneltelor deja
          aprobate.
        </p>
      </header>

      {/* Secțiunea Pending tools */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Pending tools</h2>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Search in pending tools..."
            value={pendingSearch}
            onChange={(e) => setPendingSearch(e.target.value)}
          />
          <select
            value={pendingCategory}
            onChange={(e) => setPendingCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              setPendingSearch("");
              setPendingCategory("All");
            }}
          >
            Reset filters
          </button>
        </div>

        <table border="1" cellPadding="6" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>Tool name (proposed)</th>
              <th>Category</th>
              <th>Short description</th>
              <th>Proposed source</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPending.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No pending tools.
                </td>
              </tr>
            )}

            {filteredPending.map((tool) => (
              <tr key={tool.id}>
                <td>{tool.name}</td>
                <td>{tool.category}</td>
                <td>{tool.shortDescription}</td>
                <td>
                  <a
                    href={tool.proposedSource}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {tool.proposedSource}
                  </a>
                </td>
                <td>{tool.status}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => setSelectedTool(tool)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    View details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAccept(tool.id)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Accept
                  </button>
                  <button type="button" onClick={() => handleReject(tool.id)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Panou detalii tool selectat */}
        {selectedTool && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <h3>Tool details – {selectedTool.name}</h3>
            <p>
              <strong>Category:</strong> {selectedTool.category}
            </p>
            <p>
              <strong>Description:</strong> {selectedTool.shortDescription}
            </p>
            <p>
              <strong>Proposed source:</strong>{" "}
              <a
                href={selectedTool.proposedSource}
                target="_blank"
                rel="noreferrer"
              >
                {selectedTool.proposedSource}
              </a>
            </p>
            <button type="button" onClick={() => setSelectedTool(null)}>
              Close
            </button>
          </div>
        )}
      </section>

      {/* Secțiunea Approved tools */}
      <section>
        <h2>Approved tools</h2>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Search in approved tools..."
            value={approvedSearch}
            onChange={(e) => setApprovedSearch(e.target.value)}
          />
          <select
            value={approvedCategory}
            onChange={(e) => setApprovedCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              setApprovedSearch("");
              setApprovedCategory("All");
            }}
          >
            Reset filters
          </button>
        </div>

        <table border="1" cellPadding="6" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>Tool name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Source</th>
              <th>Sync status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApproved.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No approved tools.
                </td>
              </tr>
            )}

            {filteredApproved.map((tool) => (
              <tr key={tool.id}>
                <td>{tool.name}</td>
                <td>{tool.category}</td>
                <td>{tool.description}</td>
                <td>
                  <a href={tool.source} target="_blank" rel="noreferrer">
                    {tool.source}
                  </a>
                </td>
                <td>{tool.syncStatus}</td>
                <td>
                  <select
                    value={tool.syncStatus}
                    onChange={(e) =>
                      handleMarkSync(tool.id, e.target.value)
                    }
                  >
                    <option value="In sync">In sync</option>
                    <option value="Pending update">Pending update</option>
                    <option value="Error">Error</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
