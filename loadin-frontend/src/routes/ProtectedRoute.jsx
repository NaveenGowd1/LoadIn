
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRole }) {
    const accessToken = localStorage.getItem("access");
    const storedUser = localStorage.getItem("user");

    // If the user is not logged in, redirect to login
    if (!accessToken || !storedUser) {
        return <Navigate to="/login" replace />;
    }

    let user;

    try {
        user = JSON.parse(storedUser);
    } catch {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        return <Navigate to="/login" replace />;
    }

    // Verify that the logged-in user's role is allowed
    if (user.role !== allowedRole) {
        if (user.role === "CUSTOMER") {
            return <Navigate to="/customer/my-loads" replace />;
        }

        if (user.role === "DRIVER") {
            return <Navigate to="/driver/my-loads" replace />;
        }

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
