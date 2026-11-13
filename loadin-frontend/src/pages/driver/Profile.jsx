import { useCallback, useEffect, useState } from "react";
import {
    User,
    Truck,
    FileCheck2,
    ShieldCheck,
    Clock,
    XCircle,
    AlertCircle,
    CheckCircle2,
    Edit3,
    Save,
    X,
    Calendar,
    MapPin,
    CreditCard,
    Hash,
} from "lucide-react";
import {
    getDriverProfile,
    createDriverProfile,
    updateDriverProfile,
} from "../../services/driverService";

const VEHICLE_TYPES = [
    "Mini Truck (Tata Ace)",
    "Pickup (Bolero / Dost)",
    "14ft Truck",
    "17ft Truck",
    "19ft Truck",
    "Truck",
    "20ft Container",
    "32ft Container",
    "Trailer",
];

const INITIAL_FORM = {
    date_of_birth: "",
    address: "",
    license_number: "",
    license_expiry_date: "",
    vehicle_number: "",
    vehicle_type: "",
};

function VerificationBadge({ status }) {
    const config = {
        VERIFIED: {
            label: "Verified Driver",
            classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
            icon: ShieldCheck,
        },
        PENDING: {
            label: "Verification Pending",
            classes: "border-amber-200 bg-amber-50 text-amber-700",
            icon: Clock,
        },
        REJECTED: {
            label: "Verification Rejected",
            classes: "border-red-200 bg-red-50 text-red-700",
            icon: XCircle,
        },
    };

    const current = config[status] || config.PENDING;
    const Icon = current.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${current.classes}`}
        >
            <Icon size={15} />
            {current.label}
        </span>
    );
}

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [hasProfile, setHasProfile] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState(INITIAL_FORM);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getDriverProfile();
            setProfile(data);
            setHasProfile(true);
            setIsEditing(false);
            setFormData({
                date_of_birth: data.date_of_birth || "",
                address: data.address || "",
                license_number: data.license_number || "",
                license_expiry_date: data.license_expiry_date || "",
                vehicle_number: data.vehicle_number || "",
                vehicle_type: data.vehicle_type || "",
            });
        } catch (err) {
            if (err.response?.status === 404) {
                // Profile hasn't been created yet -> open onboarding creation form
                setHasProfile(false);
                setIsEditing(true);
                setFormData(INITIAL_FORM);
            } else {
                console.error("Failed to fetch driver profile:", err);
                setError(
                    err.response?.data?.detail ||
                        "Unable to load your profile. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "vehicle_number" || name === "license_number"
                    ? value.toUpperCase()
                    : value,
        }));

        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleCancelEdit = () => {
        if (!profile) return;
        setFieldErrors({});
        setError("");
        setFormData({
            date_of_birth: profile.date_of_birth || "",
            address: profile.address || "",
            license_number: profile.license_number || "",
            license_expiry_date: profile.license_expiry_date || "",
            vehicle_number: profile.vehicle_number || "",
            vehicle_type: profile.vehicle_type || "",
        });
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccessMsg("");
        setFieldErrors({});

        try {
            const savedData = hasProfile
                ? await updateDriverProfile(formData)
                : await createDriverProfile(formData);

            setProfile(savedData);
            setHasProfile(true);
            setIsEditing(false);
            setSuccessMsg(
                hasProfile
                    ? "Driver profile updated successfully."
                    : "Driver profile created! Your details are now pending admin verification."
            );
        } catch (err) {
            console.error("Failed to save driver profile:", err);
            const respData = err.response?.data;

            if (respData && typeof respData === "object") {
                if (respData.detail) {
                    setError(respData.detail);
                } else {
                    setFieldErrors(respData);
                    setError("Please fix the highlighted fields below.");
                }
            } else {
                setError("Failed to save profile. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "Not provided";
        return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const renderFieldError = (name) => {
        const err = fieldErrors[name];
        if (!err) return null;
        return (
            <p className="mt-1.5 text-xs font-medium text-red-600">
                {Array.isArray(err) ? err[0] : err}
            </p>
        );
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-blue-600">
                        DRIVER ACCOUNT
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Driver Profile
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Manage your personal details, driving license, and vehicle
                        information.
                    </p>
                </div>

                {!loading && hasProfile && !isEditing && (
                    <button
                        onClick={() => {
                            setSuccessMsg("");
                            setIsEditing(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Edit3 size={16} />
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                    <p className="mt-4 text-sm font-medium text-slate-600">
                        Loading your profile...
                    </p>
                </div>
            )}

            {/* Alerts */}
            {!loading && successMsg && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                    <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                    <span>{successMsg}</span>
                </div>
            )}

            {!loading && error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    <AlertCircle size={18} className="shrink-0 text-red-500" />
                    <span>{error}</span>
                </div>
            )}

            {/* Onboarding Banner when profile is not created yet */}
            {!loading && !hasProfile && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5">
                    <h2 className="text-base font-semibold text-blue-900">
                        Complete Your Driver Profile
                    </h2>
                    <p className="mt-1 text-sm text-blue-700">
                        You need to submit your driving license and vehicle details
                        for verification before accepting shipments.
                    </p>
                </div>
            )}

            {/* Profile Summary Card (when profile exists) */}
            {!loading && hasProfile && profile && (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <User size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {profile.first_name || profile.last_name
                                    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
                                    : "Driver"}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {profile.email}
                                {profile.phone_number ? ` • ${profile.phone_number}` : ""}
                            </p>
                        </div>
                    </div>

                    <VerificationBadge status={profile.verification_status} />
                </div>
            )}

            {/* VIEW MODE */}
            {!loading && hasProfile && !isEditing && profile && (
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Personal & License Details */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-2.5 text-slate-900">
                            <FileCheck2 size={20} className="text-blue-600" />
                            <h3 className="text-lg font-bold">
                                Personal & License Details
                            </h3>
                        </div>

                        <div className="my-4 border-t border-slate-100" />

                        <dl className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar size={18} className="mt-0.5 text-slate-400" />
                                <div>
                                    <dt className="text-xs text-slate-400">Date of Birth</dt>
                                    <dd className="mt-0.5 font-medium text-slate-800">
                                        {formatDate(profile.date_of_birth)}
                                    </dd>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CreditCard size={18} className="mt-0.5 text-slate-400" />
                                <div>
                                    <dt className="text-xs text-slate-400">
                                        Driving License Number
                                    </dt>
                                    <dd className="mt-0.5 font-mono font-semibold text-slate-800">
                                        {profile.license_number}
                                    </dd>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar size={18} className="mt-0.5 text-slate-400" />
                                <div>
                                    <dt className="text-xs text-slate-400">
                                        License Expiry Date
                                    </dt>
                                    <dd className="mt-0.5 font-medium text-slate-800">
                                        {formatDate(profile.license_expiry_date)}
                                    </dd>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="mt-0.5 text-slate-400" />
                                <div>
                                    <dt className="text-xs text-slate-400">Address</dt>
                                    <dd className="mt-0.5 font-medium text-slate-800">
                                        {profile.address}
                                    </dd>
                                </div>
                            </div>
                        </dl>
                    </section>

                    {/* Vehicle Details */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-2.5 text-slate-900">
                            <Truck size={20} className="text-blue-600" />
                            <h3 className="text-lg font-bold">Vehicle Information</h3>
                        </div>

                        <div className="my-4 border-t border-slate-100" />

                        <dl className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Hash size={18} className="mt-0.5 text-slate-400" />
                                <div>
                                    <dt className="text-xs text-slate-400">
                                        Vehicle Registration Number
                                    </dt>
                                    <dd className="mt-0.5 font-mono text-base font-bold text-slate-800">
                                        {profile.vehicle_number}
                                    </dd>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Truck size={18} className="mt-0.5 text-slate-400" />
                                <div>
                                    <dt className="text-xs text-slate-400">Vehicle Type</dt>
                                    <dd className="mt-0.5 font-medium text-slate-800">
                                        {profile.vehicle_type}
                                    </dd>
                                </div>
                            </div>
                        </dl>
                    </section>
                </div>
            )}

            {/* CREATE / EDIT FORM MODE */}
            {!loading && isEditing && (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                >
                    <div className="grid gap-6 sm:grid-cols-2">
                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                Date of Birth *
                            </label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                required
                                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            />
                            {renderFieldError("date_of_birth")}
                        </div>

                        {/* License Number */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                Driving License Number *
                            </label>
                            <input
                                type="text"
                                name="license_number"
                                value={formData.license_number}
                                onChange={handleChange}
                                placeholder="e.g., KA0120200012345"
                                required
                                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            />
                            {renderFieldError("license_number")}
                        </div>

                        {/* License Expiry Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                License Expiry Date *
                            </label>
                            <input
                                type="date"
                                name="license_expiry_date"
                                value={formData.license_expiry_date}
                                onChange={handleChange}
                                required
                                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            />
                            {renderFieldError("license_expiry_date")}
                        </div>

                        {/* Vehicle Number */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                Vehicle Registration Number *
                            </label>
                            <input
                                type="text"
                                name="vehicle_number"
                                value={formData.vehicle_number}
                                onChange={handleChange}
                                placeholder="e.g., KA01AB1234"
                                required
                                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            />
                            {renderFieldError("vehicle_number")}
                        </div>

                        {/* Vehicle Type */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Vehicle Type *
                            </label>
                            <select
                                name="vehicle_type"
                                value={formData.vehicle_type}
                                onChange={handleChange}
                                required
                                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            >
                                <option value="">Select your vehicle type</option>
                                {VEHICLE_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            {renderFieldError("vehicle_type")}
                        </div>

                        {/* Address */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Permanent / Current Address *
                            </label>
                            <textarea
                                name="address"
                                rows={3}
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your full residential or transport hub address"
                                required
                                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            />
                            {renderFieldError("address")}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
                        {hasProfile && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={16} />
                            {saving
                                ? "Saving..."
                                : hasProfile
                                    ? "Save Changes"
                                    : "Create Profile"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}