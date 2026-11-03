
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    Plus,
    RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";

function CustomerDashboard() {
    const [loads, setLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const fetchLoads = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/loads/my-loads/");

            // Supports both paginated and non-paginated responses
            const data = response.data;
            const loadList = Array.isArray(data)
                ? data
                : data.results || [];

            setLoads(loadList);
        } catch (err) {
            console.error("Failed to fetch customer loads:", err);

            const message =
                err.response?.data?.detail ||
                "Unable to load your shipments. Please try again.";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoads();
    }, []);

    const counts = {
        total: loads.length,
        available: loads.filter(
            (load) => load.status === "AVAILABLE"
        ).length,
        assigned: loads.filter(
            (load) => load.status === "ASSIGNED"
        ).length,
        delivered: loads.filter(
            (load) => load.status === "DELIVERED"
        ).length,
    };

    const statusStyles = {
        AVAILABLE: "bg-blue-100 text-blue-700",
        ASSIGNED: "bg-amber-100 text-amber-700",
        IN_TRANSIT: "bg-purple-100 text-purple-700",
        DELIVERED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
    };

    const summaryCards = [
        {
            label: "Total Shipments",
            value: counts.total,
            icon: Package,
            color: "bg-blue-50 text-blue-600",
        },
        {
            label: "Available",
            value: counts.available,
            icon: Clock,
            color: "bg-amber-50 text-amber-600",
        },
        {
            label: "Assigned",
            value: counts.assigned,
            icon: Truck,
            color: "bg-purple-50 text-purple-600",
        },
        {
            label: "Delivered",
            value: counts.delivered,
            icon: CheckCircle,
            color: "bg-green-50 text-green-600",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            LoadIn
                        </h1>
                        <p className="text-sm text-slate-500">
                            Customer Portal
                        </p>
                    </div>

                    <button
                        onClick={fetchLoads}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Welcome back
                            {user.first_name
                                ? `, ${user.first_name}`
                                : ""}!
                        </h2>
                        <p className="mt-1 text-slate-500">
                            Manage and track your shipments in one place.
                        </p>
                    </div>

                    <Link
                        to="/customer/create-load"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Create New Load
                    </Link>
                </div>

                {/* Summary cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.label}
                                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-slate-500">
                                        {card.label}
                                    </p>

                                    <div
                                        className={`rounded-lg p-3 ${card.color}`}
                                    >
                                        <Icon size={21} />
                                    </div>
                                </div>

                                <p className="mt-4 text-3xl font-bold text-slate-900">
                                    {loading ? "—" : card.value}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Shipments */}
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                My Shipments
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Your recently created loads
                            </p>
                        </div>
                    </div>

                    <div className="p-5 sm:p-6">
                        {loading ? (
                            <div className="py-12 text-center text-slate-500">
                                Loading your shipments...
                            </div>
                        ) : error ? (
                            <div className="py-10 text-center">
                                <p className="mb-4 text-red-600">
                                    {error}
                                </p>

                                <button
                                    onClick={fetchLoads}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : loads.length === 0 ? (
                            <div className="py-12 text-center">
                                <Package
                                    size={42}
                                    className="mx-auto mb-4 text-slate-300"
                                />

                                <h4 className="text-lg font-semibold text-slate-800">
                                    No shipments yet
                                </h4>

                                <p className="mt-2 text-sm text-slate-500">
                                    Create your first load to get started.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {loads.map((load) => (
                                    <div
                                        key={load.id}
                                        className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 sm:p-5"
                                    >
                                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                            <div className="flex-1">
                                                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                    Shipment #{load.id}
                                                </p>

                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div>
                                                        <p className="text-xs text-slate-500">
                                                            Pickup
                                                        </p>
                                                        <p className="mt-1 font-semibold text-slate-800">
                                                            {load.pickup_location}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-slate-500">
                                                            Delivery
                                                        </p>
                                                        <p className="mt-1 font-semibold text-slate-800">
                                                            {load.delivery_location}
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="mt-4 text-sm text-slate-500">
                                                    {load.vehicle_type}
                                                    {" · "}
                                                    {load.weight} kg
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-slate-700">
                                                    ₹{load.price}
                                                </p>
                                            </div>

                                            <span
                                                className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                    statusStyles[load.status] ||
                                                    "bg-slate-100 text-slate-700"
                                                }`}
                                            >
                                                {(load.status || "UNKNOWN")
                                                    .replaceAll("_", " ")}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default CustomerDashboard;
