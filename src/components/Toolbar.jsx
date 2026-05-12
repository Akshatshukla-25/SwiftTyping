import { useState } from "react";

const MODES = [
  { id: "words", label: "words" },
  { id: "sentences", label: "sentences" },
  { id: "code", label: "code" },
];

const TIMES = [
  { id: 15, label: "15" },
  { id: 30, label: "30" },
  { id: 60, label: "60" },
  { id: Infinity, label: "∞" },
];

function ToolbarButton({ active, onClick, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.8rem",
        fontWeight: active ? 500 : 400,
        letterSpacing: "0.04em",
        color: active ? "#60a5fa" : hovered ? "#c8cdd8" : "#3a3f55",
        padding: "0.2rem 0",
        transition: "color 0.15s ease",
        position: "relative",
        outline: "none",
      }}
    >
      {children}
      {active && (
        <span
          style={{
            position: "absolute",
            bottom: "-2px",
            left: 0,
            right: 0,
            height: "1px",
            background: "#60a5fa",
            borderRadius: "1px",
            opacity: 0.6,
          }}
        />
      )}
    </button>
  );
}

export default function Toolbar({ mode, time, onModeChange, onTimeChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0",
        background: "#13161e",
        borderRadius: "10px",
        padding: "0.65rem 1.5rem",
        border: "1px solid #1a1e2a",
      }}
    >
      {/* Mode group */}
      <div style={{ display: "flex", gap: "1.75rem" }}>
        {MODES.map((m) => (
          <ToolbarButton
            key={m.id}
            active={mode === m.id}
            onClick={() => onModeChange(m.id)}
          >
            {m.label}
          </ToolbarButton>
        ))}
      </div>

      {/* Divider */}
      <div
        style={{
          width: "1px",
          height: "14px",
          background: "#1f2333",
          margin: "0 1.5rem",
        }}
      />

      {/* Time group */}
      <div style={{ display: "flex", gap: "1.75rem" }}>
        {TIMES.map((t) => (
          <ToolbarButton
            key={t.id}
            active={time === t.id}
            onClick={() => onTimeChange(t.id)}
          >
            {t.label}
          </ToolbarButton>
        ))}
      </div>
    </div>
  );
}