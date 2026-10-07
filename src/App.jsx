import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";

export default function App() {
  return (
    <Canvas camera={{ position: [30, 0, 0], fov: 70 }}>
      <Scene />
    </Canvas>
  );
}
