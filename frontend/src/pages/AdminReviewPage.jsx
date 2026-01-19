import { useEffect, useMemo, useState } from "react";
import {
  getPendingTools,
  approveTool,
  denyTool,
  suggestTools,
  savePendingTools,
} from "../lib/api";

export default function AdminReviewPage() {

  const [pending, setPending] = useState([]);
  const [search, setSearch] = useState("");

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function refreshPending() {
    const data = await getPendingTools();
    setPending(data);
  }

  useEffect(() => {
    refreshPending().catch((e) => setErr(String(e.message || e)));
  }, []);

  async function handleApprove(id) {
    setErr("");
    try {
      await approveTool(id);
      setPending((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  async function handleDeny(id) {
    setErr("");
    try {
      await denyTool(id);
      setPending((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  async function handleQueryLLM() {
    setErr("");
    setBusy(true);

    try {
      const res = await suggestTools({ max_tools: 10 });
      const cleaned = (res?.tools || [])
        .map((t) => ({
          ...t,
          tool_name: (t.tool_name || "").trim(),
          official_website_or_repository: (t.official_website_or_repository || "").trim(),
        }))
        .filter((t) => t.tool_name && t.official_website_or_repository);

      if (!cleaned.length) {
        throw new Error("No valid suggested tools (missing name/url).");
      }

      await savePendingTools(cleaned); 
      await refreshPending();
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setBusy(false);
    }
  }

  const filteredPending = useMemo(() => {
    const q = search.toLowerCase();
    return pending.filter((t) =>
      (
        (t.name || "") +
        (t.category || "") +
        (t.description || "") +
        (t.main_features || "") +
        (t.url || "") +
        ((t.languages || []).join(","))
      )
        .toLowerCase()
        .includes(q)
    );
  }, [pending, search]);

  return (
    <div className="p-6 space-y-6">
      {err ? <p className="text-red-600">{err}</p> : null}

      <div className="border p-4 space-y-3">

        <div className="flex gap-3 items-center flex-wrap">
          <button
            className="px-3 py-1 border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            onClick={handleQueryLLM}
            disabled={busy}
          >
            Query LLM
          </button>
        </div>
      </div>

      {!filteredPending.length ? (
        <p></p>
      ) : (
        <table className="w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">URL</th>
              <th className="p-2 border">Details</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPending.map((tool) => (
              <tr key={tool.id}>
                <td className="p-2 border">{tool.name}</td>
                <td className="p-2 border">{tool.category}</td>
                <td className="p-2 border">
                  {tool.url ? (
                    <a
                      className="text-blue-600 underline"
                      href={tool.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Link
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2 border">
                  <details>
                    <summary className="cursor-pointer select-none">View</summary>
                    <div className="mt-2 text-sm space-y-2">
                      <div><b>Description:</b> {tool.description || "-"}</div>
                      <div><b>Main features:</b> {tool.main_features || "-"}</div>
                      <div><b>Languages:</b> {(tool.languages || []).join(", ") || "-"}</div>
                      <div><b>License:</b> {tool.license || "-"}</div>
                      <div><b>Last update:</b> {tool.last_known_update_or_version || "-"}</div>
                      <div><b>Score:</b> {tool.relevance_score ?? "-"}</div>
                    </div>
                  </details>
                </td>
                <td className="p-2 border">
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 border"
                      onClick={() => handleApprove(tool.id)}
                      disabled={busy}
                    >
                      Approve
                    </button>
                    <button
                      className="px-3 py-1 border"
                      onClick={() => handleDeny(tool.id)}
                      disabled={busy}
                    >
                      Deny
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
