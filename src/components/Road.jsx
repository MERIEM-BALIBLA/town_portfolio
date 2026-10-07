export default function Road({
  position = [0, 0, 0],
  length = 80,
  width = 4,
  rotation = 0,
}) {
  const DASH = 2; // longueur d'un tiret
  const GAP = 2; // espace entre deux tirets
  const step = DASH + GAP;

  const count = Math.floor((length + GAP) / step);
  const start = -((count * step - GAP) / 2) + DASH / 2; // pour centrer les tirets

  const edgeOffset = width / 2 - 0.3; // distance du centre aux lignes de bord

  return (
    <group position={position} rotation-y={rotation}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      {/* Tirets au centre */}
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          rotation-x={-Math.PI / 2}
          position={[start + i * step, 0.03, 0]}
        >
          <planeGeometry args={[DASH, 0.2]} />
          <meshStandardMaterial color="#f5c542" />
        </mesh>
      ))}

      {/* Lignes de bord */}
    </group>
  );
}
