import { RoundedBox } from "@react-three/drei";

const OAK = "#e2ac6f";
const METAL = "#61470a";
const CABINET = "#cfcfcf";
const TOP_Y = 0.95; // hauteur du plateau

function Cabinet({ position }) {
  return (
    <group position={position} scale={[1.6, 1, 1]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.95, 1.1]} />
        <meshStandardMaterial color={CABINET} roughness={0.7} />
      </mesh>
      {[0.8, 0.5, 0.2].map((y) => (
        <group key={y} position={[0, y, 0.555]}>
          <mesh>
            <boxGeometry args={[0.62, 0.26, 0.012]} />
            <meshStandardMaterial color="#dcdcdd" roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.07, 0.012]}>
            <boxGeometry args={[0.22, 0.014, 0.012]} />
            <meshStandardMaterial
              color="#14151b"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* Cadre métal noir en "U" */
function MetalFrame({ x }) {
  return (
    <group position={[x, 0, 0]}>
      {[-0.58, 0.58].map((z) => (
        <mesh key={z} position={[0, 0.48, z]} castShadow>
          <boxGeometry args={[0.06, 0.96, 0.06]} />
          <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.93, 0]} castShadow>
        <boxGeometry args={[0.06, 0.05, 1.16]} />
        <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.06, 0.05, 1.16]} />
        <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function Desk({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <RoundedBox
        args={[3.8, 0.06, 1.3]}
        radius={0.015}
        smoothness={3}
        position={[0, TOP_Y, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={OAK} roughness={0.55} />
      </RoundedBox>

      <MetalFrame x={-1.8} />
      <MetalFrame x={1.8} />
      <Cabinet position={[1.25, 0, 0]} />
    </group>
  );
}
