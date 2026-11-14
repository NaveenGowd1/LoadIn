import { useEffect, useState } from "react";
import {
    History as HistoryIcon,
    CheckCircle,
    XCircle,
    IndianRupee,
    MapPin,
    Package,
    RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import LoadDetailsModal from "./LoadDetailsModal";

const HISTORY_STATUSES = ["DELIVERED", "CANCELLED"];

export default function CustomerHistory() {
    const [loads, setLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [selectedLoad, setSelectedLoad] = useState(null);
    const [loadHistory, setLoadHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await api.get("/loads/my-loads/");
            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];
            setLoads(
                data.filter((load) => HISTORY_STATUSES.includes(load.status))
            );
        } catch (err) {
            toast.error(
                err.response?.data?.detail || "Unable to load shipment history."
            );
        } finally {
            setLoading(false);
        }
    };

    const openLoadDetails = async (load) => {
        setSelectedLoad(load);
        setLoadHistory([]);
        setHistoryLoading(true);

        try {
            const response = await api.get(`/loads/${load.id}/history/`);
            setLoadHistory(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );
        } catch {
            toast.error("Unable to load shipment timeline.");
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const deliveredLoads = loads.filter((l) => l.status === "DELIVERED");
    const cancelledLoads = loads.filter((l) => l.status === "CANCELLED");
    const totalSpent = deliveredLoads.reduce(
        (sum, l) => sum + Number(l.price || 0),
        0
    );

    const visibleLoads =
        filter === "ALL"
            ? loads
            : loads.filter((l) => l.status === filter);

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Shipment History
                    </h2>
                    <p className="mt-1 text-slate-500">
                        Review your completed deliveries, cancelled loads, and total freight spend.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchHistory}
                    disabled={loading}
                    className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Summary Strip */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">
                            Completed Deliveries
                        </p>
                        <div className="rounded-lg bg-green-50 p-3 text-green-600">
                            <CheckCircle size={20} />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-bold text-slate-900">
                        {loading ? "—" : deliveredLoads.length}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">
                            Total Freight Spent
                        </p>
                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                            <IndianRupee size={20} />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-bold text-slate-900">
                        {loading ? "—" : `₹${totalSpent.toLocaleString("en-IN")}`}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">
                            Cancelled Loads
                        </p>
                        <div className="rounded-lg bg-red-50 p-3 text-red-600">
                            <XCircle size={20} />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-bold text-slate-900">
                        {loading ? "—" : cancelledLoads.length}
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
                {[
                    { label: `All (${loads.length})`, value: "ALL" },
                    { label: `Delivered (${deliveredLoads.length})`, value: "DELIVERED" },
                    { label: `Cancelled (${cancelledLoads.length})`, value: "CANCELLED" },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => setFilter(tab.value)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                            filter === tab.value
                                ? "bg-blue-600 text-white shadow-sm"
                                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-slate-500">
                    Loading shipment history...
                </div>
            ) : visibleLoads.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
                    <HistoryIcon
                        size={44}
                        className="mx-auto mb-4 text-slate-300"
                    />
                    <h3 className="text-lg font-semibold text-slate-800">
                        No past shipments found
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Delivered and cancelled loads will appear here automatically.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {visibleLoads.map((load) => (
                        <div
                            key={load.id}
                            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Shipment #{load.id}
                                    </p>
                                    <h3 className="mt-1 text-lg font-semibold text-slate-900">
                                        {load.pickup_location}
                                    </h3>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                                        load.status === "DELIVERED"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {load.status === "DELIVERED"
                                        ? "Delivered"
                                        : "Cancelled"}
                                </span>
                            </div>

                            <div className="mt-4 flex items-start gap-3">
                                <MapPin
                                    size={18}
                                    className="mt-1 shrink-0 text-blue-600"
                                />
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Delivery Location
                                    </p>
                                    <p className="font-medium text-slate-800">
                                        {load.delivery_location}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Vehicle Type
                                    </p>
                                    <p className="font-medium text-slate-800">
                                        {load.vehicle_type}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Amount
                                    </p>
                                    <p className="font-semibold text-slate-900">
                                        ₹{load.price}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => openLoadDetails(load)}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                <Package size={16} />
                                View Timeline & Receipt
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <LoadDetailsModal
                load={selectedLoad}
                history={loadHistory}
                historyLoading={historyLoading}
                onClose={() => setSelectedLoad(null)}
            />
        </div>
    );
}