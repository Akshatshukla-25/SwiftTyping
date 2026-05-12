import { useRef, useEffect, useState } from "react";

export default function TypingArea({ textArray, userInput, status }) {
  const charRefs = useRef([]);
  const [caretPos, setCaretPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(status === "running");
  }, [status]);

  useEffect(() => {
    const index = userInput.length;
    const el = charRefs.current[index];
    const container = containerRef.current;
    if (!el || !container) return;
    const charRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setCaretPos({
      x: charRect.left - containerRect.left,
      y: charRect.top - containerRect.top,
    });
  }, [userInput]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "9rem",
        userSelect: "none",
        cursor: "default",
        padding: "1.75rem 2rem",
        background: "#13161e",
        borderRadius: "12px",
        border: "1px solid #1a1e2a",
        transition: "border-color 0.3s ease",
        borderColor: isActive ? "#1f2b40" : "#1a1e2a",
      }}
    >
      {/* Animated caret */}
      <div
        className={!isActive ? "caret-blink" : ""}
        style={{
          position: "absolute",
          width: "2px",
          height: "1.5rem",
          backgroundColor: "#60a5fa",
          borderRadius: "1px",
          transform: `translate(${caretPos.x + 32}px, ${caretPos.y + 28}px)`,
          transition: "transform 80ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          zIndex: 10,
          boxShadow: "0 0 6px rgba(96, 165, 250, 0.5)",
        }}
      />

      {/* Text */}
      <div
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "1.2rem",
          lineHeight: "2.25rem",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          letterSpacing: "0.01em",
        }}
      >
        {textArray.map((char, i) => {
          let color;
          let textDecoration = "none";

          if (i < userInput.length) {
            if (userInput[i] === char) {
              color = "#c8cdd8";
            } else {
              color = "#f87171";
              if (char === " ") textDecoration = "underline";
            }
          } else {
            color = "#2a2f42";
          }

          return (
            <span
              key={i}
              ref={(el) => (charRefs.current[i] = el)}
              style={{
                color,
                textDecoration,
                transition: "color 0.05s ease",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}