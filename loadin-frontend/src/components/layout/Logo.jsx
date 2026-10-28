import { Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">

      <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">

        <Truck className="text-white" size={24} />

      </div>

      <div>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          LoadIn
        </h1>

        <p className="text-xs text-slate-500 -mt-1">
          Never Return Empty
        </p>

      </div>

    </Link>
  );
}