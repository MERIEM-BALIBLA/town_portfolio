// Table d'élève. Le point (0,0,0) est au sol, centre de la table.
// Unités en mètres : 1.2 x 0.6, hauteur 0.75.
export default function Desk({
  rotation,
  width = 1.2,
  depth = 0.6,
  height = 0.75,
  topColor = "#c8a27a",
  legColor = "#3b4252",
  ...props
}) {
  const topT = 0.05;
  const legR = 0.025;
  const lx = width / 2 - 0.08;
  const lz = depth / 2 - 0.08;
  const legH = height - topT;

  return (
    <group {...props} rotation={rotation}>
      {/* plateau */}
      <mesh position={[0, height - topT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, topT, depth]} />
        <meshStandardMaterial color={topColor} roughness={0.6} />
      </mesh>

      {/* 4 pieds */}
      {[
        [-lx, -lz],
        [lx, -lz],
        [-lx, lz],
        [lx, lz],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, legH / 2, z]} castShadow>
          <cylinderGeometry args={[legR, legR, legH, 12]} />
          <meshStandardMaterial
            color={legColor}
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* barre d'entretoise */}
      <mesh position={[0, 0.2, lz]}>
        <boxGeometry args={[width - 0.16, 0.03, 0.03]} />
        <meshStandardMaterial
          color={legColor}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}
