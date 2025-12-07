import { useEffect, useState } from "react";
import { getPendingTools, approveTool, denyTool } from "../lib/api";

export default function AdminReviewPage() {
  const [tools, setTools] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) return;
    getPendingTools().then(setTools);
  }, [token]);

  async function handleApprove(id) {
    await approveTool(id);
    setTools(tools.filter((t) => t.id !== id));
  }

  async function handleDeny(id) {
    await denyTool(id);
    setTools(tools.filter((t) => t.id !== id));
  }

  if (!token) return <p>Please log in as admin.</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Pending Tools</h1>

      {!tools.length ? (
        <p>No pending tools.</p>
      ) : (
        <table className="w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool.id}>
                <td className="p-2 border">{tool.name}</td>
                <td className="p-2 border">{tool.category}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="px-3 py-1 border"
                    onClick={() => handleApprove(tool.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="px-3 py-1 border"
                    onClick={() => handleDeny(tool.id)}
                  >
                    Deny
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
