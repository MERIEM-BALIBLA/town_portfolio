import { useMemo } from "react";
import * as THREE from "three";
import { Float } from "@react-three/drei";
import { CREAM, PEACH } from "../../assets/json/Config";

export default function PaperPlane({ position = [6.4, 6.3, -13.4] }) {
  const plane = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const v = new Float32Array([
      1, 0, 0, -0.8, 0.2, 0.7, -0.8, -0.15, 0, 1, 0, 0, -0.8, -0.15, 0, -0.8,
      0.2, -0.7,
    ]);
    g.setAttribute("position", new THREE.BufferAttribute(v, 3));
    g.computeVertexNormals();
    return g;
  }, []);

  const dots = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      [
        [1.6, 4.9],
        [2.7, 4.55],
        [3.7, 5.2],
        [4.7, 5.15],
        [5.4, 5.9],
        [6.0, 6.15],
      ].map(([x, y]) => new THREE.Vector3(x, y, -13.62)),
    );
    return curve.getPoints(30).filter((_, i) => i % 3 !== 0);
  }, []);

  return (
    <group>
      {/* Trace en pointillés */}
      {dots.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color={PEACH} />
        </mesh>
      ))}

      {/* Avion */}
      <Float
        speed={2}
        floatIntensity={0.6}
        rotationIntensity={0.3}
        position={position}
      >
        <group rotation={[0.9, -0.2, 0.45]}>
          <mesh geometry={plane} scale={0.6}>
            <meshStandardMaterial
              color={CREAM}
              emissive={PEACH}
              emissiveIntensity={0.35}
              side={THREE.DoubleSide}
              flatShading
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
}
