import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";

const K = 0.2; // échelle de la miniature (la vraie scène = x5)
const TW = 24 * K;
const TD = 38 * K;
const WALL = "#8a6a7a";

// mêmes positions que dans Scene.jsx, à l'échelle K
const TILES = [
  { x: -28, z: -21, accent: "#330c3d", prop: "rug" },
  { x: 0, z: -21, accent: "#e8a0a0", prop: "round" },
  { x: 28, z: -21, accent: "#a77bff", prop: "ring" },
  { x: -28, z: 21, accent: "#b0709a", prop: "sofa" },
  { x: 0, z: 21, accent: "#c9a25a", prop: "desks" },
  { x: 28, z: 21, accent: "#6a4bc4", prop: "stack" },
];

const ease = (p) => 1 - Math.pow(1 - p, 3);

function Props({ kind, accent }) {
  switch (kind) {
    case "rug":
      return (
        <>
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[TW * 0.8, 0.03, TD * 0.45]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[1.2, 0.3, 0.6]} />
            <meshStandardMaterial color="#c9a25a" />
          </mesh>
        </>
      );
    case "round":
      return (
        <>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[1.3, 1.3, 0.03, 32]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.7, 0.35, 0.5]} />
            <meshStandardMaterial
              color="#ffd9a0"
              emissive="#ffd9a0"
              emissiveIntensity={0.4}
            />
          </mesh>
        </>
      );
    case "ring":
      return (
        <>
          <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.7, 1.1, 32]} />
            <meshBasicMaterial color={accent} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <icosahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial
              color="#ffd9f0"
              emissive="#c9a7ff"
              emissiveIntensity={0.8}
              flatShading
            />
          </mesh>
        </>
      );
    case "sofa":
      return (
        <>
          <mesh position={[-0.9, 0.2, 0.4]}>
            <boxGeometry args={[0.8, 0.3, 0.5]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <mesh position={[0.9, 0.2, -0.4]}>
            <boxGeometry args={[0.8, 0.3, 0.5]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
            <meshStandardMaterial color="#c9a25a" />
          </mesh>
        </>
      );
    case "desks":
      return (
        <>
          {[-0.8, 0.8].map((x) =>
            [-0.8, 0.8].map((z) => (
              <mesh key={`${x}${z}`} position={[x, 0.2, z]}>
                <boxGeometry args={[0.8, 0.12, 0.45]} />
                <meshStandardMaterial color={accent} />
              </mesh>
            )),
          )}
        </>
      );
    default:
      return (
        <>
          <mesh position={[0, 0.25, 0]} rotation={[0, 0.4, 0]}>
            <boxGeometry args={[0.9, 0.4, 0.7]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <mesh position={[0.1, 0.55, 0]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.7, 0.2, 0.55]} />
            <meshStandardMaterial color="#b0709a" />
          </mesh>
        </>
      );
  }
}

function Tile({ x, z, accent, prop, index }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const p = Math.min(
      Math.max((clock.elapsedTime - index * 0.18) / 1.0, 0),
      1,
    );
    const e = ease(p);
    ref.current.position.y = (1 - e) * 8;
    ref.current.scale.setScalar(Math.max(e, 0.001));
  });

  return (
    <group ref={ref} position={[x * K, 8, z * K]} scale={0.001}>
      {/* sol */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[TW, 0.1, TD]} />
        <meshStandardMaterial color="#bcbadc" />
      </mesh>
      {/* mur du fond */}
      <mesh position={[0, 0.5, z < 0 ? -TD / 2 : TD / 2]}>
        <boxGeometry args={[TW, 0.9, 0.1]} />
        <meshStandardMaterial color={WALL} />
      </mesh>
      {/* mur de côté */}
      <mesh
        position={[x < 0 ? -TW / 2 : x > 0 ? TW / 2 : 0, x === 0 ? -5 : 0.5, 0]}
      >
        <boxGeometry args={[0.1, 0.9, TD]} />
        <meshStandardMaterial color={WALL} />
      </mesh>
      <group position={[0, 0.1, 0]}>
        <Props kind={prop} accent={accent} />
      </group>
    </group>
  );
}

function Roads() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const p = Math.min(Math.max((clock.elapsedTime - 1.2) / 0.8, 0), 1);
    ref.current.scale.set(ease(p) || 0.001, 1, ease(p) || 0.001);
  });

  return (
    <group ref={ref} scale={[0.001, 1, 0.001]}>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[TW * 3 + 0.2, 0.04, TD * 2 + 0.2]} />
        <meshStandardMaterial color="#7a7590" />
      </mesh>
      {/* route horizontale */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[TW * 3, 0.02, 0.5]} />
        <meshStandardMaterial color="#574f4f" />
      </mesh>
      {/* routes verticales */}
      {[-14, 14].map((x) => (
        <mesh key={x} position={[x * K, 0.12, 0]}>
          <boxGeometry args={[0.5, 0.02, TD * 2]} />
          <meshStandardMaterial color="#574f4f" />
        </mesh>
      ))}
    </group>
  );
}

export default function WorldIntro({ phase, onArrived }) {
  const { camera } = useThree();
  const group = useRef();
  const rotY = useRef(0);
  const t = useRef(0);
  const done = useRef(false);
  const start = useRef(null);

  useFrame(({ clock }, dt) => {
    if (!group.current) return;

    if (phase === "intro") {
      rotY.current += dt * 0.2;
      group.current.rotation.y = rotY.current;
      group.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.15;
      camera.position.set(0, 9, 17);
      camera.lookAt(0, 0, 0);
      return;
    }

    if (phase !== "entering" || done.current) return;

    // valeurs de départ mémorisées une seule fois
    if (!start.current) {
      const turn = Math.PI * 2;
      start.current = {
        rot: rotY.current,
        target: Math.ceil(rotY.current / turn) * turn,
        y: group.current.position.y,
      };
    }

    t.current += dt;
    const p = Math.min(t.current / 1.8, 1);
    const e = p * p * (3 - 2 * p);
    const s = start.current;

    group.current.rotation.y = s.rot + (s.target - s.rot) * e;
    group.current.position.y = s.y * (1 - e);
    group.current.scale.setScalar(1 + 4 * e); // miniature -> taille réelle
    camera.position.set(0, 9 + 51 * e, 17 + 43 * e); // -> [0, 60, 60]
    camera.lookAt(0, 0, 0);

    if (p >= 1) {
      done.current = true;
      camera.position.set(0, 60, 60);
      camera.lookAt(0, 0, 0);
      onArrived();
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 12, 8]} intensity={1.1} color="#fff0f5" />

      <Float speed={1} floatIntensity={0.2} rotationIntensity={0}>
        <group ref={group}>
          <Roads />
          {TILES.map((tile, i) => (
            <Tile key={i} index={i} {...tile} />
          ))}
        </group>
      </Float>
    </>
  );
}
