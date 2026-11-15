import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    ArrowLeft,
    AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { matchLoads } from "../../services/loadService";
import LocationPickerField from "../../components/maps/LocationPickerField";

export default function MatchLoadsPanel({ onBack }) {
    const navigate = useNavigate();

    const [routeData, setRouteData] = useState({
        current_location: "",
        current_latitude: null,
        current_longitude: null,
        return_destination: "",
        destination_latitude: null,
        destination_longitude: null,
        radius_km: 30,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate("/driver/my-loads");
        }
    };

    const handleSearch = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await matchLoads({
                current_location: routeData.current_location,
                current_latitude: routeData.current_latitude,
                current_longitude: routeData.current_longitude,
                return_destination: routeData.return_destination,
                destination_latitude: routeData.destination_latitude,
                destination_longitude: routeData.destination_longitude,
                radius_km: Number(routeData.radius_km) || 30,
            });

            const results = Array.isArray(data) ? data : data.results || [];

            navigate("/driver/matched-loads", {
                state: {
                    matches: results,
                    currentLocation: routeData.current_location,
                    returnDestination: routeData.return_destination,
                },
            });
        } catch (err) {
            const message =
                err.response?.data?.detail || "Unable to search matching loads.";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const hasCoordinates =
        routeData.current_latitude !== null &&
        routeData.destination_latitude !== null;

    return (
        <div className="space-y-8">
            <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
            >
                <ArrowLeft size={17} />
                Back to My Loads
            </button>

            <div>
                <p className="text-sm font-medium text-blue-600">
                    FIND YOUR NEXT SHIPMENT
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Match Loads
                </h1>

                <p className="mt-2 max-w-2xl text-slate-500">
                    Pin or enter your current location and return destination.
                    We'll find available shipments along your route.
                </p>
            </div>

            {/* Location Form */}
            <form
                onSubmit={handleSearch}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
                <div className="grid gap-6 md:grid-cols-2">
                    <LocationPickerField
                        label="Your Current Location"
                        placeholder="Search current location or pin on map"
                        value={routeData.current_location}
                        latitude={routeData.current_latitude}
                        longitude={routeData.current_longitude}
                        onSelectLocation={({ address, latitude, longitude }) =>
                            setRouteData((prev) => ({
                                ...prev,
                                current_location: address,
                                current_latitude: latitude,
                                current_longitude: longitude,
                            }))
                        }
                    />

                    <LocationPickerField
                        label="Your Return Destination"
                        placeholder="Search return destination or pin on map"
                        value={routeData.return_destination}
                        latitude={routeData.destination_latitude}
                        longitude={routeData.destination_longitude}
                        onSelectLocation={({ address, latitude, longitude }) =>
                            setRouteData((prev) => ({
                                ...prev,
                                return_destination: address,
                                destination_latitude: latitude,
                                destination_longitude: longitude,
                            }))
                        }
                    />
                </div>

                {/* Optional Search Radius when map pins are used */}
                {hasCoordinates && (
                    <div className="mt-5 max-w-xs">
                        <label
                            htmlFor="radius_km"
                            className="mb-1.5 block text-xs font-semibold text-slate-600"
                        >
                            Match Radius (km from pinned route)
                        </label>
                        <select
                            id="radius_km"
                            value={routeData.radius_km}
                            onChange={(e) =>
                                setRouteData((prev) => ({
                                    ...prev,
                                    radius_km: Number(e.target.value),
                                }))
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
                        >
                            <option value={10}>Within 10 km</option>
                            <option value={25}>Within 25 km</option>
                            <option value={30}>Within 30 km</option>
                            <option value={50}>Within 50 km</option>
                            <option value={100}>Within 100 km</option>
                        </select>
                    </div>
                )}

                <p className="mt-4 text-xs text-slate-400">
                    {hasCoordinates
                        ? `Using exact GPS radius matching (within ${routeData.radius_km} km of your pinned pickup and drop-off).`
                        : "Tip: Click 'Pin on Map' on both fields for exact GPS radius matching, or search by city name."}
                </p>

                <button
                    type="submit"
                    disabled={
                        loading ||
                        !routeData.current_location.trim() ||
                        !routeData.return_destination.trim()
                    }
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Search size={18} />
                    {loading ? "Finding Loads..." : "Find Matching Loads"}
                </button>
            </form>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle size={19} className="mt-0.5 shrink-0" />
                    {error}
                </div>
            )}
        </div>
    );
}