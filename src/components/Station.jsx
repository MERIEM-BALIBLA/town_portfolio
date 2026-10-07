import { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Vector3 } from "three";
import useKeys from "../utils/useKeys";

const RADIUS = 2.5; // distance de déclenchement
const tmp = new Vector3();

export default function Station({
  id,
  position,
  title,
  north,
  south,
  playerRef,
  focusRef,
}) {
  const keys = useKeys();
  const [near, setNear] = useState(false);
  const [view, setView] = useState(null); // null | "north" | "south"

  useFrame(() => {
    if (!playerRef.current) return;

    tmp.set(position[0], 0, position[2]);
    const isNear = tmp.distanceTo(playerRef.current.position) < RADIUS;
    if (isNear !== near) setNear(isNear);

    // Si le joueur a repris la main, on ferme la vue
    if (view && focusRef.current?.owner !== id) setView(null);
  });

  useEffect(() => {
    if (!near) return;

    const goTo = (side) => {
      focusRef.current = {
        owner: id,
        done: false,
        dir: new Vector3(0, 0, side === "north" ? -1 : 1), // direction de la section
        saved: focusRef.current?.saved ?? null, // garde la vue d'origine pour y revenir
      };
      setView(side);
    };

    const onKey = (e) => {
      if (e.repeat) return;
      if (keys.current.ArrowLeft || keys.current.ArrowRight) return;
      if (e.code === "ArrowUp") goTo("north");
      else if (e.code === "ArrowDown") goTo("south");
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [near, id, focusRef, keys]);

  const current = view === "north" ? north : south;

  return (
    <group position={position}>
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial color={near ? "#ffd166" : "#ffffff"} />
      </mesh>

      {near && (
        <Html position={[0, 4, 0]} center>
          <div
            style={{
              background: "white",
              padding: "10px 14px",
              borderRadius: 8,
              minWidth: 190,
              textAlign: "center",
              pointerEvents: "none",
              fontFamily: "sans-serif",
              fontSize: 13,
            }}
          >
            {view ? (
              <>
                <strong>{current.name}</strong>
                <div>{current.description}</div>
                <div style={{ opacity: 0.6, marginTop: 6 }}>
                  ← → pour continuer
                </div>
              </>
            ) : (
              <>
                <div>↑ {north.name}</div>
                <strong style={{ display: "block", margin: "4px 0" }}>
                  {title}
                </strong>
                <div>↓ {south.name}</div>
              </>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
