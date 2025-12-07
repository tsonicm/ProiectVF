import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import PublicToolsPage from "./pages/PublicToolsPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminReviewPage from "./pages/AdminReviewPage";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<PublicToolsPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/review" element={<AdminReviewPage />} />
      </Routes>
    </>
  );
}
