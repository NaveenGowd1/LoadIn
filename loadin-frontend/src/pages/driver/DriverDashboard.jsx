import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Truck,
    PackageCheck,
    Clock,
    CheckCircle2,
    AlertCircle,
    ShieldAlert,
    ShieldCheck,
    ArrowRight,
    RefreshCw,
    UserCheck,
    Search,
    ClipboardList,
    History,
} from "lucide-react";
import { getDriverDashboard } from "../../services/driverService";

export default function DriverDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getDriverDashboard();
            setDashboard(data);
        } catch (err) {
            console.error("Failed to fetch driver dashboard:", err);
            setError(
                err.response?.data?.detail ||
                    "Unable to load dashboard data. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const summary = dashboard?.shipment_summary || {
        total_shipments: 0,
        assigned: 0,
        in_transit: 0,
        delivered: 0,
    };

    const nextStep = dashboard?.next_step;
    const profile = dashboard?.profile;
    const canAcceptLoads = dashboard?.permissions?.can_accept_loads;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-blue-600">
                        DRIVER OVERVIEW
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-slate-500">
                        {dashboard?.driver?.email
                            ? `Welcome back, ${dashboard.driver.email}`
                            : "Track your shipments, verification status, and return-trip opportunities."}
                    </p>
                </div>

                {!loading && (
                    <button
                        onClick={fetchDashboard}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                    <p className="mt-4 text-sm font-medium text-slate-600">
                        Loading your workspace...
                    </p>
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
                    <AlertCircle size={36} className="mx-auto text-red-500" />
                    <h2 className="mt-4 text-lg font-semibold text-slate-900">
                        Something went wrong
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">{error}</p>
                    <button
                        onClick={fetchDashboard}
                        className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Main Content */}
            {!loading && !error && dashboard && (
                <>
                    {/* Next Step / Verification Status Banner */}
                    {nextStep === "COMPLETE_PROFILE" && (
                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                    <UserCheck size={24} />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-amber-950">
                                        Complete Your Driver Profile
                                    </h2>
                                    <p className="mt-1 text-sm text-amber-800">
                                        Add your driving license and vehicle details to
                                        unlock load acceptance on LoadIn.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/driver/profile")}
                                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
                            >
                                Complete Profile
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    )}

                    {nextStep === "WAIT_FOR_VERIFICATION" && (
                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50/80 p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                    <ShieldAlert size={24} />
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <h2 className="text-base font-bold text-blue-950">
                                            {profile?.verification_status === "REJECTED"
                                                ? "Profile Verification Rejected"
                                                : "Verification Under Review"}
                                        </h2>
                                        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-blue-700 shadow-xs">
                                            {profile?.completion_percentage ?? 100}% Complete
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-blue-800">
                                        {profile?.verification_status === "REJECTED"
                                            ? "Please review and update your license or vehicle details for re-verification."
                                            : "You can browse matching loads now. Accepting shipments unlocks as soon as an admin verifies your profile."}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/driver/profile")}
                                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                            >
                                View Profile
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    )}

                    {nextStep === "DASHBOARD" && canAcceptLoads && (
                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
                            <div className="flex items-center gap-3.5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                    <ShieldCheck size={22} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-emerald-950">
                                        Verified & Ready for Loads
                                    </p>
                                    <p className="text-xs text-emerald-800">
                                        Your profile is verified. Search return-trip
                                        shipments matching your vehicle.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/driver/match-loads")}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                Find Return Loads
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    )}

                    {/* Shipment Summary KPI Cards */}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Total Shipments
                                </p>
                                <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                                    <PackageCheck size={18} />
                                </div>
                            </div>
                            <p className="mt-3 text-3xl font-bold text-slate-900">
                                {summary.total_shipments}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Assigned
                                </p>
                                <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                                    <Clock size={18} />
                                </div>
                            </div>
                            <p className="mt-3 text-3xl font-bold text-amber-600">
                                {summary.assigned}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    In Transit
                                </p>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                    <Truck size={18} />
                                </div>
                            </div>
                            <p className="mt-3 text-3xl font-bold text-blue-600">
                                {summary.in_transit}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Delivered
                                </p>
                                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                                    <CheckCircle2 size={18} />
                                </div>
                            </div>
                            <p className="mt-3 text-3xl font-bold text-emerald-600">
                                {summary.delivered}
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800">
                            Quick Actions
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <button
                                onClick={() => navigate("/driver/match-loads")}
                                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
                            >
                                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                    <Search size={22} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        Match Return Loads
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Search available loads along your return route.
                                    </p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate("/driver/my-loads")}
                                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
                            >
                                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                                    <ClipboardList size={22} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        Manage Active Loads
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Start assigned trips or mark deliveries complete.
                                    </p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate("/driver/history")}
                                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
                            >
                                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                                    <History size={22} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        Shipment History
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Review completed deliveries and earnings.
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}