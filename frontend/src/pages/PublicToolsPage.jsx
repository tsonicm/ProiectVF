import { useEffect, useState } from "react";
import { getApprovedTools } from "../lib/api";

export default function PublicToolsPage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    setErr("");
    getApprovedTools()
      .then((data) => setTools(Array.isArray(data) ? data : []))
      .catch((e) => setErr(String(e.message || e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Verified Tools</h1>
          <p className="text-sm text-gray-600">
            Only human approved tools are visible here.
          </p>
        </div>

        <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
          {err ? (
            <div className="p-4 text-red-600">{err}</div>
          ) : loading ? (
            <div className="p-4">Loading...</div>
          ) : !tools.length ? (
            <div className="p-4 text-gray-600">No approved tools yet.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Description</th>
                  <th className="p-3 border">Main features</th>
                  <th className="p-3 border">Languages/Models</th>
                  <th className="p-3 border">License</th>
                  <th className="p-3 border">Last update/version</th>
                  <th className="p-3 border">Score</th>
                  <th className="p-3 border">URL</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-gray-50 align-top">
                    <td className="border p-3 font-medium">{tool.name}</td>
                    <td className="border p-3">{tool.category}</td>
                    <td className="border p-3">{tool.description || "-"}</td>
                    <td className="border p-3">{tool.main_features || "-"}</td>
                    <td className="border p-3">
                      {(tool.languages || []).join(", ") || "-"}
                    </td>
                    <td className="border p-3">{tool.license || "-"}</td>
                    <td className="border p-3">
                      {tool.last_known_update_or_version || "-"}
                    </td>
                    <td className="border p-3">{tool.relevance_score ?? "-"}</td>
                    <td className="border p-3">
                      {tool.url ? (
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          Link
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
