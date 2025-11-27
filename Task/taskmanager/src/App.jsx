import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import TaskManagementPage from "./pages/TaskManagementPage";
import Navbar from "./components/Navbar";


// 🔐 Protected Route Wrapper
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen">
      {/* Navbar is visible only when logged in */}
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <Routes>

          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Dashboard → Only logged-in users allowed */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          {/* Task Management → Managers Only */}
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TaskManagementPage />
              </PrivateRoute>
            }
          />

          {/* Unknown URLs redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </div>
  );
}
