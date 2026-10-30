import { Suspense, useEffect, useState } from "react";
import { Canvas, events as createPointerEvents } from "@react-three/fiber";
import { PerformanceMonitor, Sparkles } from "@react-three/drei";
import Scene from "./components/Scene";
import Intro from "./components/Intro";
import WorldIntro from "./components/WorldIntro";

// Three.js laisse cliquables les objets masqués : on les ignore ici.
function isVisible(object) {
  for (let o = object; o; o = o.parent) if (!o.visible) return false;
  return true;
}

function pointerEvents(store) {
  return {
    ...createPointerEvents(store),
    filter: (hits) => hits.filter((hit) => isVisible(hit.object)),
  };
}

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
  const [dpr, setDpr] = useState(1.5);

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

      <Canvas
        dpr={dpr}
        events={pointerEvents}
        camera={{ position: [0, 9, 17], fov: 50 }}
        gl={{ alpha: true }}
      >
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(1.5)}
          onFallback={() => setDpr(1)}
        />

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

          <Ready onReady={() => setReady(true)} />
        </Suspense>
      </Canvas>
    </div>
  );
}
