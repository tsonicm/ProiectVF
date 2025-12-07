import { useState } from "react";
import { adminLogin } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const { token } = await adminLogin(username, password);
    localStorage.setItem("authToken", token);
    navigate("/admin/review");
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Admin Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="border px-3 py-2 w-full"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="border px-3 py-2 w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="border px-3 py-1 w-full bg-gray-100 hover:bg-gray-200">
          Login
        </button>
      </form>
    </div>
  );
}
