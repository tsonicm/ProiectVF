import React, { useState, useMemo } from "react";

const mockTools = [
  {
    id: 1,
    name: "Tool A",
    categories: ["Functional correctness", "Termination"],
    description: "Checks functional correctness for C programs.",
    inputFormat: "C, SMT-LIB",
    license: "MIT",
    sourceLink: "https://github.com/example/tool-a",
    lastUpdated: "2025-01-10",
    approvedBy: "admin1",
  },
  {
    id: 2,
    name: "Tool B",
    categories: ["Neural network verification"],
    description: "Verifies properties of neural networks.",
    inputFormat: "ONNX",
    license: "GPL",
    sourceLink: "https://github.com/example/tool-b",
    lastUpdated: "2025-02-03",
    approvedBy: "admin2",
  },
];

const CATEGORIES = [
  "All",
  "Functional correctness",
  "Termination",
  "Complexity bounds",
  "Neural network verification",
  "QBF evaluation",
];

export function PublicToolsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredTools = useMemo(() => {
    return mockTools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "All" || tool.categories.includes(category);

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <div style={{ padding: "1.5rem" }}>
      {/* Header */}
      <header style={{ marginBottom: "1rem" }}>
        <h1>Verification Tools – Public List</h1>
        <p>
          Lista uneltelor de verificare aprobate și vizibile public. Intrările
          sunt verificate manual de un administrator înainte de publicare.
        </p>
      </header>

      {/* Filtre */}
      <section
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search by tool name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setCategory("All");
          }}
        >
          Clear filters
        </button>
      </section>

      {/* Tabel public */}
      <section>
        <table border="1" cellPadding="6" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>Tool name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Input format</th>
              <th>License</th>
              <th>Source</th>
              <th>Last updated</th>
              <th>Approved by</th>
            </tr>
          </thead>
          <tbody>
            {filteredTools.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No tools found for the current filters.
                </td>
              </tr>
            )}
            {filteredTools.map((tool) => (
              <tr key={tool.id}>
                <td>
                  <a
                    href={tool.sourceLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {tool.name}
                  </a>
                </td>
                <td>{tool.categories.join(", ")}</td>
                <td>{tool.description}</td>
                <td>{tool.inputFormat}</td>
                <td>{tool.license}</td>
                <td>
                  <a
                    href={tool.sourceLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source
                  </a>
                </td>
                <td>{tool.lastUpdated}</td>
                <td>{tool.approvedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Paginare simplificată – dummy */}
      <footer style={{ marginTop: "1rem", textAlign: "right" }}>
        <span>Page 1 of 1</span>
      </footer>
    </div>
  );
}
