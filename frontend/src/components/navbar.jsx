import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const onAdmin = pathname.startsWith("/admin/review");

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto px-6 py-4 flex items-center justify-end">
        {onAdmin ? (
          <Link
            to="/"
            className="border rounded-md px-3 py-1 bg-white hover:bg-gray-100"
          >
            See approved tools
          </Link>
        ) : (
          <Link
            to="/admin/review"
            className="border rounded-md px-3 py-1 bg-white hover:bg-gray-100"
          >
            Find new tools
          </Link>
        )}
      </div>
    </nav>
  );
}
