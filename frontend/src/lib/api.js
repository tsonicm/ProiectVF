const API_BASE_URL = "http://localhost:8000";

async function apiFetch(path, options = {}, withAuth = false) {
  const token = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (withAuth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "API error");
  }

  return res.json();
}

export function getApprovedTools() {
  return apiFetch("/api/tools/approved");
}

export function adminLogin(username, password) {
  return apiFetch("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });
}

export function getPendingTools() {
  return apiFetch("/api/admin/tools/pending", {}, true);
}

export function approveTool(id) {
  return apiFetch(`/api/admin/tools/${id}/approve`, { method: "POST" }, true);
}

export function denyTool(id) {
  return apiFetch(`/api/admin/tools/${id}/deny`, { method: "POST" }, true);
}

export function queryLlm(prompt) {
  return apiFetch(
    "/api/admin/query-llm",
    { method: "POST", body: JSON.stringify({ prompt }) },
    true
  );
}
