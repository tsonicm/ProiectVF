const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function apiFetch(path, options = {}) {
  const headers = {
    ...(options.headers || {}),
  };

  const hasBody = options.body !== undefined && options.body !== null;
  if (hasBody && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && data.detail) ||
      (typeof data === "string" && data) ||
      `API error (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

export function getApprovedTools() {
  return apiFetch("/api/tools/approved");
}

export function suggestTools({ max_tools = 10, date = null } = {}) {
  const payload = { max_tools };
  if (date) payload.date = date;

  return apiFetch("/api/tools/suggest", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function savePendingTools(tools) {
  return apiFetch("/api/tools/pending", {
    method: "POST",
    body: JSON.stringify({ tools }),
  });
}

export function getPendingTools() {
  return apiFetch("/api/tools/pending");
}

export function approveTool(id) {
  return apiFetch(`/api/tools/${id}/approve`, { method: "POST" });
}

export function denyTool(id) {
  return apiFetch(`/api/tools/${id}/deny`, { method: "POST" });
}
