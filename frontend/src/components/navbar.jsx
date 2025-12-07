// src/components/Navbar.jsx

import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("authToken");

  return (
    <nav className="px-4 py-3 border-b bg-white flex justify-between items-center">
      <Link to="/" className="font-semibold text-lg">
        Verification Tools
      </Link>

      <div className="flex gap-4 items-center">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "font-bold" : "text-gray-600"
          }
        >
          Tools
        </NavLink>

        {token && (
          <NavLink
            to="/admin/review"
            className={({ isActive }) =>
              isActive ? "font-bold" : "text-gray-600"
            }
          >
            Admin
          </NavLink>
        )}

        {!token ? (
          <Link to="/admin/login" className="border rounded px-3 py-1">
            Admin Login
          </Link>
        ) : (
          <button
            className="border rounded px-3 py-1"
            onClick={() => {
              localStorage.removeItem("authToken");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
