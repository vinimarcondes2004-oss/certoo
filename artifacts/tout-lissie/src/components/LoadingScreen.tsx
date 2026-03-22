import { useEffect, useState } from "react";

const PINK = "#e8006f";

interface LoadingScreenProps {
  ready: boolean;
}

export function LoadingScreen({ ready }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (ready) {
      setFading(true);
      const t = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(t);
    }
  }, [ready]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        transition: "opacity 0.6s ease",
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "all",
      }}
    >
      <style>{`
        @keyframes ls-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.85; }
        }
        @keyframes ls-bar {
          0%   { width: 0%; }
          40%  { width: 60%; }
          70%  { width: 80%; }
          100% { width: 100%; }
        }
        @keyframes ls-dots {
          0%   { content: ""; }
          33%  { content: "."; }
          66%  { content: ".."; }
          100% { content: "..."; }
        }
        .ls-logo {
          animation: ls-pulse 1.8s ease-in-out infinite;
        }
        .ls-bar-inner {
          animation: ls-bar 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .ls-dots::after {
          content: "";
          animation: ls-dots 1.2s steps(1, end) infinite;
        }
      `}</style>

      <div className="ls-logo" style={{ marginBottom: 32 }}>
        <img
          src={`${import.meta.env.BASE_URL}logo-pr.webp`}
          alt="Logo"
          style={{ height: 80, width: "auto", objectFit: "contain" }}
          onError={e => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      <div
        style={{
          width: 180,
          height: 4,
          borderRadius: 999,
          background: "#f0e0ea",
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        <div
          className="ls-bar-inner"
          style={{
            height: "100%",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${PINK}, #ff6bb3)`,
          }}
        />
      </div>

      <p
        className="ls-dots"
        style={{
          fontSize: 12,
          color: "#c0758e",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Carregando
      </p>
    </div>
  );
}
