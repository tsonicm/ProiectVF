import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import PublicToolsPage from "@/pages/PublicToolsPage"
import AdminLoginPage from "@/pages/AdminLoginPage"
import AdminReviewPage from "@/pages/AdminReviewPage"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicToolsPage />} />
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminReviewPage />} />
      </Routes>
    </Router>
  )
}
