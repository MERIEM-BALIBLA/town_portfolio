import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, Sparkles } from "@react-three/drei";
import Scene from "./components/Scene";
import Intro from "./components/Intro";
import WorldIntro from "./components/WorldIntro";

function Ready({ onReady }) {
  useEffect(() => {
    const id = setTimeout(onReady, 300);
    return () => clearTimeout(id);
  }, [onReady]);
  return null;
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState("intro"); // intro -> entering -> scene

  // NOUVEAU : Cette condition devient vraie dès que l'on quitte l'intro
  const isEnteringOrScene = phase !== "intro";
  const inScene = phase === "scene"; // Gardé pour le rendu conditionnel de WorldIntro

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        // MODIFIÉ : On utilise isEnteringOrScene pour le fond
        background:
          "linear-gradient(180deg, #2a1040 0%, #8a6a9a 55%, #e8d5ea 100%)",
        // AJOUTÉ : Une transition pour adoucir le changement de fond
        transition: "background 1.5s ease-in-out",
      }}
    >
      {!inScene && (
        <Intro
          ready={ready}
          phase={phase}
          onStart={() => setPhase("entering")}
        />
      )}

      {/* Fondu blanc quand on entre dans la maison */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          background: "#ffffff",
          pointerEvents: "none",
          opacity: phase === "entering" ? 1 : 0,
          transition:
            phase === "entering"
              ? "opacity 1.8s ease-in"
              : "opacity 0.8s ease-out",
        }}
      />

      <Canvas camera={{ position: [0, 9, 17], fov: 50 }} gl={{ alpha: true }}>
        {!inScene && (
          <WorldIntro phase={phase} onArrived={() => setPhase("scene")} />
        )}

        <Suspense fallback={null}>
          <Scene started={inScene} />
          <Sparkles
            count={70}
            scale={[22, 10, 22]}
            size={3}
            speed={0.3}
            color="#e8d5ff"
          />

          <Preload all />
          <Ready onReady={() => setReady(true)} />
        </Suspense>
      </Canvas>
    </div>
  );
}
