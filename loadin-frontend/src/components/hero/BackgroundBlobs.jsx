import { motion } from "framer-motion";

export default function BackgroundBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none ">

      {/* Blue Blob */}

      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: "easeInOut",
        }}
        className="
        absolute
        -top-20
        -left-20
        w-[420px]
        h-[420px]
        rounded-full
        bg-blue-400/20
        blur-[120px]"
      />

      {/* Orange Blob */}

      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 40, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: "easeInOut",
        }}
        className="
        absolute
        top-40
        right-0
        w-[350px]
        h-[350px]
        rounded-full
        bg-orange-300/20
        blur-[100px]"
      />

      {/* Cyan */}

      <motion.div
        animate={{
          y: [0, 50, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
        }}
        className="
        absolute
        bottom-0
        left-1/3
        w-[250px]
        h-[250px]
        rounded-full
        bg-cyan-300/20
        blur-[90px]"
      />
    </div>
  );
}