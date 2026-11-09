
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    Truck,
    History,
    UserRound,
    LayoutDashboard,
    LogOut,
} from "lucide-react";

const navigation = [
    {
        name: "My Loads",
        path: "/driver/dashboard",
        icon: Truck,
    },
    {
        name: "History",
        path: "/driver/history",
        icon: History,
    },
    {
        name: "Profile",
        path: "/driver/profile",
        icon: UserRound,
    },
    {
        name: "Dashboard",
        path: "/driver/overview",
        icon: LayoutDashboard,
    },
];

export default function DriverLayout() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        navigate("/driver/login");
    };

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Top Navigation */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <Truck size={22} />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                LoadIn
                            </h1>
                            <p className="text-xs text-slate-500">
                                Driver Portal
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden items-center gap-2 md:flex">

                        {navigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    end={item.path === "/driver/dashboard"}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        }`
                                    }
                                >
                                    <Icon size={18} />
                                    {item.name}
                                </NavLink>
                            );
                        })}

                    </nav>

                    {/* User and Logout */}
                    <div className="flex items-center gap-3">

                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-slate-800">
                                {user.first_name || "Driver"}
                            </p>
                            <p className="text-xs text-slate-500">
                                {user.email}
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut size={17} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>

                    </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 md:hidden">

                    {navigation.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.path === "/driver/dashboard"}
                                className={({ isActive }) =>
                                    `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`
                                }
                            >
                                <Icon size={17} />
                                {item.name}
                            </NavLink>
                        );
                    })}

                </nav>

            </header>

            {/* Current Page */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
            </main>

        </div>
    );
}
