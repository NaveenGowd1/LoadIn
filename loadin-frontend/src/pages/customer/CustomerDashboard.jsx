import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    Plus,
    RefreshCw,
    MapPin,
    Search,
    X,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import LoadDetailsModal from "./LoadDetailsModal";

function CustomerDashboard() {
    const [loads, setLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedLoad, setSelectedLoad] = useState(null);
    const [loadHistory, setLoadHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const fetchLoads = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/loads/my-loads/");
            const data = response.data;
            const loadList = Array.isArray(data) ? data : data.results || [];
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

    const openLoadDetails = async (load) => {
        setSelectedLoad(load);
        setLoadHistory([]);
        setHistoryLoading(true);

        try {
            const response = await api.get(`/loads/${load.id}/history/`);
            const data = response.data;
            const historyList = Array.isArray(data) ? data : data.results || [];
            setLoadHistory(historyList);
        } catch (err) {
            console.error("Failed to fetch load history:", err);
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

        const confirmed = window.confirm(
            `Are you sure you want to cancel shipment #${load.id}?`
        );
        if (!confirmed) return;

        try {
            const response = await api.post(`/loads/${load.id}/cancel/`);
            toast.success(
                response.data?.message || "Shipment cancelled successfully."
            );
            await fetchLoads();

            if (selectedLoad?.id === load.id) {
                setSelectedLoad({ ...selectedLoad, status: "CANCELLED" });
                const historyResponse = await api.get(`/loads/${load.id}/history/`);
                const historyData = historyResponse.data;
                setLoadHistory(
                    Array.isArray(historyData)
                        ? historyData
                        : historyData.results || []
                );
            }
        } catch (err) {
            const message =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Unable to cancel shipment. Please try again.";
            toast.error(message);
        }
    };

    useEffect(() => {
        fetchLoads();
    }, []);

    const counts = {
        total: loads.length,
        available: loads.filter((load) => load.status === "AVAILABLE").length,
        inProgress: loads.filter((load) =>
            ["ASSIGNED", "IN_TRANSIT"].includes(load.status)
        ).length,
        delivered: loads.filter((load) => load.status === "DELIVERED").length,
    };

    const statusStyles = {
        AVAILABLE: "bg-blue-100 text-blue-700",
        ASSIGNED: "bg-amber-100 text-amber-700",
        IN_TRANSIT: "bg-purple-100 text-purple-700",
        DELIVERED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
    };

    const filterOptions = [
        { label: "All Shipments", value: "ALL" },
        { label: "Available", value: "AVAILABLE" },
        { label: "In Progress", value: "IN_PROGRESS" },
        { label: "Completed", value: "DELIVERED" },
        { label: "Cancelled", value: "CANCELLED" },
    ];

    const filteredLoads = loads.filter((load) => {
        const matchesStatus =
            activeFilter === "ALL" ||
            (activeFilter === "IN_PROGRESS"
                ? ["ASSIGNED", "IN_TRANSIT"].includes(load.status)
                : load.status === activeFilter);

        const query = searchQuery.trim().toLowerCase();
        const searchableValues = [
            load.id,
            load.pickup_location,
            load.delivery_location,
            load.goods_description,
            load.vehicle_type,
        ];

        const matchesSearch =
            !query ||
            searchableValues.some((value) =>
                String(value ?? "").toLowerCase().includes(query)
            );

        return matchesStatus && matchesSearch;
    });

    const getFilterCount = (filter) => {
        if (filter === "ALL") return loads.length;
        if (filter === "IN_PROGRESS") {
            return loads.filter((load) =>
                ["ASSIGNED", "IN_TRANSIT"].includes(load.status)
            ).length;
        }
        return loads.filter((load) => load.status === filter).length;
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
            label: "In Progress",
            value: counts.inProgress,
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

    const formatStatus = (status) =>
        status
            ?.replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase()) || "Unknown";

    return (
        <div>
            {/* Welcome & Actions */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Welcome back{user.first_name ? `, ${user.first_name}` : ""}!
                    </h2>
                    <p className="mt-1 text-slate-500">
                        Manage and track your shipments in one place.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={fetchLoads}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>

                    <Link
                        to="/customer/create-load"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Create New Load
                    </Link>
                </div>
            </div>

            {/* Summary Cards */}
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
                                <div className={`rounded-lg p-3 ${card.color}`}>
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

            {/* Shipments Section */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                    <h3 className="text-lg font-bold text-slate-900">
                        My Shipments
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        View, search, and manage your created loads.
                    </p>

                    {/* Search */}
                    <div className="relative mt-5 max-w-xl">
                        <Search
                            size={19}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search by ID, pickup, delivery, goods..."
                            aria-label="Search shipments"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                aria-label="Clear search"
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Status Filters */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {filterOptions.map((filter) => (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => setActiveFilter(filter.value)}
                                aria-pressed={activeFilter === filter.value}
                                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                                    activeFilter === filter.value
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                                        : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                                }`}
                            >
                                {filter.label}
                                <span
                                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                                        activeFilter === filter.value
                                            ? "bg-white/20 text-white"
                                            : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    {getFilterCount(filter.value)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Shipment Results */}
                <div className="p-5 sm:p-6">
                    {loading ? (
                        <div className="py-12 text-center text-slate-500">
                            Loading your shipments...
                        </div>
                    ) : error ? (
                        <div className="py-10 text-center">
                            <p className="mb-4 text-red-600">{error}</p>
                            <button
                                type="button"
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
                    ) : filteredLoads.length === 0 ? (
                        <div className="py-12 text-center">
                            <Package className="mx-auto h-12 w-12 text-slate-300" />
                            <h3 className="mt-4 text-lg font-semibold text-slate-800">
                                No matching shipments
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                {searchQuery.trim()
                                    ? `No shipments match "${searchQuery.trim()}". Try another search.`
                                    : "There are no shipments in this category yet."}
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery("");
                                    setActiveFilter("ALL");
                                }}
                                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Clear Search and Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {filteredLoads.map((load) => (
                                <div
                                    key={load.id}
                                    className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-300 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Shipment #{load.id}
                                            </p>
                                            <h4 className="mt-1 text-lg font-semibold text-slate-900">
                                                {load.pickup_location}
                                            </h4>
                                        </div>

                                        <span
                                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                                                statusStyles[load.status] ||
                                                "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {formatStatus(load.status)}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-start gap-3">
                                        <MapPin
                                            size={19}
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

                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Vehicle Type
                                            </p>
                                            <p className="mt-1 font-medium text-slate-800">
                                                {load.vehicle_type}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Price
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-900">
                                                ₹{load.price}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => openLoadDetails(load)}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
                                    >
                                        <Package size={17} />
                                        View Details
                                    </button>

                                    {load.status === "AVAILABLE" && (
                                        <button
                                            type="button"
                                            onClick={() => cancelLoad(load)}
                                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 font-medium text-red-600 transition hover:bg-red-50"
                                        >
                                            <X size={17} />
                                            Cancel Shipment
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

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

export default CustomerDashboard;