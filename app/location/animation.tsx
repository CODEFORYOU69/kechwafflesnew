"use client";

import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.3,
      ease: "easeOut",
    },
  },
};
<section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
  <div className="absolute inset-0">
    <InteractiveGridPattern
      className={cn(
        "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
      )}
      width={40}
      height={40}
      squares={[60, 60]}
      squaresClassName="hover:fill-[#CD5028] transition-all duration-10000"
    />
  </div>
  <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <motion.div
      className="mb-8"
      initial="hidden"
      animate="visible"
      variants={titleVariants}
    >
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.8,
            ease: "easeOut",
          },
        }}
      >
        <Image
          src="/images/brontkdtext.svg"
          alt="Bron Taekwondo Logo"
          width={400}
          height={400}
        />
      </motion.h1>
    </motion.div>
    <motion.p
      className="text-3xl sm:text-4xl md:text-5xl text-gray-900 font-extrabold tracking-wide mt-16 font-[Playfair Display]"
      initial="hidden"
      animate="visible"
      variants={subtitleVariants}
    >
      Plus qu&apos;un club !!!{" "}
    </motion.p>
  </div>
</section>;
