import { motion } from "framer-motion";
import {
  Truck,
  Package,
  MapPin,
  BrainCircuit,
  Route,
Sparkles,
} from "lucide-react";

import FloatingCard from "./FloatingCard";

export default function HeroIllustration() {

  return (

    <div
      className="
      relative
      w-[520px]
      h-[500px]
      mx-auto
      pointer-events-none
      "
    >

      {/* ========================= */}
      {/* Background Glow */}
      {/* ========================= */}

      <div
        className="
        absolute
        inset-0
        flex
        items-center
        justify-center
        "
      >

        <div
          className="
          w-[420px]
          h-[420px]
          rounded-full
          bg-gradient-to-r
          from-blue-100
          via-cyan-100
          to-orange-100
          blur-3xl
          opacity-60
          "
        />

      </div>

      {/* ========================= */}
      {/* SVG Road */}
      {/* ========================= */}

      <svg
        viewBox="0 0 520 500"
        className="
        absolute
        inset-0
        w-full
        h-full
        "
      >

        <path

          d="

          M70 410

          C150 330

          220 290

          300 250

          S390 160

          450 100

          "

          stroke="#CBD5E1"

          strokeWidth="10"

          fill="none"

          strokeDasharray="16 16"

          strokeLinecap="round"

        />

        <motion.path

          d="

          M70 410

          C150 330

          220 290

          300 250

          S390 160

          450 100

          "

          stroke="#2563EB"

          strokeWidth="10"

          fill="none"

          strokeDasharray="16 16"

          strokeLinecap="round"

          initial={{
            pathLength:0
          }}

          animate={{
            pathLength:1
          }}

          transition={{
            duration:4,
            repeat:Infinity
          }}

        />

      </svg>

      {/* ========================= */}
      {/* Truck */}
      {/* ========================= */}

      <motion.div

        animate={{

          x:[0,40,90,150],

          y:[0,-20,-50,-80]

        }}

        transition={{

          duration:10,

          repeat:Infinity,

          ease:"easeInOut"

        }}

        className="
        absolute
        left-12
        bottom-16
        "

      >

        <div

          className="
          w-20
          h-20
          rounded-3xl
          bg-white
          shadow-lg
          border
          border-slate-100
          flex
          items-center
          justify-center
          "

        >

          <Truck

            size={42}

            className="text-orange-500"

          />

        </div>

      </motion.div>

      {/* ========================= */}
      {/* Pickup */}
      {/* ========================= */}

      <div

        className="
        absolute
        left-2
        bottom-2
        "

      >

        <div

          className="
          bg-white
          rounded-2xl
          shadow-lg
          px-4
          py-3
          "

        >

          <div className="flex items-center gap-3">

            <MapPin

              size={18}

              className="text-red-500"

            />

            <div>

              <h3 className="font-semibold text-sm">

                Hyderabad

              </h3>

              <p className="text-xs text-slate-500">

                Pickup

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* Destination */}
      {/* ========================= */}

      <div

        className="
        absolute
        right-0
        top-4
        "

      >

        <div

          className="
          bg-white
          rounded-2xl
          shadow-lg
          px-4
          py-3
          "

        >

          <div className="flex items-center gap-3">

            <MapPin

              size={18}

              className="text-green-600"

            />

            <div>

              <h3 className="font-semibold text-sm">

                Bangalore

              </h3>

              <p className="text-xs text-slate-500">

                Destination

              </p>

            </div>

          </div>

        </div>

      </div>
            {/* ========================= */}
      {/* AI Matching Card */}
      {/* ========================= */}

      <FloatingCard
        className="top-14 left-40"
        delay={0.3}
        icon={
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
            🤖
          </div>
        }
        title="AI Match"
        subtitle="12 Drivers Nearby"
      />

      {/* ========================= */}
      {/* Shipment Card */}
      {/* ========================= */}

      <FloatingCard
        className="top-56 right-6"
        delay={0.6}
        icon={
          <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
            📦
          </div>
        }
        title="Shipment Ready"
        subtitle="320 KG"
      />

      {/* ========================= */}
      {/* Route Status */}
      {/* ========================= */}

      <FloatingCard
        className="bottom-16 left-48"
        delay={0.9}
        icon={
          <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
            📍
          </div>
        }
        title="Route Active"
        subtitle="380 km Remaining"
      />

      {/* ========================= */}
      {/* Small Decorative Circle */}
      {/* ========================= */}

      <div
        className="
        absolute
        top-8
        right-24
        w-4
        h-4
        rounded-full
        bg-blue-300
        opacity-40
        "
      />

      <div
        className="
        absolute
        bottom-20
        right-14
        w-3
        h-3
        rounded-full
        bg-orange-300
        opacity-40
        "
      />

      <div
        className="
        absolute
        top-44
        left-8
        w-3
        h-3
        rounded-full
        bg-cyan-300
        opacity-40
        "
      />

      {/* ========================= */}
      {/* Soft Glow */}
      {/* ========================= */}

      <div
        className="
        absolute
        left-44
        top-28
        w-28
        h-28
        rounded-full
        bg-blue-200/20
        blur-2xl
        "
      />

      <div
        className="
        absolute
        right-12
        bottom-16
        w-24
        h-24
        rounded-full
        bg-orange-200/20
        blur-2xl
        "
      />
            {/* ========================= */}
      {/* Floating Ring */}
      {/* ========================= */}

      <div
        className="
        absolute
        inset-0
        flex
        items-center
        justify-center
        "
      >
        <div
          className="
          w-[360px]
          h-[360px]
          rounded-full
          border
          border-blue-100/70
          "
        />
      </div>

      {/* ========================= */}
      {/* Floating Cards */}
      {/* ========================= */}

      <FloatingCard
        className="top-12 left-40"
        delay={0.3}
        icon={
          <div
            className="
            w-10
            h-10
            rounded-xl
            bg-blue-100
            flex
            items-center
            justify-center
            "
          >
            <BrainCircuit
              size={20}
              className="text-blue-600"
            />
          </div>
        }
        title="AI Match"
        subtitle="12 Drivers Nearby"
      />

      <FloatingCard
        className="top-56 right-4"
        delay={0.6}
        icon={
          <div
            className="
            w-10
            h-10
            rounded-xl
            bg-orange-100
            flex
            items-center
            justify-center
            "
          >
            <Package
              size={20}
              className="text-orange-600"
            />
          </div>
        }
        title="Shipment"
        subtitle="Ready to Load"
      />

      <FloatingCard
        className="bottom-16 left-48"
        delay={0.9}
        icon={
          <div
            className="
            w-10
            h-10
            rounded-xl
            bg-green-100
            flex
            items-center
            justify-center
            "
          >
            <Route
              size={20}
              className="text-green-600"
            />
          </div>
        }
        title="Route Active"
        subtitle="380 KM Left"
      />

      {/* ========================= */}
      {/* Decorative Elements */}
      {/* ========================= */}

      <div
        className="
        absolute
        top-8
        right-24
        w-3
        h-3
        rounded-full
        bg-blue-300
        opacity-40
        "
      />

      <div
        className="
        absolute
        bottom-16
        right-16
        w-4
        h-4
        rounded-full
        bg-orange-300
        opacity-40
        "
      />

      <div
        className="
        absolute
        top-44
        left-10
        w-3
        h-3
        rounded-full
        bg-cyan-300
        opacity-40
        "
      />

      {/* ========================= */}
      {/* Small Glow */}
      {/* ========================= */}

      <div
        className="
        absolute
        left-44
        top-28
        w-24
        h-24
        rounded-full
        bg-blue-300/20
        blur-2xl
        "
      />

      <div
        className="
        absolute
        right-12
        bottom-20
        w-24
        h-24
        rounded-full
        bg-orange-300/20
        blur-2xl
        "
      />

    </div>

  );

}