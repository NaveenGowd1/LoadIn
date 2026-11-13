import { useCallback, useEffect, useState } from "react";
import {
    PackageSearch,
    MapPin,
    CalendarDays,
    Weight,
    Truck,
    IndianRupee,
    RefreshCw,
    ArrowRight,
    AlertCircle,
    Play,
    CheckCircle2,
} from "lucide-react";

import MatchLoadsPanel from "./MatchLoadsPanel";
import { useNavigate } from "react-router-dom";
import {
    getMyAcceptedLoads,
    startLoad,
    deliverLoad,
} from "../../services/loadService";

function StatusBadge({ status }) {
    const styles = {
        ASSIGNED: "bg-amber-50 text-amber-700 border-amber-200",
        IN_TRANSIT: "bg-blue-50 text-blue-700 border-blue-200",
    };

    const labels = {
        ASSIGNED: "Assigned",
        IN_TRANSIT: "In Transit",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                styles[status] || "bg-slate-100 text-slate-600 border-slate-200"
            }`}
        >
            {labels[status] || status}
        </span>
    );
}

function LoadCard({ load, actionLoadingId, onStartTrip, onDeliverLoad }) {
    const formatDate = (date) => {
        if (!date) return "Not specified";

        return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatPrice = (price) => {
        return Number(price).toLocaleString("en-IN");
    };

    const isProcessing = actionLoadingId === load.id;

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">

            {/* Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Shipment ID
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                        #{load.id}
                    </h2>
                </div>

                <StatusBadge status={load.status} />
            </div>

            <div className="my-5 border-t border-slate-100" />

            {/* Route */}
            <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">

                <div className="flex gap-3">
                    <div className="mt-1 text-emerald-600">
                        <MapPin size={20} />
                    </div>

                    <div>
                        <p className="text-xs text-slate-400">Pickup Location</p>
                        <p className="mt-1 font-semibold text-slate-800">
                            {load.pickup_location}
                        </p>
                    </div>
                </div>

                <div className="hidden text-slate-300 sm:block">
                    <ArrowRight size={22} />
                </div>

                <div className="flex gap-3">
                    <div className="mt-1 text-red-500">
                        <MapPin size={20} />
                    </div>

                    <div>
                        <p className="text-xs text-slate-400">Delivery Location</p>
                        <p className="mt-1 font-semibold text-slate-800">
                            {load.delivery_location}
                        </p>
                    </div>
                </div>

            </div>

            <div className="my-5 border-t border-slate-100" />

            {/* Shipment Details */}
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">

                <div className="flex items-start gap-2">
                    <Truck size={18} className="mt-0.5 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-400">Vehicle</p>
                        <p className="mt-1 text-sm font-medium text-slate-700">
                            {load.vehicle_type}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Weight size={18} className="mt-0.5 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-400">Weight</p>
                        <p className="mt-1 text-sm font-medium text-slate-700">
                            {load.weight} kg
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <CalendarDays size={18} className="mt-0.5 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-400">Pickup Date</p>
                        <p className="mt-1 text-sm font-medium text-slate-700">
                            {formatDate(load.pickup_date)}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <CalendarDays size={18} className="mt-0.5 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-400">Delivery Date</p>
                        <p className="mt-1 text-sm font-medium text-slate-700">
                            {formatDate(load.delivery_date)}
                        </p>
                    </div>
                </div>

            </div>

            <div className="my-5 border-t border-slate-100" />

            {/* Footer */}
            <div className="flex flex-wrap items-end justify-between gap-4">

                <div>
                    <p className="text-xs text-slate-400">Goods Description</p>
                    <p className="mt-1 text-sm text-slate-700">
                        {load.goods_description}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-slate-400">Shipment Price</p>
                        <p className="mt-1 flex items-center justify-end text-xl font-bold text-emerald-600">
                            <IndianRupee size={19} />
                            {formatPrice(load.price)}
                        </p>
                    </div>

                    {load.status === "ASSIGNED" && (
                        <button
                            onClick={() => onStartTrip(load.id)}
                            disabled={actionLoadingId !== null}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Play size={16} />
                            {isProcessing ? "Starting..." : "Start Trip"}
                        </button>
                    )}

                    {load.status === "IN_TRANSIT" && (
                        <button
                            onClick={() => onDeliverLoad(load.id)}
                            disabled={actionLoadingId !== null}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <CheckCircle2 size={16} />
                            {isProcessing ? "Completing..." : "Mark Delivered"}
                        </button>
                    )}
                </div>

            </div>

        </article>
    );
}

export default function DriverMyLoads() {
    const [loads, setLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [showMatchPanel, setShowMatchPanel] = useState(false);
    const navigate = useNavigate();

    const fetchLoads = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getMyAcceptedLoads();

            setLoads(
                Array.isArray(data)
                    ? data
                    : Array.isArray(data.results)
                        ? data.results
                        : []
            );
        } catch (err) {
            console.error("Failed to fetch driver loads:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to load your shipments. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLoads();
    }, [fetchLoads]);

    const handleStartTrip = async (loadId) => {
        try {
            setActionError("");
            setActionLoadingId(loadId);

            await startLoad(loadId);

            // Update status locally from ASSIGNED -> IN_TRANSIT
            setLoads((prev) =>
                prev.map((load) =>
                    load.id === loadId
                        ? { ...load, status: "IN_TRANSIT" }
                        : load
                )
            );
        } catch (err) {
            console.error("Failed to start trip:", err);
            setActionError(
                err.response?.data?.detail ||
                "Unable to start the trip. Please try again."
            );
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDeliverLoad = async (loadId) => {
        try {
            setActionError("");
            setActionLoadingId(loadId);

            await deliverLoad(loadId);

            // Remove from active shipments list once delivered
            setLoads((prev) => prev.filter((load) => load.id !== loadId));
        } catch (err) {
            console.error("Failed to mark load delivered:", err);
            setActionError(
                err.response?.data?.detail ||
                "Unable to complete delivery. Please try again."
            );
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="space-y-8">
            {showMatchPanel ? (
                <MatchLoadsPanel
                    onBack={() => setShowMatchPanel(false)}
                />
            ) : (
                <>

                    {/* Page Heading */}
                    <div className="flex flex-wrap items-end justify-between gap-4">

                        <div>
                            <p className="text-sm font-medium text-blue-600">
                                DRIVER WORKSPACE
                            </p>

                            <h1 className="mt-2 text-3xl font-bold text-slate-900">
                                My Loads
                            </h1>

                            <p className="mt-2 text-slate-500">
                                Manage your accepted shipments and ongoing deliveries.
                            </p>
                        </div>

                        {!loading && !error && loads.length > 0 && (
                            <button
                                onClick={fetchLoads}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                <RefreshCw size={16} />
                                Refresh
                            </button>
                        )}

                    </div>

                    {/* Action Error Banner */}
                    {actionError && (
                        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            <AlertCircle size={18} className="shrink-0 text-red-500" />
                            <span>{actionError}</span>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

                            <p className="mt-4 text-sm font-medium text-slate-600">
                                Loading your shipments...
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">

                            <AlertCircle
                                size={36}
                                className="mx-auto text-red-500"
                            />

                            <h2 className="mt-4 text-lg font-semibold text-slate-900">
                                Something went wrong
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                {error}
                            </p>

                            <button
                                onClick={fetchLoads}
                                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Try Again
                            </button>

                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && loads.length === 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <PackageSearch size={32} />
                            </div>

                            <h2 className="mt-6 text-xl font-semibold text-slate-900">
                                No accepted loads
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                You don't have any active shipments right now.
                                Do you want to find loads matching your return journey?
                            </p>

                            <button
                                onClick={() => navigate("/driver/match-loads")}
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Match Loads
                                <ArrowRight size={17} />
                            </button>

                        </div>
                    )}

                    {/* Active Loads */}
                    {!loading && !error && loads.length > 0 && (
                        <div className="space-y-5">

                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-800">
                                    Active Shipments
                                </h2>

                                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                                    {loads.length} {loads.length === 1 ? "Shipment" : "Shipments"}
                                </span>
                            </div>

                            <div className="grid gap-5">
                                {loads.map((load) => (
                                    <LoadCard
                                        key={load.id}
                                        load={load}
                                        actionLoadingId={actionLoadingId}
                                        onStartTrip={handleStartTrip}
                                        onDeliverLoad={handleDeliverLoad}
                                    />
                                ))}
                            </div>

                        </div>
                    )}
                </>
            )}
        </div>
    );
}