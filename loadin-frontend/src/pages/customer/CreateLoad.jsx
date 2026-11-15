import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { editLoad } from "../../services/loadService";
import LocationPickerField from "../../components/maps/LocationPickerField";

const initialForm = {
    pickup_location: "",
    pickup_latitude: null,
    pickup_longitude: null,
    delivery_location: "",
    delivery_latitude: null,
    delivery_longitude: null,
    goods_description: "",
    weight: "",
    vehicle_type: "",
    pickup_date: "",
    delivery_date: "",
    price: "",
};

const mapLoadToForm = (load) => ({
    pickup_location: load.pickup_location || "",
    pickup_latitude: load.pickup_latitude ?? null,
    pickup_longitude: load.pickup_longitude ?? null,
    delivery_location: load.delivery_location || "",
    delivery_latitude: load.delivery_latitude ?? null,
    delivery_longitude: load.delivery_longitude ?? null,
    goods_description: load.goods_description || "",
    weight: load.weight ?? "",
    vehicle_type: load.vehicle_type || "",
    pickup_date: load.pickup_date || "",
    delivery_date: load.delivery_date || "",
    price: load.price ?? "",
});

export default function CreateLoad() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const isEditMode = Boolean(id);
    const passedLoad = location.state?.load;

    const [formData, setFormData] = useState(() =>
        passedLoad ? mapLoadToForm(passedLoad) : initialForm
    );
    const [loading, setLoading] = useState(false);
    const [fetchingLoad, setFetchingLoad] = useState(isEditMode && !passedLoad);

    useEffect(() => {
        if (!isEditMode || passedLoad) return;

        const fetchExistingLoad = async () => {
            setFetchingLoad(true);
            try {
                const response = await api.get(`/loads/${id}/`);
                const load = response.data;

                if (load.status !== "AVAILABLE") {
                    toast.error("Only AVAILABLE shipments can be edited.");
                    navigate("/customer/active-loads");
                    return;
                }

                setFormData(mapLoadToForm(load));
            } catch (err) {
                toast.error(
                    err.response?.data?.detail || "Unable to load shipment details."
                );
                navigate("/customer/active-loads");
            } finally {
                setFetchingLoad(false);
            }
        };

        fetchExistingLoad();
    }, [id, isEditMode, passedLoad, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            weight: Number(formData.weight),
            price: Number(formData.price),
        };

        try {
            if (isEditMode) {
                await editLoad(id, payload);
                toast.success(`Shipment #${id} updated successfully!`);
                navigate("/customer/active-loads");
            } else {
                await api.post("/loads/create/", payload);
                toast.success("Load created successfully!");
                setFormData(initialForm);
                navigate("/customer/dashboard");
            }
        } catch (error) {
            const data = error.response?.data;

            if (data?.detail) {
                toast.error(data.detail);
                if (error.response?.status === 409) {
                    navigate("/customer/active-loads");
                }
            } else if (data && typeof data === "object") {
                const messages = Object.entries(data).map(([field, value]) => {
                    const detail = Array.isArray(value)
                        ? value.join(", ")
                        : typeof value === "string"
                          ? value
                          : JSON.stringify(value);

                    return `${field}: ${detail}`;
                });

                toast.error(messages.join(" | "));
            } else {
                toast.error(
                    isEditMode
                        ? "Unable to update shipment. Please try again."
                        : "Unable to create load. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetchingLoad) {
        return (
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white py-20 text-center text-slate-500">
                Loading shipment details...
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            <button
                type="button"
                onClick={() =>
                    navigate(
                        isEditMode ? "/customer/active-loads" : "/customer/dashboard"
                    )
                }
                className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
                ← {isEditMode ? "Back to Active Loads" : "Back to Dashboard"}
            </button>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h1 className="text-2xl font-bold text-slate-900">
                    {isEditMode ? `Edit Shipment #${id}` : "Create a Shipment"}
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    {isEditMode
                        ? "Update route pins, dates, weight, or offered price before a driver accepts."
                        : "Pin your exact pickup and delivery locations so drivers can match and navigate to your route."}
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <LocationPickerField
                        label="Exact Pickup Location"
                        placeholder="Search pickup warehouse/address or pin on map"
                        value={formData.pickup_location}
                        latitude={formData.pickup_latitude}
                        longitude={formData.pickup_longitude}
                        onSelectLocation={({ address, latitude, longitude }) =>
                            setFormData((prev) => ({
                                ...prev,
                                pickup_location: address,
                                pickup_latitude: latitude,
                                pickup_longitude: longitude,
                            }))
                        }
                    />

                    <LocationPickerField
                        label="Exact Delivery Location"
                        placeholder="Search drop-off destination or pin on map"
                        value={formData.delivery_location}
                        latitude={formData.delivery_latitude}
                        longitude={formData.delivery_longitude}
                        onSelectLocation={({ address, latitude, longitude }) =>
                            setFormData((prev) => ({
                                ...prev,
                                delivery_location: address,
                                delivery_latitude: latitude,
                                delivery_longitude: longitude,
                            }))
                        }
                    />

                    <div>
                        <label
                            htmlFor="goods_description"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Goods Description
                        </label>
                        <textarea
                            id="goods_description"
                            name="goods_description"
                            value={formData.goods_description}
                            onChange={handleChange}
                            placeholder="Describe the goods being transported"
                            required
                            rows={3}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="weight"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Weight (kg)
                            </label>
                            <input
                                id="weight"
                                name="weight"
                                type="number"
                                value={formData.weight}
                                onChange={handleChange}
                                min="0.01"
                                step="0.01"
                                required
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="vehicle_type"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Vehicle Type
                            </label>
                            <select
                                id="vehicle_type"
                                name="vehicle_type"
                                value={formData.vehicle_type}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                            >
                                <option value="">Select vehicle</option>
                                <option value="Truck">Truck</option>
                                <option value="Mini Truck">Mini Truck</option>
                                <option value="Pickup">Pickup</option>
                                <option value="Container">Container</option>
                                <option value="Tempo">Tempo</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="pickup_date"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Pickup Date
                            </label>
                            <input
                                id="pickup_date"
                                name="pickup_date"
                                type="date"
                                value={formData.pickup_date}
                                onChange={handleChange}
                                min={
                                    isEditMode
                                        ? undefined
                                        : new Date().toLocaleDateString("en-CA")
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="delivery_date"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Delivery Date
                            </label>
                            <input
                                id="delivery_date"
                                name="delivery_date"
                                type="date"
                                value={formData.delivery_date}
                                onChange={handleChange}
                                min={
                                    formData.pickup_date ||
                                    new Date().toLocaleDateString("en-CA")
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="price"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Offered Price (₹)
                        </label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            min="0.01"
                            step="0.01"
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? isEditMode
                                ? "Saving Changes..."
                                : "Creating Shipment..."
                            : isEditMode
                              ? "Save Changes"
                              : "Create Shipment"}
                    </button>
                </form>
            </div>
        </div>
    );
}