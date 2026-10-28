import { Truck, ShieldCheck, MapPinned, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import heroIllustration from "../hero/Heroillustration.png";

export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">

      <div className="max-w-7xl mx-auto min-h-screen grid lg:grid-cols-2">

        {/* ================= LEFT ================= */}

        <div className="hidden lg:flex flex-col justify-center px-14 relative overflow-hidden">

          {/* Background Glow */}

          <div className="absolute -top-32 -left-24 w-72 h-72 rounded-full bg-blue-200/30 blur-3xl" />

          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-cyan-200/30 blur-3xl" />

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-3 mb-10"
          >

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">

              <Truck
                className="text-white"
                size={28}
              />

            </div>

            <div>

              <h1 className="text-3xl font-black text-slate-900">

                LoadIn

              </h1>

              <p className="text-sm text-slate-500">

                Never Return Empty

              </p>

            </div>

          </Link>

          {/* Heading */}

          <span className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">

            <Sparkles size={16} />

            India's Smart Logistics Platform

          </span>

          <h2 className="mt-8 text-5xl font-black leading-tight text-slate-900">

            Join the Future of

            <span className="block text-blue-600">

              Smart Logistics.

            </span>

          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600 max-w-lg">

            Whether you're a truck driver looking for return
            loads or a customer searching for reliable transport,
            LoadIn connects both seamlessly.

          </p>

          {/* Features */}

          <div className="mt-10 space-y-5">

            <div className="flex items-center gap-3">

              <ShieldCheck className="text-green-500" />

              <span className="text-slate-700">

                Verified Drivers & Customers

              </span>

            </div>

            <div className="flex items-center gap-3">

              <MapPinned className="text-blue-500" />

              <span className="text-slate-700">

                AI Powered Route Matching

              </span>

            </div>

            <div className="flex items-center gap-3">

              <Truck className="text-orange-500" />

              <span className="text-slate-700">

                Earn More on Every Trip

              </span>

            </div>

          </div>

          {/* Illustration */}

          <div className="mt-14">

            <img
              src={heroIllustration}
              alt="LoadIn"
              draggable={false}
              className="w-full max-w-xl mx-auto select-none"
            />

          </div>

        </div>

        {/* ================= RIGHT ================= */}

        <div className="flex items-center justify-center px-6 py-16">

          <div className="w-full max-w-md">

            <h2 className="text-4xl font-black text-slate-900">

              {title}

            </h2>

            <p className="mt-3 text-slate-500">

              {subtitle}

            </p>

            <div className="mt-10">

              {children}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}