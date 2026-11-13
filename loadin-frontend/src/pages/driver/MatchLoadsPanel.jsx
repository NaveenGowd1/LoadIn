
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MapPin,
    Search,
    ArrowLeft,
    PackageSearch,
    Truck,
    Weight,
    CalendarDays,
    IndianRupee,
    AlertCircle,
} from "lucide-react";

import { matchLoads } from "../../services/loadService";



export default function MatchLoadsPanel({ onBack }) {
    const [currentLocation, setCurrentLocation] = useState("");
    const [returnDestination, setReturnDestination] = useState("");

    const [matches, setMatches] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSearch = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");
        setMatches([]);
        setHasSearched(false);

        try {
            const response = await matchLoads({
                current_location: currentLocation.trim(),
                return_destination: returnDestination.trim(),
            });

            const results = Array.isArray(response.results)
                ? response.results
                : [];

            navigate("/driver/matched-loads", {
                state: {
                    matches: results,
                    currentLocation,
                    returnDestination,
                },
            });

        } catch (err) {
            console.error("Load matching failed:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to find matching loads. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">

            <button
                type="button"
                onClick={onBack}
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
                    Tell us where you are and where you're heading.
                    We'll find available shipments matching your return journey.
                </p>
            </div>

            {/* Location Form */}
            <form
                onSubmit={handleSearch}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
                <div className="grid gap-6 md:grid-cols-2">

                    <div>
                        <label
                            htmlFor="currentLocation"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Your Current Location
                        </label>

                        <div className="relative">
                            <MapPin
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="currentLocation"
                                type="text"
                                required
                                maxLength={255}
                                value={currentLocation}
                                onChange={(e) => setCurrentLocation(e.target.value)}
                                placeholder="e.g. Hyderabad"
                                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="returnDestination"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Your Return Destination
                        </label>

                        <div className="relative">
                            <MapPin
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="returnDestination"
                                type="text"
                                required
                                maxLength={255}
                                value={returnDestination}
                                onChange={(e) => setReturnDestination(e.target.value)}
                                placeholder="e.g. Vijayawada"
                                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                </div>

                <p className="mt-4 text-xs text-slate-400">
                    Location matching currently uses case-insensitive partial text matching.
                </p>

                <button
                    type="submit"
                    disabled={loading || !currentLocation.trim() || !returnDestination.trim()}
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

            {/* Search Results */}
            {hasSearched && !error && (
                <section className="space-y-5">

                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Matching Shipments
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {matches.length} matching {matches.length === 1 ? "shipment" : "shipments"} found.
                            Results are sorted by highest price first.
                        </p>
                    </div>

                    {matches.length > 0 ? (
                        <div className="grid gap-5">
                            {matches.map((load) => (
                                <MatchedLoadCard
                                    key={load.id}
                                    load={load}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
                            <PackageSearch
                                size={36}
                                className="mx-auto text-slate-400"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                No matching shipments found
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Try a different current location or return destination.
                            </p>
                        </div>
                    )}

                </section>
            )}

        </div>
    );
}
