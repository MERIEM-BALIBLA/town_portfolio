import { Suspense, useEffect, useState } from "react";
import { Canvas, events as createPointerEvents } from "@react-three/fiber";
import { PerformanceMonitor, Sparkles } from "@react-three/drei";
import Scene from "./components/Scene";
import Intro from "./components/Intro";
import WorldIntro from "./components/WorldIntro";
import MusicPlayer from "./components/MusicPlayer";
import NavMenu from "./components/NavMenu";

// Téléphone / tablette : on allège le rendu
const IS_MOBILE =
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);
const MAX_DPR = IS_MOBILE ? 1 : 1.5;

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
  const [dpr, setDpr] = useState(MAX_DPR);

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

      <MusicPlayer autoStart={isEnteringOrScene} />
      <NavMenu visible={inScene} />

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
        style={{ touchAction: "none" }}
      >
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(MAX_DPR)}
          onFallback={() => setDpr(1)}
        />

        {!inScene && (
          <WorldIntro phase={phase} onArrived={() => setPhase("scene")} />
        )}

        <Suspense fallback={null}>
          <Scene started={inScene} lowPower={IS_MOBILE} />
          <Sparkles
            count={IS_MOBILE ? 30 : 70}
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
