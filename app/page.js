"use client";

import { useState, useRef } from "react";

const PALETTE = {
  bg: "#000000",
  card: "#111111",
  card2: "#161616",
  accent: "#C6FF4D",
  text: "#FFFFFF",
  textDim: "#8C8C8C",
  line: "#262626",
};

const CONDITION_LIST = [
  { id: "diabetes", label: "Diabetes" },
  { id: "hypertension", label: "Hypertension" },
  { id: "general", label: "General health" },
];

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = () => reject(new Error("Failed to read image"));
    r.readAsDataURL(file);
  });
}

export default function BiozoAI() {
  const [condition, setCondition] = useState("diabetes");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const demoRef = useRef(null);

  const scrollToDemo = () => demoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const base64 = await fileToBase64(imageFile);
      const mediaType = imageFile.type || "image/jpeg";
      const conditionLabel = CONDITION_LIST.find((k) => k.id === condition)?.label || "General health";

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mediaType, condition: conditionLabel }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Analysis failed");
      setResult(data);
    } catch (err) {
      setError(err.message || "Analysis failed. Try again with a clearer photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: PALETTE.bg, color: PALETTE.text, minHeight: "100vh" }}>
      {/* NAV */}
      <nav className="f-head flex items-center justify-between px-6 md:px-16 py-6" style={{ borderBottom: `1px solid ${PALETTE.line}` }}>
        <span className="text-xl font-extrabold">BIOZO AI</span>
        <button onClick={scrollToDemo} className="pill f-body text-sm font-semibold px-5 py-2.5 rounded-full" style={{ background: PALETTE.accent, color: "#000", transition: "all .15s" }}>
          Try it now
        </button>
      </nav>

      {/* HERO */}
      <section className="px-6 md:px-16 pt-20 pb-16 max-w-4xl">
        <p className="f-mono text-xs tracking-widest uppercase mb-6" style={{ color: PALETTE.accent }}>
          AI Nutrition · Disease Prevention
        </p>
        <h1 className="f-head text-6xl md:text-8xl font-black leading-[0.95] mb-8">
          Eat with more
          <br />
          <span style={{ color: PALETTE.accent }}>peace of mind.</span>
        </h1>
        <p className="f-body text-lg md:text-xl leading-relaxed mb-10 max-w-xl" style={{ color: PALETTE.textDim }}>
          Snap a photo of your food, and BIOZO AI reads its nutritional
          content — then gives you balancing advice tailored to your health
          condition. No commands, no restrictions.
        </p>
        <button onClick={scrollToDemo} className="pill f-body font-semibold px-7 py-3.5 rounded-full text-base" style={{ background: PALETTE.accent, color: "#000", transition: "all .15s" }}>
          Try it with your food photo →
        </button>
      </section>

      {/* STAT ROW */}
      <section className="px-6 md:px-16 pb-20 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["3", "health conditions you can focus on"],
          ["0", "rigid commands — everything is advice"],
          ["<10 sec", "to read the nutrition of a photo"],
          ["Global", "nutrition database, not just local"],
        ].map(([n, l]) => (
          <div key={l} className="stat-card p-5 rounded-2xl" style={{ background: PALETTE.card, border: `1px solid ${PALETTE.line}`, transition: "border-color .2s" }}>
            <p className="f-head text-3xl md:text-4xl font-extrabold mb-2" style={{ color: PALETTE.accent }}>{n}</p>
            <p className="f-body text-sm" style={{ color: PALETTE.textDim }}>{l}</p>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-16 py-16" style={{ background: PALETTE.card2, borderTop: `1px solid ${PALETTE.line}`, borderBottom: `1px solid ${PALETTE.line}` }}>
        <p className="f-mono text-xs tracking-widest uppercase mb-8" style={{ color: PALETTE.textDim }}>How it works</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Photo your food", d: "Take or upload a photo of the food you're about to eat." },
            { n: "02", t: "BIOZO AI reads the nutrition", d: "AI identifies the food and estimates its nutritional content." },
            { n: "03", t: "Get advice, not commands", d: "A short insight plus balancing options, tailored to your health condition." },
          ].map((s) => (
            <div key={s.n} className="step-card p-6 rounded-2xl" style={{ background: PALETTE.bg, border: `1px solid ${PALETTE.line}`, transition: "border-color .2s" }}>
              <p className="f-mono text-sm mb-3" style={{ color: PALETTE.accent }}>{s.n}</p>
              <h3 className="f-head text-xl font-bold mb-2">{s.t}</h3>
