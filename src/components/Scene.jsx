import { OrbitControls } from "@react-three/drei";
import Road from "./Road";
import Player from "../utils/Player";
import { useRef } from "react";
import { stations } from "../assets/json/stations";
import Station from "./Station";

const SECTION_W = 24;
const SECTION_D = 38;
const SECTION_H = 0.2;

function Section({ position = [0, 0], color = "#6b8e4e", children }) {
  const [x, z] = position;

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, SECTION_H / 2, 0]}>
        <boxGeometry args={[SECTION_W, SECTION_H, SECTION_D]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* {children} */}
    </group>
  );
}

export default function Scene() {
  const playerRef = useRef();
  const focusRef = useRef(null); // partagé entre les stations et le joueur

  return (
    <>
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={10}
        maxDistance={150}
        maxPolarAngle={Math.PI / 2.1}
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <Road position={[0, 0, 0]} />
      <Road position={[-14, 0, 0]} rotation={Math.PI / 2} />
      <Road position={[14, 0, 0]} rotation={Math.PI / 2} />

      <Section position={[-28, -21]} />
      <Section position={[0, -21]} />
      <Section position={[28, -21]} />

      <Section position={[-28, 21]} />
      <Section position={[0, 21]} />
      <Section position={[28, 21]} />

      {stations.map((s) => (
        <Station key={s.id} {...s} playerRef={playerRef} focusRef={focusRef} />
      ))}

      <Player playerRef={playerRef} focusRef={focusRef} start={[0, 0, 0]} />
    </>
  );
}
