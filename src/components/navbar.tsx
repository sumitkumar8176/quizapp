"use client";

import { motion } from "framer-motion";

export function Navbar() {
  return (
    <div className="bg-yellow-400 w-full overflow-hidden">
      <motion.div
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          x: {
            duration: 20,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "linear",
          },
        }}
        className="w-full"
      >
        <h1 className="text-black text-lg font-semibold py-2 whitespace-nowrap">
          🚀 Start your quiz journey now and test your knowledge!
        </h1>
      </motion.div>
    </div>
  );
}
