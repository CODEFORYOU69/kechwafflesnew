"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <a
        href="https://wa.me/33781582955" // Remplacez par votre numéro
        target="_blank"
        rel="noopener noreferrer"
        className="relative block w-16 h-16"
      >
        {/* Texte rotatif */}
        <div className="absolute w-32 h-32 -left-8 -top-8 animate-spin-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <path
                id="circle"
                d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              />
            </defs>
            <text fontSize="13">
              <textPath href="#circle" className="text-amber-500 font-medium">
                Contactez nous • Contactez nous •
              </textPath>
            </text>
          </svg>
        </div>

        {/* Bouton WhatsApp */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute inset-0 flex items-center justify-center bg-green-500 rounded-full shadow-lg"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </motion.div>
      </a>
    </motion.div>
  );
}
