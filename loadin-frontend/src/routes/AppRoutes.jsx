import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/auth/LandingPage";
import CustomerRegister from "../pages/auth/CustomerRegister";
import CustomerLogin from "../pages/auth/CustomerLogin";
import DriverRegister from "../pages/auth/DriverRegister";
import DriverLogin from "../pages/auth/DriverLogin";

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import DriverDashboard from "../pages/driver/DriverDashboard";
import RoleSelection from "../pages/auth/RoleSelection";
import ProtectedRoute from "./ProtectedRoute";
import CreateLoad from "../pages/customer/CreateLoad";

import { Navigate } from "react-router-dom";

import DriverLayout from "../components/layout/DriverLayout";
import DriverMyLoads from "../pages/driver/MyLoads";
import DriverHistory from "../pages/driver/History";
import DriverProfile from "../pages/driver/Profile";
import MatchLoadsPanel from "../pages/driver/MatchLoadsPanel";
import MatchedLoads from "../pages/driver/MatchedLoads";


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

                <Route element={<ProtectedRoute allowedRole="CUSTOMER" />}>
                    <Route
                        path="/customer/dashboard"
                        element={<CustomerDashboard />}
                    />
                    <Route path="/customer/create-load" element={<CreateLoad />} />
                </Route>

                <Route element={<ProtectedRoute allowedRole="DRIVER" />}>

                    <Route path="/driver" element={<DriverLayout />}>

                        <Route
                            index
                            element={<Navigate to="dashboard" replace />}
                        />

                        <Route
                            path="my-loads"
                            element={<DriverMyLoads />}
                        />

                        <Route
                            path="history"
                            element={<DriverHistory />}
                        />

                        <Route
                            path="profile"
                            element={<DriverProfile />}
                        />

                        <Route
                            path="dashboard"
                            element={<DriverDashboard />}
                        />

                        <Route
                            path="match-loads"
                            element={<MatchLoadsPanel />}
                        />

                        <Route
                            path="matched-loads"
                            element={<MatchedLoads />}
                        />

                    </Route>

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;