import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Truck,
    Package,
    MapPin,
    Plus,
    RefreshCw,
    Phone,
    X,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import LoadDetailsModal from "./LoadDetailsModal";

const ACTIVE_STATUSES = ["AVAILABLE", "ASSIGNED", "IN_TRANSIT"];

const statusStyles = {
    AVAILABLE: "bg-blue-100 text-blue-700",
    ASSIGNED: "bg-amber-100 text-amber-700",
    IN_TRANSIT: "bg-purple-100 text-purple-700",
};

const formatStatus = (status) =>
    status
        ?.replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase()) || "Unknown";

export default function CustomerActiveLoads() {
    const [loads, setLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLoad, setSelectedLoad] = useState(null);
    const [loadHistory, setLoadHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const fetchActiveLoads = async () => {
        setLoading(true);
        try {
            const response = await api.get("/loads/my-loads/");
            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];
            setLoads(data.filter((load) => ACTIVE_STATUSES.includes(load.status)));
        } catch (err) {
            toast.error(
                err.response?.data?.detail || "Unable to load active shipments."
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
            toast.error("Unable to load shipment history.");
        } finally {
            setHistoryLoading(false);
        }
    };

    const cancelLoad = async (load) => {
        if (load.status !== "AVAILABLE") {
            toast.error("Only available shipments can be cancelled.");
            return;
        }
        if (!window.confirm(`Cancel shipment #${load.id}?`)) return;

        try {
            const response = await api.post(`/loads/${load.id}/cancel/`);
            toast.success(response.data?.message || "Shipment cancelled.");
            setSelectedLoad(null);
            await fetchActiveLoads();
        } catch (err) {
            toast.error(
                err.response?.data?.detail || "Unable to cancel shipment."
            );
        }
    };

    useEffect(() => {
        fetchActiveLoads();
    }, []);

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Active Loads
                    </h2>
                    <p className="mt-1 text-slate-500">
                        Track shipments waiting for pickup, assigned to drivers, or currently in transit.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={fetchActiveLoads}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>

                    <Link
                        to="/customer/create-load"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <Plus size={17} />
                        New Load
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-slate-500">
                    Loading active shipments...
                </div>
            ) : loads.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
                    <Truck size={44} className="mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-semibold text-slate-800">
                        No active loads right now
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Post a new shipment to match with verified return-route drivers.
                    </p>
                    <Link
                        to="/customer/create-load"
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <Plus size={17} />
                        Create Shipment
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {loads.map((load) => (
                        <div
                            key={load.id}
                            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Shipment #{load.id}
                                    </p>
                                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                                        {load.pickup_location}
                                    </h3>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                                        statusStyles[load.status] ||
                                        "bg-slate-100 text-slate-700"
                                    }`}
                                >
                                    {formatStatus(load.status)}
                                </span>
                            </div>

                            <div className="mt-4 flex items-start gap-3">
                                <MapPin
                                    size={18}
                                    className="mt-1 shrink-0 text-blue-600"
                                />
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Destination
                                    </p>
                                    <p className="font-medium text-slate-800">
                                        {load.delivery_location}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-slate-50 p-3 text-sm">
                                <div>
                                    <p className="text-xs text-slate-500">Vehicle</p>
                                    <p className="font-medium text-slate-800">
                                        {load.vehicle_type}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Weight</p>
                                    <p className="font-medium text-slate-800">
                                        {load.weight} kg
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Price</p>
                                    <p className="font-semibold text-slate-900">
                                        ₹{load.price}
                                    </p>
                                </div>
                            </div>

                            {/* Assigned Driver Banner */}
                            {load.driver ? (
                                <div className="mt-4 flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm">
                                    <div>
                                        <p className="text-xs font-medium text-blue-700">
                                            Assigned Driver
                                        </p>
                                        <p className="font-semibold text-slate-900">
                                            {[load.driver.first_name, load.driver.last_name]
                                                .filter(Boolean)
                                                .join(" ") || load.driver.email}
                                            {load.driver.vehicle_number
                                                ? ` • ${load.driver.vehicle_number}`
                                                : ""}
                                        </p>
                                    </div>
                                    {load.driver.phone_number && (
                                        <a
                                            href={`tel:${load.driver.phone_number}`}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm hover:bg-blue-50"
                                        >
                                            <Phone size={14} />
                                            {load.driver.phone_number}
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <p className="mt-4 rounded-lg bg-amber-50 px-3.5 py-2.5 text-xs font-medium text-amber-800">
                                    Awaiting driver match on this route
                                </p>
                            )}

                            <div className="mt-5 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => openLoadDetails(load)}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    <Package size={16} />
                                    Track & Details
                                </button>

                                {load.status === "AVAILABLE" && (
                                    <button
                                        type="button"
                                        onClick={() => cancelLoad(load)}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                                    >
                                        <X size={16} />
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <LoadDetailsModal
                load={selectedLoad}
                history={loadHistory}
                historyLoading={historyLoading}
                onClose={() => setSelectedLoad(null)}
                onCancel={cancelLoad}
            />
        </div>
    );
}