import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { MapPin, Search, Crosshair, Check } from "lucide-react";
import toast from "react-hot-toast";

// Fix default marker icon path issue in Vite production builds
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Default center: Bengaluru / South India
const DEFAULT_CENTER = [12.9716, 77.5946];

function RecenterMap({ center }) {
    const map = useMap();
    map.setView(center, map.getZoom() < 13 ? 14 : map.getZoom());
    return null;
}

function ClickHandler({ onPickCoords }) {
    useMapEvents({
        click(e) {
            onPickCoords(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function LocationPickerField({
    label,
    placeholder = "Search address or pick on map...",
    value,
    latitude,
    longitude,
    onSelectLocation,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState(value || "");
    const [suggestions, setSuggestions] = useState([]);
    const [searching, setSearching] = useState(false);

    const hasCoords = typeof latitude === "number" && typeof longitude === "number";
    const position = hasCoords ? [latitude, longitude] : DEFAULT_CENTER;

    const searchAddress = async () => {
        const query = searchText.trim();
        if (!query) return;
        setSearching(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=5&q=${encodeURIComponent(query)}`
            );
            const results = await res.json();
            setSuggestions(results);
            if (results.length === 0) {
                toast.error("No matching places found. Try a nearby landmark or click the map.");
            }
        } catch {
            toast.error("Location search failed. You can still click directly on the map.");
        } finally {
            setSearching(false);
        }
    };

    const reverseGeocode = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();
            const address =
                data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            setSearchText(address);
            onSelectLocation({
                address,
                latitude: Number(lat.toFixed(6)),
                longitude: Number(lng.toFixed(6)),
            });
        } catch {
            const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            setSearchText(fallback);
            onSelectLocation({
                address: fallback,
                latitude: Number(lat.toFixed(6)),
                longitude: Number(lng.toFixed(6)),
            });
        }
    };

    const handleSelectSuggestion = (item) => {
        const lat = Number(parseFloat(item.lat).toFixed(6));
        const lng = Number(parseFloat(item.lon).toFixed(6));
        setSearchText(item.display_name);
        setSuggestions([]);
        onSelectLocation({
            address: item.display_name,
            latitude: lat,
            longitude: lng,
        });
    };

    const handleUseCurrentGPS = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                reverseGeocode(pos.coords.latitude, pos.coords.longitude);
            },
            () => {
                toast.error("Unable to access GPS. Please allow location permission or click on the map.");
            },
            { enableHighAccuracy: true }
        );
    };

    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>

            {/* Summary Trigger Box */}
            <div className="flex flex-col gap-2 sm:flex-row">
                <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                        onSelectLocation({
                            address: e.target.value,
                            latitude,
                            longitude,
                        })
                    }
                    placeholder={placeholder}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />

                <button
                    type="button"
                    onClick={() => {
                        setSearchText(value || "");
                        setIsOpen((prev) => !prev);
                    }}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                >
                    <MapPin size={16} />
                    {isOpen ? "Hide Map" : hasCoords ? "Change Pin" : "Pin on Map"}
                </button>
            </div>

            {hasCoords && (
                <p className="mt-1.5 text-xs text-emerald-700">
                    Exact pin locked: {latitude.toFixed(5)}, {longitude.toFixed(5)}
                </p>
            )}

            {/* Collapsible Interactive Map Picker */}
            {isOpen && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
                    <div className="mb-2.5 flex flex-wrap gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        searchAddress();
                                    }
                                }}
                                placeholder="Type area, warehouse, or landmark..."
                                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-9 text-sm outline-none focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={searchAddress}
                                disabled={searching}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
                                aria-label="Search address"
                            >
                                <Search size={16} />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleUseCurrentGPS}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                            <Crosshair size={15} className="text-blue-600" />
                            Use GPS
                        </button>
                    </div>

                    {/* Search Results Dropdown */}
                    {suggestions.length > 0 && (
                        <ul className="mb-2.5 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white text-xs">
                            {suggestions.map((item) => (
                                <li key={item.place_id}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectSuggestion(item)}
                                        className="w-full px-3 py-2 text-left text-slate-700 hover:bg-blue-50"
                                    >
                                        {item.display_name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Leaflet Map */}
                    <div className="h-64 w-full overflow-hidden rounded-lg border border-slate-300">
                        <MapContainer
                            center={position}
                            zoom={hasCoords ? 15 : 6}
                            className="h-full w-full"
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <RecenterMap center={position} />
                            <ClickHandler onPickCoords={reverseGeocode} />
                            {hasCoords && (
                                <Marker
                                    position={position}
                                    draggable
                                    eventHandlers={{
                                        dragend: (e) => {
                                            const { lat, lng } = e.target.getLatLng();
                                            reverseGeocode(lat, lng);
                                        },
                                    }}
                                />
                            )}
                        </MapContainer>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                        <span>Click anywhere on the map or drag the pin to adjust.</span>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-700"
                        >
                            <Check size={14} />
                            Confirm Location
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}