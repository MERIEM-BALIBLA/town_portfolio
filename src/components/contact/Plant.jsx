export default function Plant({ scale = 1, potColor = "#f4e6e1", ...props }) {
  return (
    <group scale={scale} {...props}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.38, 0.28, 0.6, 24]} />
        <meshStandardMaterial color={potColor} roughness={0.7} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.2, 0.95, Math.sin(a) * 0.2]}
            rotation={[Math.sin(a) * 0.55, 0, -Math.cos(a) * 0.55]}
            scale={[0.12, 0.6, 0.26]}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial
              color={i % 2 ? "#2f7d4f" : "#46a46a"}
              roughness={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}
