
"use client";

import { motion } from "framer-motion";

export function Navbar({ language }: { language: "english" | "hindi" }) {
  const navbarText = language === 'hindi' 
    ? "🚀 अपनी प्रश्नोत्तरी यात्रा अभी शुरू करें और अपने ज्ञान का परीक्षण करें!"
    : "🚀 Start your quiz journey now and test your knowledge!";

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
          {navbarText}
        </h1>
      </motion.div>
    </div>
  );
}
