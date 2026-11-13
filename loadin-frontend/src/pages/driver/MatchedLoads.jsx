import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    PackageSearch,
    Truck,
    Weight,
    IndianRupee,
    AlertCircle,
} from "lucide-react";
import { acceptLoad } from "../../services/loadService";

export default function MatchedLoads() {
    const navigate = useNavigate();
    const location = useLocation();

    const [matches, setMatches] = useState(location.state?.matches || []);
    const [acceptingId, setAcceptingId] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const currentLocation = location.state?.currentLocation || "";
    const returnDestination = location.state?.returnDestination || "";

    const handleAcceptShipment = async (loadId) => {
        try {
            setErrorMsg("");
            setAcceptingId(loadId);

            await acceptLoad(loadId);

            // Remove from local list in case the user hits browser Back
            setMatches((prev) => prev.filter((load) => load.id !== loadId));

            // Redirect to DriverMyLoads, which automatically calls getMyAcceptedLoads()
            navigate("/driver/my-loads");
        } catch (err) {
            console.error("Failed to accept shipment:", err);
            setErrorMsg(
                err.response?.data?.detail ||
                "Unable to accept this shipment. Please try again."
            );
        } finally {
            setAcceptingId(null);
        }
    };

    return (
        <div className="space-y-8">

            <button
                onClick={() => navigate("/driver/match-loads")}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
            >
                <ArrowLeft size={17} />
                Back to Match Loads
            </button>

            <div>
                <p className="text-sm font-medium text-blue-600">
                    YOUR MATCHED SHIPMENTS
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Matching Loads
                </h1>

                <p className="mt-2 text-slate-500">
                    {currentLocation} → {returnDestination}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                    {matches.length} matching shipments found.
                    Sorted by highest price first.
                </p>
            </div>

            {errorMsg && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    <AlertCircle size={18} className="shrink-0 text-red-500" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {matches.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
                    <PackageSearch
                        size={38}
                        className="mx-auto text-slate-400"
                    />

                    <h2 className="mt-4 text-lg font-semibold">
                        No matching shipments found
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Try searching with different locations.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5">
                    {matches.map((load) => (
                        <article
                            key={load.id}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-lg font-bold text-slate-900">
                                    Shipment #{load.id}
                                </h2>

                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    Available
                                </span>
                            </div>

                            <div className="my-5 grid gap-5 sm:grid-cols-2">
                                <div className="flex gap-3">
                                    <MapPin className="text-emerald-600" />
                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Pickup
                                        </p>
                                        <p className="font-semibold">
                                            {load.pickup_location}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <MapPin className="text-red-500" />
                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Delivery
                                        </p>
                                        <p className="font-semibold">
                                            {load.delivery_location}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                <div className="flex gap-2">
                                    <Truck size={18} />
                                    <span className="text-sm">
                                        {load.vehicle_type}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <Weight size={18} />
                                    <span className="text-sm">
                                        {load.weight} kg
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                                <div>
                                    <p className="text-xs text-slate-400">
                                        Offered Price
                                    </p>

                                    <p className="mt-1 flex items-center text-xl font-bold text-emerald-600">
                                        <IndianRupee size={19} />
                                        {Number(load.price).toLocaleString("en-IN")}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleAcceptShipment(load.id)}
                                    disabled={acceptingId !== null}
                                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {acceptingId === load.id
                                        ? "Accepting..."
                                        : "Accept Shipment"}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

        </div>
    );
}