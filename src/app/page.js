"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  User,
  Mail,
  Send,
  CheckCircle,
  GraduationCap,
  Building2,
  Layers,
  Phone,
  LayoutGrid,
  FileUp,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const VERTICAL_OPTIONS = [
  { value: "technical executive", label: "Technical Executive" },
  { value: "sponsorship and promotion", label: "Sponsorship and Promotion" },
  { value: "graphic designer", label: "Graphic Designer" },
  { value: "video editor", label: "Video Editor" },
  { value: "photographer", label: "Photographer" },
  { value: "web developer", label: "Web Developer" },
  { value: "content writer", label: "Content Writer" },
];

const SECTION_OPTIONS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
  "B Arch A", "B Arch B", "B Plan",
];

const BRANCH_OPTIONS = [
  "Mechanical Engineering",
  "Electrical Engineering",
  "Electronics and Communication Engineering",
  "Energy and Electrical Vehicle Engineering",
  "Materials Science and Metallurgical Engineering",
  "Mathematics and Data Science",
  "Computer Science and Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Engineering and Computational Mechanics (Dual Degree)",
  "Architecture",
  "Planning",
];

const REQUIRED_FIELDS = [
  { key: "name", label: "Name" },
  { key: "sc_no", label: "Scholar Number" },
  { key: "branch", label: "Branch" },
  { key: "vertical1", label: "Vertical 1" },
  { key: "mob_no", label: "Mobile Number" },
  { key: "section", label: "Section" },
  { key: "mail", label: "Email" },
];

function getMissingRequiredFields(form) {
  return REQUIRED_FIELDS.filter(({ key }) => {
    const value = form[key];
    return value === undefined || value === null || String(value).trim() === "";
  });
}

const FIELD_ICONS = {
  name: User,
  sc_no: GraduationCap,
  branch: Building2,
  vertical1: Layers,
  mob_no: Phone,
  section: LayoutGrid,
  mail: Mail,
  vertical2: Layers,
  portfolio: FileUp,
};

const iconClass = "w-4 h-4 text-cyan-400/80 shrink-0";

