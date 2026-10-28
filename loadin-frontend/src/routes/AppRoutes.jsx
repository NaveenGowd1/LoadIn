import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/auth/LandingPage";
import CustomerRegister from "../pages/auth/CustomerRegister";
import CustomerLogin from "../pages/auth/CustomerLogin";
import DriverRegister from "../pages/auth/DriverRegister";
import DriverLogin from "../pages/auth/DriverLogin";

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import DriverDashboard from "../pages/driver/DriverDashboard";
import { RollerCoaster } from "lucide-react";
import RoleSelection from "../pages/auth/RoleSelection";


function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<LandingPage />} />

                <Route path="/login" element = {<RoleSelection mode="login" />} />

                <Route path="/register" element = {<RoleSelection mode="register" />} />

                <Route
                    path="/customer/register"
                    element={<CustomerRegister />}
                />

                <Route
                    path="/customer/login"
                    element={<CustomerLogin />}
                />

                <Route
                    path="/driver/register"
                    element={<DriverRegister />}
                />

                <Route
                    path="/driver/login"
                    element={<DriverLogin />}
                />

                <Route
                    path="/customer/dashboard"
                    element={<CustomerDashboard />}
                />

                <Route
                    path="/driver/dashboard"
                    element={<DriverDashboard />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;