import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/auth/LandingPage";
import CustomerRegister from "../pages/auth/CustomerRegister";
import CustomerLogin from "../pages/auth/CustomerLogin";
import DriverRegister from "../pages/auth/DriverRegister";
import DriverLogin from "../pages/auth/DriverLogin";

import DriverDashboard from "../pages/driver/DriverDashboard";
import RoleSelection from "../pages/auth/RoleSelection";
import ProtectedRoute from "./ProtectedRoute";


import { Navigate } from "react-router-dom";

import DriverLayout from "../components/layout/DriverLayout";
import DriverMyLoads from "../pages/driver/MyLoads";
import DriverHistory from "../pages/driver/History";
import DriverProfile from "../pages/driver/Profile";
import MatchLoadsPanel from "../pages/driver/MatchLoadsPanel";
import MatchedLoads from "../pages/driver/MatchedLoads";

import CustomerLayout from "../components/layout/CustomerLayout";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CustomerActiveLoads from "../pages/customer/ActiveLoads";
import CustomerHistory from "../pages/customer/History";
import CustomerProfile from "../pages/customer/Profile";
import CreateLoad from "../pages/customer/CreateLoad";


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
                    <Route path="/customer" element={<CustomerLayout />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="active-loads" element={<CustomerActiveLoads />} />
                        <Route path="history" element={<CustomerHistory />} />
                        <Route path="profile" element={<CustomerProfile />} />
                        <Route path="dashboard" element={<CustomerDashboard />} />
                        <Route path="create-load" element={<CreateLoad />} />
                    </Route>
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