/* Stable random for particle positions (same each render) */
function seededRandom(seed) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function ParticleBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      left: seededRandom(i * 2) * 100,
      top: seededRandom(i * 3) * 100,
      size: 1 + Math.floor(seededRandom(i * 5) * 3),
      delay: seededRandom(i * 7) * 4,
      duration: 8 + seededRandom(i * 11) * 6,
      slow: i % 3 === 0,
    }));
  }, []);
  return (
    <div
      className="fixed inset-0 z-[0.5] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/40"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animation: p.slow
              ? `particle-float-slow ${p.duration}s ease-in-out ${p.delay}s infinite`
              : `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      {/* Few rising particles */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={`rise-${i}`}
          className="absolute rounded-full bg-cyan-400/30 animate-particle-rise"
          style={{
            left: `${15 + i * 12}%`,
            width: 2,
            height: 2,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    sc_no: "",
    branch: "",
    vertical1: "",
    vertical2: "",
    mob_no: "",
    section: "",
    mail: "",
    portfolio: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, portfolio: e.target.files?.[0] ?? null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    const missing = getMissingRequiredFields(form);

    if (missing.length > 0) {
      const errors = {};
      missing.forEach(({ key }) => (errors[key] = true));
      setFieldErrors(errors);
      setMessage({
        type: "error",
        text: `Please fill required fields: ${missing.map((f) => f.label).join(", ")}`,
      });
      return;
    }

    setFieldErrors({});
    setLoading(true);
    try {
      let portfolioUrl = null;
      if (form.portfolio) {
        const fd = new FormData();
        fd.append("image", form.portfolio);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Portfolio upload failed");
        portfolioUrl = data.url;
      }

      const { name, sc_no, branch, vertical1, vertical2, mob_no, section, mail } = form;
      const { error } = await supabase.from("recrutmentformrobotics").insert({
        name: name.trim(),
        sc_no: sc_no.trim(),
        branch,
        vertical1,
        vertical2: vertical2 || null,
        mob_no: mob_no.trim(),
        section,
        mail: mail.trim(),
        portfolio: portfolioUrl,
      });

      if (error) throw error;
      router.push("/thank-you");
      return;
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setForm({ name: "", sc_no: "", branch: "", vertical1: "", vertical2: "", mob_no: "", section: "", mail: "", portfolio: null });
    setMessage({ type: "", text: "" });
    setFieldErrors({});
  };

  const baseInput =
    "w-full bg-black/70 border border-cyan-500/50 rounded-md py-2.5 px-3 text-gray-100 placeholder-gray-500 outline-none transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30";
  const inputClass = (name) =>
    `${baseInput} ${fieldErrors[name] ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`;

  return (
    <motion.div
      className="min-h-screen robotics-bg-pattern text-gray-100 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <ParticleBackground />
      <div className="relative z-10 max-w-xl mx-auto px-6 py-8">
        {/* Dark/black header with logo image */}
        <motion.section
          className="rounded-xl overflow-hidden mb-6 bg-black border border-cyan-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)] animate-float-subtle"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col items-center justify-center py-8 px-6 bg-black">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            >
              <Image
              src="/logo final.jpg"
              alt="Robotics Club MANIT Bhopal"
              width={140}
              height={140}
                className="rounded-xl border-2 border-cyan-500/40 object-cover shadow-[0_0_20px_rgba(34,211,238,0.15)]"
              />
            </motion.div>
            <motion.h1
              className="mt-4 text-3xl font-bold tracking-tight text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              ROBOTICS CLUB MANIT BHOPAL
            </motion.h1>
            <motion.p
              className="mt-2 text-base font-medium text-cyan-400/80 uppercase tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.3 }}
            >
              Recruitment
            </motion.p>
          </div>
        </motion.section>

        <motion.form
          onSubmit={handleSubmit}
          className="relative rounded-lg bg-black/70 border border-cyan-500/40 p-6 shadow-[0_0_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(34,211,238,0.15)] animate-glow-pulse"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-cyan-400/80" />
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-cyan-400/80" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-cyan-400/80" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-cyan-400/80" />

          {/* Form header inside container */}
          <motion.div
            className="mb-5 flex items-center gap-2 text-xs font-medium tracking-widest text-cyan-400/80 uppercase"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.35 }}
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            System Interface
          </motion.div>
          <motion.h2
            className="text-lg font-bold tracking-tight text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] mb-5"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.35 }}
          >
            Initialize Contact
          </motion.h2>

          <AnimatePresence mode="wait">
            {message.type === "error" && message.text && (
              <motion.div
                key="error-banner"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ opacity: { duration: 0.2 }, x: { duration: 0.4 } }}
                className="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-3 mb-4"
              >
                <p className="text-sm text-red-400">{message.text}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {message.type === "success" && message.text && (
              <motion.div
                key="success-banner"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="mb-4 flex items-center gap-3 rounded-md border border-emerald-500/60 bg-emerald-500/15 px-4 py-3 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
              >
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                <p className="text-sm font-medium text-emerald-300">{message.text}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {REQUIRED_FIELDS.map(({ key, label }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.08 * i + 0.55,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <label className="block text-xs font-medium tracking-[0.12em] text-cyan-400/90 uppercase mb-1.5">
                  {label} <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  {FIELD_ICONS[key] && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      {(() => {
                        const Icon = FIELD_ICONS[key];
                        return <Icon className={iconClass} />;
                      })()}
                    </span>
                  )}
                  {key === "branch" ? (
                    <select
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      className={`${inputClass(key)} pl-14`}
                    >
                      <option value="">Select branch</option>
                      {BRANCH_OPTIONS.map((b) => (
                        <option key={b} value={b} className="bg-gray-900 text-gray-100">{b}</option>
                      ))}
                    </select>
                  ) : key === "vertical1" ? (
                    <select
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      className={`${inputClass(key)} pl-14`}
                    >
                      <option value="">Select vertical</option>
                      {VERTICAL_OPTIONS.map((v) => (
                        <option key={v.value} value={v.value} className="bg-gray-900 text-gray-100">{v.label}</option>
                      ))}
                    </select>
                  ) : key === "section" ? (
                    <select
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      className={`${inputClass(key)} pl-14`}
                    >
                      <option value="">Select section</option>
                      {SECTION_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-gray-900 text-gray-100">{s}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={key === "mail" ? "email" : key === "mob_no" ? "tel" : "text"}
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      className={`${inputClass(key)} pl-12`}
                      placeholder={
                        key === "name" ? "Enter your name" :
                        key === "sc_no" ? "Scholar number" :
                        key === "mob_no" ? "10-digit mobile number" :
                        key === "mail" ? "Enter your email" : ""
                      }
                    />
                  )}
                </div>
                <AnimatePresence>
                  {fieldErrors[key] && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-xs text-red-400"
                    >
                      This field is required
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.95, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase mb-1.5">
                Vertical 2 <span className="text-gray-600">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Layers className={iconClass} />
                </span>
                <select
                  name="vertical2"
                  value={form.vertical2}
                  onChange={handleChange}
                  className={`${baseInput} pl-14`}
                >
                <option value="">None</option>
                {VERTICAL_OPTIONS.map((v) => (
                  <option key={v.value} value={v.value} className="bg-gray-900 text-gray-100">{v.label}</option>
                ))}
              </select>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase mb-1.5">
                Portfolio <span className="text-gray-600">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <FileUp className={iconClass} />
                </span>
                <input
                  type="file"
                  name="portfolio"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleFileChange}
                  className={`${baseInput} pl-14 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-cyan-500/20 file:text-cyan-400 file:text-xs file:font-medium`}
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-6 flex gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-md font-medium bg-cyan-500 text-white hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Send className="w-4 h-4" />
              {loading ? "Transmitting…" : "Transmit Data"}
            </motion.button>
            <motion.button
              type="button"
              onClick={handleClear}
              className="px-4 py-3 rounded-md font-medium border border-cyan-500/60 text-gray-300 hover:bg-cyan-500/10 hover:border-cyan-400/80 transition-colors"
              whileHover={{ scale: 1.02, borderColor: "rgba(34, 211, 238, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              Clear System
            </motion.button>
          </motion.div>

          <motion.div
            className="mt-6 flex items-center justify-between text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35, duration: 0.35 }}
          >
            <span className="flex items-center gap-2">
              <motion.span
                className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              System Online
            </span>
            <span>v2.0.47</span>
          </motion.div>
        </motion.form>

        <motion.p
          className="mt-8 text-center text-cyan-400/50 text-xs font-medium tracking-wider uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          Robotics Club MANIT Bhopal
        </motion.p>
        <p className="mt-2 text-center text-gray-500 text-xs">
          * Required fields. Vertical 2 and Portfolio are optional.
        </p>
      </div>
    </motion.div>
  );
}
