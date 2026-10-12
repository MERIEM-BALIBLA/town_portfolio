// Composant de scène : à utiliser DANS un <Canvas> existant (pas de Canvas ici).
// Petit placard : une grande porte à gauche, 3 tiroirs + 1 porte basse à droite, sur 4 pieds.
// Le point (0,0,0) est au sol, centre du meuble. La façade regarde vers +z.
// Dimensions en mètres : 1.2 de large, 1.6 de haut (pieds compris), 0.5 de profondeur.
export default function Cabinet({
  width = 1.2,
  height = 1.6,
  depth = 0.5,
  legHeight = 0.15,
  bodyColor = "#b98a5c",
  panelColor = "#d9b88f",
  legColor = "#2f2a26",
  knobColor = "#262626",
  ...props
}) {
  const bodyH = height - legHeight;
  const bodyY = legHeight + bodyH / 2;
  const m = 0.04; // marge du cadre autour des façades
  const gap = 0.015; // jeu entre deux façades
  const panelT = 0.03;
  const frontZ = depth / 2 + panelT / 2;

  // colonne gauche : une grande porte
  const doorW = width * 0.46;
  const doorH = bodyH - m * 2;
  const doorX = -width / 2 + m + doorW / 2;

  // colonne droite : 3 tiroirs + 1 porte basse
  const colW = width - m * 2 - doorW - gap;
  const colX = -width / 2 + m + doorW + gap + colW / 2;
  const ratios = [1, 1, 1, 1.35];
  const total = ratios.reduce((a, b) => a + b, 0);
  const usable = bodyH - m * 2 - gap * (ratios.length - 1);
  const topY = legHeight + bodyH - m;

  let cursor = topY;
  const rightPanels = ratios.map((r, i) => {
    const h = (r / total) * usable;
    const y = cursor - h / 2;
    cursor -= h + gap;
    return { h, y, isDrawer: i < 3 };
  });

  const legInset = 0.1;

  return (
    <group {...props}>
      {/* caisson */}
      <mesh position={[0, bodyY, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, bodyH, depth]} />
        <meshStandardMaterial color={bodyColor} roughness={0.65} />
      </mesh>

      {/* grande porte gauche */}
      <mesh position={[doorX, bodyY, frontZ]} castShadow>
        <boxGeometry args={[doorW, doorH, panelT]} />
        <meshStandardMaterial color={panelColor} roughness={0.55} />
      </mesh>
      {/* poignée verticale de la porte (côté droit de la porte) */}
      <mesh
        position={[
          doorX + doorW / 2 - 0.07,
          bodyY,
          frontZ + panelT / 2 + 0.015,
        ]}
      >
        <capsuleGeometry args={[0.012, 0.1, 4, 10]} />
        <meshStandardMaterial
          color={knobColor}
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>

      {/* tiroirs et porte basse à droite */}
      {rightPanels.map((p, i) => (
        <group key={i}>
          <mesh position={[colX, p.y, frontZ]} castShadow>
            <boxGeometry args={[colW, p.h, panelT]} />
            <meshStandardMaterial color={panelColor} roughness={0.55} />
          </mesh>
          {/* bouton rond */}
          <mesh
            position={[colX, p.y, frontZ + panelT / 2 + 0.012]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.025, 0.025, 0.025, 20]} />
            <meshStandardMaterial
              color={knobColor}
              metalness={0.4}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}

      {/* 4 pieds légèrement évasés */}
      {[
        [-width / 2 + legInset, -depth / 2 + legInset],
        [width / 2 - legInset, -depth / 2 + legInset],
        [-width / 2 + legInset, depth / 2 - legInset],
        [width / 2 - legInset, depth / 2 - legInset],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, legHeight / 2, z]} castShadow>
          <cylinderGeometry args={[0.045, 0.03, legHeight, 12]} />
          <meshStandardMaterial color={legColor} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
