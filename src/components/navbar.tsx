
"use client";

import { motion } from "framer-motion";
import { translations } from "@/lib/translations";

export function Navbar({ language }: { language: "english" | "hindi" }) {
  const t = translations[language];
  return (
    <div className="bg-yellow-400 w-full overflow-hidden flex justify-center items-center px-4">
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
        className="flex-grow"
      >
        <h1 className="text-black text-lg font-semibold py-2 whitespace-nowrap text-center">
          {t.navbarText}
        </h1>
      </motion.div>
    </div>
  );
}
