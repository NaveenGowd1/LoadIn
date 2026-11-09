
import { useNavigate } from "react-router-dom";
import { PackageSearch, ArrowRight } from "lucide-react";

export default function MyLoads() {
    const navigate = useNavigate();

    return (
        <div className="space-y-8">

            <div>
                <p className="text-sm font-medium text-blue-600">
                    DRIVER WORKSPACE
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    My Loads
                </h1>

                <p className="mt-2 text-slate-500">
                    Manage your accepted shipments and ongoing deliveries.
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <PackageSearch size={32} />
                </div>

                <h2 className="mt-6 text-xl font-semibold text-slate-900">
                    No accepted loads
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    You don't have any active shipments right now.
                    Find loads that match your current location and return journey.
                </p>

                <button
                    onClick={() => {
                        // Matching interface will be implemented next.
                        console.log("Open matching loads");
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    Match Loads
                    <ArrowRight size={17} />
                </button>

            </div>

        </div>
    );
}
