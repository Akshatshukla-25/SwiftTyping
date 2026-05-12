export default function Header({ mode, time }) {
  return (
    <header style={{ textAlign: "center" }}>
      {/* Logo */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.15rem",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "1.75rem",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          marginBottom: "0.35rem",
        }}
      >
        <span style={{ color: "#60a5fa" }}>swift</span>
        <span style={{ color: "#c8cdd8" }}>type</span>
      </div>

      {/* Mode badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.4rem",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.7rem",
          color: "#3a3f55",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "#60a5fa",
            opacity: 0.5,
          }}
        />
        <span>{mode}</span>
        <span>·</span>
        <span>{time === Infinity ? "unlimited" : `${time}s`}</span>
        <span
          style={{
            display: "inline-block",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "#60a5fa",
            opacity: 0.5,
          }}
        />
      </div>
    </header>
  );
}