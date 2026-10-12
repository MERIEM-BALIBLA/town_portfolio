export default function Intro({ onStart, ready, phase }) {
  const leaving = phase === "entering";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10vh 0 12vh",
        color: "white",
        fontFamily: "'Segoe UI', sans-serif",
        pointerEvents: leaving ? "none" : "auto",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          Welcome to
        </p>
        <h1
          style={{
            margin: "10px 0 0",
            fontSize: "clamp(40px, 7vw, 10px)",
            fontWeight: 800,
            letterSpacing: "0.04em",
            background: "linear-gradient(90deg, #ffd9f0, #c9a7ff, #a0e7ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 24px rgba(180, 140, 255, 0.55))",
          }}
        >
          MY 3D PORTFOLIO
        </h1>
      </div>

      <button
        onClick={onStart}
        disabled={!ready}
        style={{
          padding: "16px 56px",
          fontSize: 18,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          borderRadius: 999,
          border: "1px solid rgba(201, 167, 255, 0.8)",
          background: "rgba(138, 85, 224, 0.25)",
          color: "white",
          backdropFilter: "blur(8px)",
          boxShadow: ready ? "0 0 32px rgba(167, 123, 255, 0.6)" : "none",
          cursor: ready ? "pointer" : "wait",
          opacity: ready ? 1 : 0.5,
          transition: "box-shadow 0.3s, opacity 0.3s",
        }}
      >
        {ready ? "Explore" : "Loading…"}{" "}
      </button>
    </div>
  );
}
