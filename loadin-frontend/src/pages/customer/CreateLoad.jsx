
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"
import api from "../../services/api";

const initialForm = {
    pickup_location: "",
    delivery_location: "",
    goods_description: "",
    weight: "",
    vehicle_type: "",
    pickup_date: "",
    delivery_date: "",
    price: "",
};

export default function CreateLoad() {
    const [formData, setFormData] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

        try {
            await api.post("/loads/create/", {
                ...formData,
                weight: Number(formData.weight),
                price: Number(formData.price),
            });

            toast.success("Load created successfully!");
            setFormData(initialForm);
            navigate("/customer/dashboard");
        } catch (error) {
            const data = error.response?.data;

            if (data && typeof data === "object") {
                const messages = Object.entries(data)
                    .map(([field, value]) => {
                        const detail = Array.isArray(value)
                            ? value.join(", ")
                            : typeof value === "string"
                                ? value
                                : JSON.stringify(value);

                        return `${field}: ${detail}`;
                    });

                toast.error(messages.join(" | "));
            } else {
                toast.error("Unable to create load. Please try again.");
            }

            console.error("Create load error:", data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-2xl">
                <button
                    type="button"
                    onClick={() => navigate("/customer/dashboard")}
                    className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                    ← Back to Dashboard
                </button>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Create a Shipment
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Enter your shipment details to find a suitable driver.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="pickup_location" className="mb-2 block text-sm font-medium">
                                    Pickup Location
                                </label>
                                <input
                                    id="pickup_location"
                                    name="pickup_location"
                                    value={formData.pickup_location}
                                    onChange={handleChange}
                                    placeholder="e.g. Hyderabad"
                                    maxLength={255}
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="delivery_location" className="mb-2 block text-sm font-medium">
                                    Delivery Location
                                </label>
                                <input
                                    id="delivery_location"
                                    name="delivery_location"
                                    value={formData.delivery_location}
                                    onChange={handleChange}
                                    placeholder="e.g. Bengaluru"
                                    maxLength={255}
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="goods_description" className="mb-2 block text-sm font-medium">
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
                                <label htmlFor="weight" className="mb-2 block text-sm font-medium">
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
                                <label htmlFor="vehicle_type" className="mb-2 block text-sm font-medium">
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
                                <label htmlFor="pickup_date" className="mb-2 block text-sm font-medium">
                                    Pickup Date
                                </label>
                                <input
                                    id="pickup_date"
                                    name="pickup_date"
                                    type="date"
                                    value={formData.pickup_date}
                                    onChange={handleChange}
                                    min={new Date().toLocaleDateString("en-CA")}
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="delivery_date" className="mb-2 block text-sm font-medium">
                                    Delivery Date
                                </label>
                                <input
                                    id="delivery_date"
                                    name="delivery_date"
                                    type="date"
                                    value={formData.delivery_date}
                                    onChange={handleChange}
                                    min={formData.pickup_date || new Date().toLocaleDateString("en-CA")}
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="price" className="mb-2 block text-sm font-medium">
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
                            {loading ? "Creating Shipment..." : "Create Shipment"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
