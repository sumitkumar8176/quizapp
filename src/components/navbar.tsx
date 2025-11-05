
"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type NavbarProps = {
  currentLanguage: string;
  setLanguage: (language: string) => void;
};

export function Navbar({ currentLanguage, setLanguage }: NavbarProps) {
  return (
    <div className="bg-yellow-400 w-full overflow-hidden flex justify-between items-center px-4">
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
        <h1 className="text-black text-lg font-semibold py-2 whitespace-nowrap">
          🚀 Start your quiz journey now and test your knowledge!
        </h1>
      </motion.div>
      <div className="flex gap-2 flex-shrink-0">
        <Button
          onClick={() => setLanguage("english")}
          size="sm"
          className={cn(
            "text-black bg-yellow-300 hover:bg-yellow-200",
            currentLanguage === "english" && "bg-white hover:bg-white/90"
          )}
        >
          English
        </Button>
        <Button
          onClick={() => setLanguage("hindi")}
          size="sm"
          className={cn(
            "text-black bg-yellow-300 hover:bg-yellow-200",
            currentLanguage === "hindi" && "bg-white hover:bg-white/90"
          )}
        >
          Hindi
        </Button>
      </div>
    </div>
  );
}
