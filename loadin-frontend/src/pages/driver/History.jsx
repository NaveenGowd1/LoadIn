import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    PackageCheck,
    MapPin,
    CalendarDays,
    Weight,
    Truck,
    IndianRupee,
    RefreshCw,
    ArrowRight,
    AlertCircle,
    Clock,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { getDriverLoadHistory } from "../../services/loadService";

const STATUS_LABELS = {
    AVAILABLE: "Posted by Customer",
    ASSIGNED: "Accepted by You",
    IN_TRANSIT: "Trip Started",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

function HistoryCard({ load }) {
    const [showTimeline, setShowTimeline] = useState(false);

    const formatDate = (date) => {
        if (!date) return "Not specified";
        return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatDateTime = (isoString) => {
        if (!isoString) return "";
        return new Date(isoString).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const sortedHistory = [...(load.status_history || [])].sort(
        (a, b) => new Date(a.changed_at) - new Date(b.changed_at)
    );

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

                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Delivered
                </span>
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
                        <p className="text-xs text-slate-400">Delivered On</p>
                        <p className="mt-1 text-sm font-medium text-slate-700">
                            {formatDateTime(load.updated_at) || formatDate(load.delivery_date)}
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

                <div className="flex items-center gap-5">
                    <div className="text-right">
                        <p className="text-xs text-slate-400">Earned Amount</p>
                        <p className="mt-1 flex items-center justify-end text-xl font-bold text-emerald-600">
                            <IndianRupee size={19} />
                            {Number(load.price).toLocaleString("en-IN")}
                        </p>
                    </div>

                    {sortedHistory.length > 0 && (
                        <button
                            onClick={() => setShowTimeline((prev) => !prev)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            <Clock size={15} />
                            Timeline
                            {showTimeline ? (
                                <ChevronUp size={15} />
                            ) : (
                                <ChevronDown size={15} />
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Expandable Delivery Timeline */}
            {showTimeline && sortedHistory.length > 0 && (
                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Delivery Timeline
                    </p>
                    <ol className="space-y-3 border-l-2 border-emerald-200 pl-4">
                        {sortedHistory.map((entry, idx) => (
                            <li key={idx} className="relative">
                                <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                                <p className="text-sm font-semibold text-slate-800">
                                    {STATUS_LABELS[entry.status] || entry.status}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {formatDateTime(entry.changed_at)}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </article>
    );
}

export default function History() {
    const [historyLoads, setHistoryLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getDriverLoadHistory();
            setHistoryLoads(
                Array.isArray(data)
                    ? data
                    : Array.isArray(data.results)
                        ? data.results
                        : []
            );
        } catch (err) {
            console.error("Failed to fetch driver load history:", err);
            setError(
                err.response?.data?.detail ||
                "Unable to load shipment history. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const totalEarnings = historyLoads.reduce(
        (sum, load) => sum + Number(load.price || 0),
        0
    );

    return (
        <div className="space-y-8">
            {/* Page Heading */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-blue-600">
                        DRIVER WORKSPACE
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Shipment History
                    </h1>
                    <p className="mt-2 text-slate-500">
                        View your completed shipments and their delivery timelines.
                    </p>
                </div>

                {!loading && !error && historyLoads.length > 0 && (
                    <button
                        onClick={fetchHistory}
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
                        Loading shipment history...
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
                        onClick={fetchHistory}
                        className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && historyLoads.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <PackageCheck size={32} />
                    </div>
                    <h2 className="mt-6 text-xl font-semibold text-slate-900">
                        No completed shipments yet
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Once you deliver an accepted shipment, it will appear here
                        along with its full delivery timeline.
                    </p>
                    <button
                        onClick={() => navigate("/driver/match-loads")}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Find Return Loads
                        <ArrowRight size={17} />
                    </button>
                </div>
            )}

            {/* Summary + Completed Loads List */}
            {!loading && !error && historyLoads.length > 0 && (
                <div className="space-y-6">
                    {/* Summary Bar */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Completed Trips
                            </p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {historyLoads.length}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Total Earnings
                            </p>
                            <p className="mt-2 flex items-center text-2xl font-bold text-emerald-600">
                                <IndianRupee size={22} />
                                {totalEarnings.toLocaleString("en-IN")}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5">
                        {historyLoads.map((load) => (
                            <HistoryCard key={load.id} load={load} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}