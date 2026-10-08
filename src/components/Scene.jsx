import { OrbitControls } from "@react-three/drei";
import Road from "./Road";
import Player from "../utils/Player";
import { useRef } from "react";
import { stations } from "../assets/json/stations";
import Station from "./Station";
import Section from "./Section";
import AboutSection from "./sections/AboutSection";

export default function Scene() {
  const playerRef = useRef();
  const focusRef = useRef(null); // partagé entre les stations et le joueur

  return (
    <>
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={2}
        maxDistance={150}
        maxPolarAngle={Math.PI / 2.1}
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <Road position={[0, 0, 0]} />
      <Road position={[-14, 0, 0]} rotation={Math.PI / 2} />
      <Road position={[14, 0, 0]} rotation={Math.PI / 2} />

      <AboutSection position={[-28, -21]} />
      <Section position={[0, -21]} />
      <Section position={[28, -21]} />

      <Section position={[-28, 21]} />
      <Section position={[0, 21]} />
      <Section position={[28, 21]} />

      {stations.map((s) => (
        <Station key={s.id} {...s} playerRef={playerRef} focusRef={focusRef} />
      ))}

      <Player playerRef={playerRef} focusRef={focusRef} start={[0, 0, 0]} />
      <axesHelper args={[8]} />
    </>
  );
}
