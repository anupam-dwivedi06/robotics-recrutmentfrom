"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function ThankYouPage() {
  return (
    <motion.div
      className="min-h-screen robotics-bg-pattern text-gray-100 relative flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative z-10 max-w-lg mx-auto text-center">
        <motion.div
          className="rounded-xl overflow-hidden mb-6 bg-black border border-cyan-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)] inline-block"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
        >
          <Image
            src="/logo final.jpg"
            alt="Robotics Club MANIT Bhopal"
            width={160}
            height={160}
            className="rounded-xl border-2 border-cyan-500/40 object-cover"
          />
        </motion.div>

        <motion.div
          className="rounded-lg bg-black/70 border border-cyan-500/40 p-8 shadow-[0_0_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(34,211,238,0.15)]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
            className="mx-auto mb-4 w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] mb-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            Your form has been submitted
          </motion.h1>

          <motion.p
            className="text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            Thank you for applying. Our team will review your application and contact you soon.
          </motion.p>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 py-3 px-5 rounded-md font-medium bg-cyan-500 text-white hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to form
            </Link>
          </motion.div>
        </motion.div>

        <p className="mt-6 text-cyan-400/50 text-xs font-medium tracking-wider uppercase">
          Robotics Club MANIT Bhopal
        </p>
      </div>
    </motion.div>
  );
}
