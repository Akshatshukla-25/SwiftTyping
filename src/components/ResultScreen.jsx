import { useState } from "react";

function StatCard({ label, value, unit, delay }) {
  return (
    <div
      className="stat-pop"
      style={{
        textAlign: "center",
        animationDelay: delay,
        padding: "1.5rem 2.5rem",
        background: "#13161e",
        border: "1px solid #1a1e2a",
        borderRadius: "12px",
        minWidth: "140px",
      }}
    >
      <p
        style={{
          margin: "0 0 0.5rem",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#3a3f55",
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "0.2rem" }}>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "3rem",
            fontWeight: 600,
            color: "#60a5fa",
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.75rem",
              color: "#3a3f55",
              letterSpacing: "0.05em",
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function RestartButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "transparent",
        border: `1px solid ${hovered ? "#60a5fa" : "#1f2333"}`,
        borderRadius: "8px",
        padding: "0.55rem 2rem",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.75rem",
        letterSpacing: "0.08em",
        color: hovered ? "#60a5fa" : "#3a3f55",
        cursor: "pointer",
        transition: "all 0.2s ease",
        outline: "none",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "transform 0.3s ease", transform: hovered ? "rotate(-45deg)" : "rotate(0deg)" }}
      >
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-3.32" />
      </svg>
      restart
    </button>
  );
}

export default function ResultScreen({ stats, onRestart }) {
  return (
    <div
      className="fade-up"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        padding: "1rem 0",
      }}
    >
      {/* Stats row */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <StatCard label="wpm" value={stats.wpm} delay="0ms" />
        <StatCard label="accuracy" value={stats.accuracy} unit="%" delay="80ms" />
      </div>

      {/* Divider line */}
      <div
        style={{
          width: "100%",
          maxWidth: "320px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #1f2333, transparent)",
        }}
      />

      <RestartButton onClick={onRestart} />
    </div>
  );
}