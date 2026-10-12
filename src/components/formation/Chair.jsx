// Chaise d'élève. Le dossier est du côté +z : la chaise regarde vers -z.
// Le point (0,0,0) est au sol, centre de l'assise.
export default function Chair({
  seatColor = "#2f6fb5",
  legColor = "#3b4252",
  ...props
}) {
  const size = 0.4;
  const seatH = 0.45;
  const seatT = 0.04;
  const legR = 0.018;
  const off = size / 2 - 0.04;

  return (
    <group {...props} scale={1.2}>
      {/* assise */}
      <mesh position={[0, seatH, 0]} castShadow receiveShadow>
        <boxGeometry args={[size, seatT, size]} />
        <meshStandardMaterial color={seatColor} roughness={0.55} />
      </mesh>

      {/* dossier */}
      <mesh position={[0, seatH + 0.22, size / 2 - 0.02]} castShadow>
        <boxGeometry args={[size, 0.3, 0.03]} />
        <meshStandardMaterial color={seatColor} roughness={0.55} />
      </mesh>

      {/* montants du dossier */}
      {[-off, off].map((x) => (
        <mesh key={x} position={[x, seatH + 0.1, size / 2 - 0.02]}>
          <cylinderGeometry args={[legR, legR, 0.2, 10]} />
          <meshStandardMaterial
            color={legColor}
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* 4 pieds */}
      {[
        [-off, -off],
        [off, -off],
        [-off, off],
        [off, off],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, seatH / 2, z]} castShadow>
          <cylinderGeometry args={[legR, legR, seatH, 10]} />
          <meshStandardMaterial
            color={legColor}
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}
