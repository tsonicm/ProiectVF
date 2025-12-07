import { useEffect, useState } from "react";
import { getApprovedTools } from "../lib/api";

export default function PublicToolsPage() {
  const [tools, setTools] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApprovedTools().then((data) => {
      setTools(data);
      setLoading(false);
    });
  }, []);

  const filtered = tools.filter((t) =>
    (t.name + t.category + (t.languages || []).join(","))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Verified Tools</h1>

      <input
        type="text"
        className="border px-3 py-1 mb-4 w-full max-w-sm"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Languages</th>
              <th className="p-2 border">URL</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tool) => (
              <tr key={tool.id}>
                <td className="border p-2">{tool.name}</td>
                <td className="border p-2">{tool.category}</td>
                <td className="border p-2">
                  {(tool.languages || []).join(", ")}
                </td>
                <td className="border p-2">
                  <a href={tool.url} className="text-blue-600 underline">
                    Link
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
