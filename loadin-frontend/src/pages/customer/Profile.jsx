import { useEffect, useState } from "react";
import { UserRound, Mail, Phone, ShieldCheck, Calendar, Save } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function CustomerProfile() {
    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        role: "CUSTOMER",
        date_joined: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/accounts/customer/profile/");
                setProfile(response.data);
            } catch (err) {
                const cached = JSON.parse(localStorage.getItem("user") || "{}");
                setProfile((prev) => ({ ...prev, ...cached }));
                toast.error(
                    err.response?.data?.detail || "Could not refresh profile from server."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);

        try {
            const response = await api.patch("/accounts/customer/profile/", {
                first_name: profile.first_name,
                last_name: profile.last_name,
                phone_number: profile.phone_number,
            });

            setProfile(response.data);

            const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...existingUser,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    phone_number: response.data.phone_number,
                })
            );

            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error(
                err.response?.data?.detail || "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-slate-500">
                Loading your profile...
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                    Customer Profile
                </h2>
                <p className="mt-1 text-slate-500">
                    Manage your contact information for drivers and shipment updates.
                </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Account Header Banner */}
                <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/70 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
                            <UserRound size={28} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                {[profile.first_name, profile.last_name]
                                    .filter(Boolean)
                                    .join(" ") || "Customer Account"}
                            </h3>
                            <p className="flex items-center gap-1.5 text-sm text-slate-500">
                                <Mail size={14} />
                                {profile.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                            <ShieldCheck size={14} />
                            {profile.role}
                        </span>
                        {profile.date_joined && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200/70 px-3 py-1 text-slate-700">
                                <Calendar size={14} />
                                Joined{" "}
                                {new Date(profile.date_joined).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Editable Form */}
                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="first_name"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                First Name
                            </label>
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                value={profile.first_name || ""}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="last_name"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Last Name
                            </label>
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                value={profile.last_name || ""}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="phone_number"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone
                                    size={16}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    maxLength={15}
                                    value={profile.phone_number || ""}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={profile.email || ""}
                                disabled
                                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            <Save size={17} />
                            {saving ? "Saving Changes..." : "Save Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}