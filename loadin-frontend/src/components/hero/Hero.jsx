import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  CheckCircle,
  Truck,
  Package,
} from "lucide-react";

import Button from "../ui/Button";

import heroIllustration from "./HeroIllustration.png";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100" >

      <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* ================= LEFT ================= */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            {/* Badge */}

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2">

              <Sparkles className="w-4 h-4 text-blue-600" />

              <span className="text-sm font-semibold text-blue-700">

                India's Smart Logistics Platform

              </span>

            </div>

            {/* Heading */}

            <h1 className="mt-8 text-5xl lg:text-7xl font-black leading-tight text-slate-900">

              Never Return

              <span className="block text-blue-600">

                Empty.

              </span>

            </h1>

            {/* Description */}

            <p className="mt-8 max-w-xl text-lg leading-9 text-slate-600">

              LoadIn connects truck drivers returning with empty
              vehicles to customers needing transportation.

              Reduce empty miles, save fuel and maximize earnings
              through AI-powered shipment matching.

            </p>

            {/* Buttons */}

            <div className="mt-10 flex flex-wrap gap-4">

              <Link to="/driver/register">

                <Button>

                  <Truck className="mr-2 h-5 w-5" />

                  Become Driver

                </Button>

              </Link>

              <Link to="/customer/register">

                <Button variant="outline">

                  <Package className="mr-2 h-5 w-5" />

                  Need Transport

                </Button>

              </Link>

            </div>

            {/* Features */}

            <div className="mt-10 grid sm:grid-cols-3 gap-5">

              <div className="flex items-center gap-2">

                <CheckCircle
                  className="text-green-500"
                  size={18}
                />

                <span className="text-sm text-slate-600">

                  AI Matching

                </span>

              </div>

              <div className="flex items-center gap-2">

                <CheckCircle
                  className="text-green-500"
                  size={18}
                />

                <span className="text-sm text-slate-600">

                  Verified Drivers

                </span>

              </div>

              <div className="flex items-center gap-2">

                <CheckCircle
                  className="text-green-500"
                  size={18}
                />

                <span className="text-sm text-slate-600">

                  Secure Payments

                </span>

              </div>

            </div>

          </motion.div>

          {/* ================= RIGHT ================= */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="flex justify-center"
          >

            <img
              src={heroIllustration}
              alt="LoadIn Logistics"
              draggable={false}
              className="
                w-full
                max-w-2xl
                select-none
                object-contain
              "
            />

          </motion.div>

        </div>

      </div>

    </section>
  );
}