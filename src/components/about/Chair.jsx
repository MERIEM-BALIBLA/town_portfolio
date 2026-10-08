import { RoundedBox } from "@react-three/drei";

const FABRIC = "#3a3a41";
const FABRIC_DARK = "#2f2f35";
const PLASTIC = "#16161a";
const SEAT_Y = 0.5;

/* Base à 5 branches avec roulettes */
function StarBase() {
  return (
    <group>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2 + 0.3;
        return (
          <group key={i} rotation={[0, a, 0]}>
            {/* branche, légèrement relevée vers l'extrémité */}
            <mesh
              position={[0.16, 0.085, 0]}
              rotation={[0, 0, -0.08]}
              castShadow
            >
              <boxGeometry args={[0.34, 0.035, 0.05]} />
              <meshStandardMaterial color={PLASTIC} roughness={0.5} />
            </mesh>
            {/* roulette */}
            <group position={[0.31, 0, 0]} rotation={[0, -a * 0.6, 0]}>
              <mesh position={[0, 0.07, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.05, 8]} />
                <meshStandardMaterial color="#222" metalness={0.5} />
              </mesh>
              <mesh position={[0, 0.035, 0]} castShadow>
                <boxGeometry args={[0.05, 0.015, 0.04]} />
                <meshStandardMaterial color={PLASTIC} />
              </mesh>
              {[-0.016, 0.016].map((z) => (
                <mesh
                  key={z}
                  position={[0, 0.03, z]}
                  rotation={[Math.PI / 2, 0, 0]}
                  castShadow
                >
                  <cylinderGeometry args={[0.03, 0.03, 0.016, 16]} />
                  <meshStandardMaterial color="#0d0d10" roughness={0.6} />
                </mesh>
              ))}
            </group>
          </group>
        );
      })}
      {/* moyeu */}
      <mesh position={[0, 0.095, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.07, 20]} />
        <meshStandardMaterial color={PLASTIC} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Armrest({ x }) {
  return (
    <group position={[x, 0, 0.02]}>
      {/* montant en C */}
      <mesh position={[0, 0.58, 0.02]} castShadow>
        <boxGeometry args={[0.035, 0.16, 0.05]} />
        <meshStandardMaterial color={PLASTIC} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.5, 0.04]} castShadow>
        <boxGeometry args={[0.035, 0.035, 0.18]} />
        <meshStandardMaterial color={PLASTIC} roughness={0.5} />
      </mesh>
      {/* manchette */}
      <RoundedBox
        args={[0.075, 0.045, 0.3]}
        radius={0.02}
        smoothness={4}
        position={[0, 0.69, -0.04]}
        castShadow
      >
        <meshStandardMaterial color={FABRIC_DARK} roughness={0.85} />
      </RoundedBox>
    </group>
  );
}

/**
 * Chaise de bureau. Par défaut elle regarde vers -Z (comme si le bureau était devant elle).
 * `swivel` fait tourner uniquement l'assise (radians), la base reste fixe.
 */
export default function Chair({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  swivel = 0,
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <StarBase />

      {/* vérin à gaz : fourreau + tige */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.05, 0.25, 16]} />
        <meshStandardMaterial color={PLASTIC} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.028, 0.16, 12]} />
        <meshStandardMaterial color="#3a3a40" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* partie qui pivote */}
      <group rotation={[0, swivel, 0]}>
        {/* mécanisme sous l'assise + levier */}
        <RoundedBox
          args={[0.24, 0.07, 0.26]}
          radius={0.02}
          position={[0, 0.44, 0.02]}
          castShadow
        >
          <meshStandardMaterial color={PLASTIC} roughness={0.5} />
        </RoundedBox>
        <mesh position={[0.17, 0.44, -0.02]} rotation={[0, 0, 0.1]} castShadow>
          <boxGeometry args={[0.1, 0.014, 0.03]} />
          <meshStandardMaterial color={PLASTIC} />
        </mesh>

        {/* assise rembourrée */}
        <RoundedBox
          args={[0.58, 0.11, 0.56]}
          radius={0.05}
          smoothness={5}
          position={[0, SEAT_Y + 0.02, -0.01]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={FABRIC} roughness={0.95} />
        </RoundedBox>

        {/* support de dossier */}
        <RoundedBox
          args={[0.1, 0.3, 0.06]}
          radius={0.02}
          position={[0, 0.7, 0.24]}
          rotation={[-0.12, 0, 0]}
          castShadow
        >
          <meshStandardMaterial color={PLASTIC} roughness={0.5} />
        </RoundedBox>

        {/* dossier haut, large et arrondi */}
        <group position={[0, 0.98, 0.2]} rotation={[-0.14, 0, 0]}>
          <RoundedBox
            args={[0.52, 0.64, 0.11]}
            radius={0.075}
            smoothness={6}
            castShadow
          >
            <meshStandardMaterial color={FABRIC} roughness={0.95} />
          </RoundedBox>
          {/* coque arrière */}
          <RoundedBox
            args={[0.48, 0.6, 0.03]}
            radius={0.065}
            smoothness={5}
            position={[0, 0, 0.055]}
            castShadow
          >
            <meshStandardMaterial color={FABRIC_DARK} roughness={0.8} />
          </RoundedBox>
        </group>

        <Armrest x={-0.33} />
        <Armrest x={0.33} />
      </group>
    </group>
  );
}
