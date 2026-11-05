import { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Vector3 } from "three";
import {
  SECTIONS,
  closeMenu,
  exitSection,
  nav,
  navigate,
  openMenu,
  useNav,
} from "../utils/navigation";
import "./Station.css";

const RADIUS = 2.5;
const tmp = new Vector3();

export default function Station({ id, position, title, playerRef }) {
  const [near, setNear] = useState(false);
  const { current, target, menu } = useNav();

  const north = SECTIONS.find((s) => s.station === id && s.side === "north");
  const south = SECTIONS.find((s) => s.station === id && s.side === "south");
  const active = [north, south].find((s) => s.id === current);
  const menuOpen = menu === id;

  // Détection de proximité
  useFrame(() => {
    if (!playerRef.current) return;
    tmp.set(position[0], 0, position[2]);
    const isNear = tmp.distanceTo(playerRef.current.position) < RADIUS;
    if (isNear !== near) setNear(isNear);
  });

  // Clavier : Entrée ouvre le menu, ↑ / ↓ choisit, Échap ferme
  useEffect(() => {
    if (!near) {
      if (nav.get().menu === id) closeMenu();
      return;
    }

    const onKey = (e) => {
      if (e.repeat) return;
      const s = nav.get();
      if (s.current || s.target) return; // déjà dans une section / en route

      if (s.menu !== id) {
        if (e.code === "Enter") openMenu(id);
        return;
      }
      if (e.code === "ArrowUp") navigate(north.id);
      else if (e.code === "ArrowDown") navigate(south.id);
      else if (e.code === "Escape") closeMenu();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [near, id, north.id, south.id]);

  const showPanel = near && (active || !target);

  return (
    <group position={position}>
      {/* Marqueur au sol */}
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.6, 28]} />
        <meshStandardMaterial color={near ? "#ffd166" : "#ffffff"} />
      </mesh>

      {showPanel && (
        <Html position={[0, 4, 0]} center zIndexRange={[25, 0]}>
          <div className="station-panel">
            {active ? (
              <>
                <strong>{active.label}</strong>
                <p>{active.description}</p>
                <button className="station-btn" onClick={exitSection}>
                  ← Back <kbd>Esc</kbd>
                </button>
              </>
            ) : (
              <>
                <strong>{title}</strong>
                <div className="station-choices">
                  <button
                    className="station-btn"
                    onClick={() => navigate(north.id)}
                  >
                    {menuOpen && <kbd>↑</kbd>} {north.label}
                  </button>
                  <button
                    className="station-btn"
                    onClick={() => navigate(south.id)}
                  >
                    {menuOpen && <kbd>↓</kbd>} {south.label}
                  </button>
                </div>
                <div className="station-hint">
                  {menuOpen ? "↑ / ↓ to choose · Esc to close" : "Press Enter"}
                </div>
              </>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
