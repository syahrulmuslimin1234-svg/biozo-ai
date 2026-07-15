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
      setError("Analysis failed. Try again with a clearer photo.");
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
              <p className="f-body text-sm" style={{ color: PALETTE.textDim }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO */}
      <section ref={demoRef} className="px-6 md:px-16 py-20 max-w-2xl mx-auto">
        <p className="f-mono text-xs tracking-widest uppercase mb-3" style={{ color: PALETTE.accent }}>Try it now</p>
        <h2 className="f-head text-3xl md:text-4xl font-extrabold mb-8">Advice Card</h2>

        <div className="mb-6">
          <p className="f-body text-sm mb-3" style={{ color: PALETTE.textDim }}>Health condition to consider</p>
          <div className="flex flex-wrap gap-2">
            {CONDITION_LIST.map((k) => (
              <button
                key={k.id}
                onClick={() => setCondition(k.id)}
                className="f-body text-sm font-medium px-4 py-2 rounded-full"
                style={{
                  background: condition === k.id ? PALETTE.accent : "transparent",
                  color: condition === k.id ? "#000" : PALETTE.textDim,
                  border: `1px solid ${condition === k.id ? PALETTE.accent : PALETTE.line}`,
                  transition: "all .15s",
                }}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>

        <label htmlFor="food-photo" className="f-body flex flex-col items-center justify-center rounded-2xl cursor-pointer p-8 mb-4" style={{ border: `1.5px dashed ${PALETTE.line}`, minHeight: "220px", background: PALETTE.card }}>
          {imagePreview ? (
            <img src={imagePreview} alt="Food preview" className="max-h-48 rounded-lg object-contain" />
          ) : (
            <>
              <span className="text-3xl mb-2">📷</span>
              <span style={{ color: PALETTE.textDim }}>Tap to upload a food photo</span>
            </>
          )}
        </label>
        <input id="food-photo" type="file" accept="image/*" onChange={handleFile} />

        <button
          onClick={analyze}
          disabled={!imageFile || loading}
          className="pill f-body font-semibold w-full py-3.5 rounded-full"
          style={{
            background: !imageFile || loading ? PALETTE.line : PALETTE.accent,
            color: !imageFile || loading ? PALETTE.textDim : "#000",
            transition: "all .15s",
          }}
        >
          {loading ? "Reading nutrition..." : "Analyze this food"}
        </button>

        {error && <p className="f-body text-sm mt-4" style={{ color: "#FF6B5B" }}>{error}</p>}

        {result && (
          <div className="mt-8 p-6 rounded-2xl" style={{ background: PALETTE.card, border: `1px solid ${PALETTE.line}` }}>
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="f-head text-2xl font-extrabold">{result.food}</h3>
              <span className="f-mono text-sm" style={{ color: PALETTE.accent }}>{result.estimated_calories}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-5 f-mono text-xs text-center">
              {[
                ["Carbs", result.key_nutrients?.carbs],
                ["Protein", result.key_nutrients?.protein],
                ["Fat", result.key_nutrients?.fat],
                ["Fiber", result.key_nutrients?.fiber],
              ].map(([label, val]) => (
                <div key={label} className="p-2 rounded-lg" style={{ background: PALETTE.bg }}>
                  <div style={{ color: PALETTE.textDim }}>{label}</div>
                  <div className="mt-1">{val}</div>
                </div>
              ))}
            </div>

            <p className="f-body text-sm leading-relaxed mb-5" style={{ color: PALETTE.textDim }}>{result.insight}</p>

            <p className="f-mono text-xs tracking-widest uppercase mb-3" style={{ color: PALETTE.accent }}>Balancing tips</p>
            <ul className="space-y-2">
              {(result.balancing_tips || []).map((n, i) => (
                <li key={i} className="f-body text-sm flex gap-2">
                  <span style={{ color: PALETTE.accent }}>·</span> {n}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="f-body text-xs mt-10 leading-relaxed" style={{ color: PALETTE.textDim }}>
          BIOZO AI is a nutrition education tool, not a substitute for a
          doctor or dietitian. For specific health conditions, always
          consult your food decisions with the medical professional caring
          for you.
        </p>
      </section>

      <footer className="f-body text-center text-xs py-10" style={{ color: PALETTE.textDim, borderTop: `1px solid ${PALETTE.line}` }}>
        BIOZO AI — nutrition advice, not commands.
      </footer>
    </div>
  );
}
