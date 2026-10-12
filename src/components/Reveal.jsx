import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Reveal({ children, delay = 0, active = false }) {
  const ref = useRef();
  const t = useRef(-delay);

  useFrame((_, dt) => {
    if (!active) return;
    t.current += dt;
    const p = Math.min(Math.max(t.current, 0) / 0.8, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    if (ref.current) ref.current.scale.setScalar(Math.max(eased, 0.001));
  });

  return (
    <group ref={ref} scale={0.001}>
      {children}
    </group>
  );
}
