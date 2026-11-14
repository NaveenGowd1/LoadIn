import { Package, Clock, UserRound, X } from "lucide-react";

const formatStatus = (status) =>
    status
        ?.replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase()) || "Unknown";

const driverName = (driver) =>
    [driver?.first_name, driver?.last_name].filter(Boolean).join(" ") ||
    "Not provided";

export default function LoadDetailsModal({
    load,
    history,
    historyLoading,
    onClose,
    onCancel,
}) {
    if (!load) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="shipment-modal-title"
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h2
                            id="shipment-modal-title"
                            className="text-2xl font-bold text-slate-900"
                        >
                            Shipment Details
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Shipment #{load.id}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        aria-label="Close shipment details"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Load Information */}
                <section className="mb-6">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800">
                        <Package size={20} className="text-blue-600" />
                        Load Information
                    </h3>

                    <div className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                        <Detail label="Pickup Location" value={load.pickup_location} />
                        <Detail label="Delivery Location" value={load.delivery_location} />
                        <Detail label="Goods Description" value={load.goods_description} />
                        <Detail label="Weight" value={`${load.weight ?? "—"} kg`} />
                        <Detail label="Vehicle Type" value={load.vehicle_type} />
                        <Detail label="Price" value={`₹${load.price ?? "—"}`} />
                        <Detail label="Pickup Date" value={load.pickup_date} />
                        <Detail label="Delivery Date" value={load.delivery_date} />
                        <Detail label="Current Status" value={formatStatus(load.status)} />
                        <Detail
                            label="Created At"
                            value={
                                load.created_at
                                    ? new Date(load.created_at).toLocaleString()
                                    : "Not available"
                            }
                        />
                    </div>
                </section>

                {/* Load History Timeline */}
                <section className="mb-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
                        <Clock size={20} className="text-blue-600" />
                        Load History
                    </h3>

                    {historyLoading ? (
                        <p className="py-4 text-sm text-slate-500">
                            Loading shipment history...
                        </p>
                    ) : history.length === 0 ? (
                        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                            No history records are available for this shipment yet.
                        </p>
                    ) : (
                        <div className="ml-2 border-l-2 border-blue-200 pl-5">
                            {history.map((item, index) => (
                                <div
                                    key={`${item.status}-${item.changed_at}-${index}`}
                                    className="relative pb-6 last:pb-0"
                                >
                                    <span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 ring-2 ring-blue-100" />

                                    <p className="font-semibold text-slate-800">
                                        {formatStatus(item.status)}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {item.changed_at
                                            ? new Date(item.changed_at).toLocaleString()
                                            : "Time unavailable"}
                                    </p>

                                    {item.changed_by_email && (
                                        <p className="mt-1 text-xs text-slate-400">
                                            Updated by {item.changed_by_email}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Driver Information */}
                <section>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800">
                        <UserRound size={20} className="text-blue-600" />
                        Driver Information
                    </h3>

                    {load.driver ? (
                        <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-2">
                            <Detail label="Driver Name" value={driverName(load.driver)} />
                            <Detail label="Email" value={load.driver.email} />
                            <Detail label="Phone Number" value={load.driver.phone_number} />
                            <Detail label="Vehicle Number" value={load.driver.vehicle_number} />
                            <Detail label="Vehicle Type" value={load.driver.vehicle_type} />
                        </div>
                    ) : (
                        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                            No driver has been assigned to this shipment yet.
                        </div>
                    )}
                </section>

                {/* Modal Footer */}
                <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
                    {load.status === "AVAILABLE" && onCancel && (
                        <button
                            type="button"
                            onClick={() => onCancel(load)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-5 py-2.5 font-medium text-red-600 transition hover:bg-red-50"
                        >
                            <X size={17} />
                            Cancel Shipment
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white transition hover:bg-slate-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div className="min-w-0">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 break-words font-medium text-slate-900">
                {value ?? "Not provided"}
            </p>
        </div>
    );
}