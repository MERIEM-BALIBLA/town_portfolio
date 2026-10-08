const SECTION_W = 24;
const SECTION_D = 38;
const SECTION_H = 0.2;

export default function Section({
  position = [0, 0],
  color = "#6b8e4e",
  children,
}) {
  const [x, z] = position;

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, SECTION_H / 2, 0]}>
        <boxGeometry args={[SECTION_W, SECTION_H, SECTION_D]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {children}
    </group>
  );
}
