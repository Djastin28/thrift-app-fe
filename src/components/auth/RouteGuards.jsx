import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

// Protected Route - requires authentication
export function ProtectedRoute({ children }) {
  const { token } = useAuthStore();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Admin Route - requires admin role
export function AdminRoute({ children }) {
  const { token, user } = useAuthStore();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Guest Route - only for non-authenticated users
export function GuestRoute({ children }) {
  const { token, user } = useAuthStore();

  if (token) {
    // Redirect based on role
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
