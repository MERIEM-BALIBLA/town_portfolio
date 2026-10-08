// export default function Plant({ position, scale = 1 }) {
//   return (
//     <group position={position} scale={scale}>
//       <mesh position={[0, 0.15, 0]} castShadow>
//         <cylinderGeometry args={[0.16, 0.12, 0.3, 20]} />
//         <meshStandardMaterial color="#e8e2da" roughness={0.7} />
//       </mesh>
//       {[
//         [0, 0.5, 0, 0.22],
//         [0.12, 0.42, 0.05, 0.16],
//         [-0.12, 0.4, -0.04, 0.17],
//         [0.02, 0.62, 0.06, 0.14],
//       ].map(([x, y, z, r], i) => (
//         <mesh key={i} position={[x, y, z]} castShadow>
//           <icosahedronGeometry args={[r, 1]} />
//           <meshStandardMaterial color="#4f9d5d" roughness={0.6} flatShading />
//         </mesh>
//       ))}
//     </group>
//   );
// }

import { useMemo } from "react";
import * as THREE from "three";

const POT_H = 0.3;

/* Feuille ovale pointue, courbée vers le bas, dégradé vert foncé -> clair */
function useLeafGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.34, 0.15, 0.36, 0.7, 0, 1);
    shape.bezierCurveTo(-0.36, 0.7, -0.34, 0.15, 0, 0);

    const geo = new THREE.ShapeGeometry(shape, 24);
    const pos = geo.attributes.position;
    const colors = [];
    const base = new THREE.Color("#2f6b3a");
    const tip = new THREE.Color("#6fbf6a");

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // courbure le long de la feuille + léger creux au centre (nervure)
      pos.setZ(i, 0.38 * y * y - 0.04 * (0.35 - Math.abs(x)) * y);
      const c = base
        .clone()
        .lerp(tip, Math.min(1, y * 0.9 + Math.abs(x) * 0.3));
      colors.push(c.r, c.g, c.b);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);
}

// azimut (°), inclinaison de la tige (°), longueur tige, taille feuille, élévation feuille (°)
const LEAVES = [
  [0, 8, 0.7, 0.62, 55],
  [75, 16, 0.55, 0.56, 38],
  [145, 12, 0.42, 0.52, 28],
  [205, 20, 0.52, 0.58, 42],
  [265, 14, 0.62, 0.55, 35],
  [320, 24, 0.38, 0.48, 22],
  [35, 22, 0.46, 0.5, 30],
];

function Leaf({ azimuth, tilt, stem, size, elev, geometry }) {
  const t = THREE.MathUtils.degToRad(tilt);
  const theta = Math.PI / 2 - THREE.MathUtils.degToRad(elev);
  const tipX = Math.sin(t) * stem;
  const tipY = Math.cos(t) * stem;

  return (
    <group
      position={[0, POT_H, 0]}
      rotation={[0, THREE.MathUtils.degToRad(azimuth), 0]}
    >
      {/* tige */}
      <mesh position={[tipX / 2, tipY / 2, 0]} rotation={[0, 0, -t]} castShadow>
        <cylinderGeometry args={[0.006, 0.01, stem, 6]} />
        <meshStandardMaterial color="#3f7d46" roughness={0.7} />
      </mesh>
      {/* limbe */}
      <mesh
        position={[tipX, tipY, 0]}
        rotation={new THREE.Euler(0, Math.PI / 2, -theta, "ZYX")}
        scale={[size * 0.95, size, size]}
        geometry={geometry}
        castShadow
      >
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

export default function Plant({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) {
  const leaf = useLeafGeometry();

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* pot en céramique crème */}
      <mesh position={[0, POT_H / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.17, 0.13, POT_H, 32]} />
        <meshStandardMaterial color="#ece7e1" roughness={0.65} />
      </mesh>
      {/* rebord */}
      <mesh position={[0, POT_H - 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.145, 0.17, 32]} />
        <meshStandardMaterial color="#f3efe9" roughness={0.6} />
      </mesh>
      {/* terre */}
      <mesh position={[0, POT_H - 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial color="#2a1f1a" roughness={1} />
      </mesh>

      {LEAVES.map(([azimuth, tilt, stem, size, elev], i) => (
        <Leaf
          key={i}
          azimuth={azimuth}
          tilt={tilt}
          stem={stem}
          size={size}
          elev={elev}
          geometry={leaf}
        />
      ))}
    </group>
  );
}
