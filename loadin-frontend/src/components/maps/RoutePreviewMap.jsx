import { useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import { Navigation, Route } from "lucide-react";

const createPinIcon = (bgColor) =>
    L.divIcon({
        className: "",
        html: `<div style="
            width: 24px;
            height: 24px;
            background: ${bgColor};
            border: 3px solid #ffffff;
            border-radius: 9999px;
            box-shadow: 0 2px 6px rgba(15, 23, 42, 0.35);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });

const pickupIcon = createPinIcon("#16a34a"); // Green for Pickup
const deliveryIcon = createPinIcon("#dc2626"); // Red for Drop-off

function FitRouteBounds({ pickup, delivery }) {
    const map = useMap();

    useEffect(() => {
        const bounds = L.latLngBounds([pickup, delivery]);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }, [map, pickup, delivery]);

    return null;
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function RoutePreviewMap({ load, heightClass = "h-56" }) {
    const hasPickupCoords =
        typeof load?.pickup_latitude === "number" &&
        typeof load?.pickup_longitude === "number";
    const hasDeliveryCoords =
        typeof load?.delivery_latitude === "number" &&
        typeof load?.delivery_longitude === "number";

    if (!hasPickupCoords || !hasDeliveryCoords) {
        return null;
    }

    const pickup = [load.pickup_latitude, load.pickup_longitude];
    const delivery = [load.delivery_latitude, load.delivery_longitude];
    const distanceKm = calculateDistanceKm(
        load.pickup_latitude,
        load.pickup_longitude,
        load.delivery_latitude,
        load.delivery_longitude
    );

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${load.pickup_latitude},${load.pickup_longitude}&destination=${load.delivery_latitude},${load.delivery_longitude}&travelmode=driving`;

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* Top Bar: Legend, Distance & 1-Tap Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
                    <span className="inline-flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                        Pickup
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                        Drop-off
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-slate-600 shadow-xs">
                        <Route size={13} className="text-blue-600" />~
                        {distanceKm.toFixed(1)} km direct
                    </span>
                </div>

                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                    <Navigation size={13} />
                    Open in Google Maps
                </a>
            </div>

            {/* Interactive Preview Map */}
            <div className={`relative z-0 ${heightClass} w-full`}>
                <MapContainer
                    center={pickup}
                    zoom={12}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FitRouteBounds pickup={pickup} delivery={delivery} />

                    <Marker position={pickup} icon={pickupIcon}>
                        <Popup>
                            <strong>Pickup:</strong> {load.pickup_location}
                        </Popup>
                    </Marker>

                    <Marker position={delivery} icon={deliveryIcon}>
                        <Popup>
                            <strong>Drop-off:</strong> {load.delivery_location}
                        </Popup>
                    </Marker>

                    <Polyline
                        positions={[pickup, delivery]}
                        pathOptions={{
                            color: "#2563eb",
                            weight: 3,
                            dashArray: "8, 8",
                        }}
                    />
                </MapContainer>
            </div>
        </div>
    );
}