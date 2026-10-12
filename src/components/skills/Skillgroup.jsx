import { Text } from "@react-three/drei";
import SkillFrame from "./Skillframe";

export default function SkillGroup({ title, wall, at, items, plateColor }) {
  const FRAME_SIZE = 1.25;
  const GAP_X = 0.3;
  const GAP_Y = 0.55; // inclut la place du nom sous chaque cadre
  const COLS = 3;

  const PAD = 0.3; // marge intérieure de la plaque
  const TITLE_H = 0.9; // zone du titre
  const LABEL_H = 0.35; // nom sous la dernière rangée

  const WALL_BACK_Z = -14;
  const WALL_RIGHT_X = 9;

  // ── Dimensions FIXES pour tous les groupes ──
  const MAX_ROWS = 3; // Back-End = 3 rangées, c'est le plus grand
  const PLATE_W = 3 * FRAME_SIZE + 2 * GAP_X + PAD * 2;
  const PLATE_H =
    TITLE_H +
    MAX_ROWS * FRAME_SIZE +
    (MAX_ROWS - 1) * GAP_Y +
    LABEL_H +
    PAD * 2;

  const TOP_Y = 7.2; // bord haut commun (LEDs à 7.6)
  const groupY = TOP_Y - PLATE_H / 2;

  const titleY = PLATE_H / 2 - PAD - TITLE_H / 2;
  const gridTop = PLATE_H / 2 - PAD - TITLE_H;

  let groupPosition;
  let rotationY;
  if (wall === "back") {
    groupPosition = [at, groupY, WALL_BACK_Z + 0.25];
    rotationY = 0;
  } else {
    groupPosition = [WALL_RIGHT_X - 0.25, groupY, at];
    rotationY = -Math.PI / 2;
  }

  return (
    <group position={groupPosition} rotation={[0, rotationY, 0]}>
      {/* Plaque de fond (taille fixe) */}
      <mesh position={[0, 0, 0.02]} receiveShadow>
        <boxGeometry args={[PLATE_W, PLATE_H, 0.04]} />
        <meshStandardMaterial
          color={plateColor}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Titre */}
      <Text
        position={[0, titleY, 0.05]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={PLATE_W - PAD * 2}
        textAlign="center"
        lineHeight={1.15}
      >
        {title}
      </Text>

      {/* Cadres */}
      <group position={[0, 0, 0.09]}>
        {items.map((item, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);

          // les lignes incomplètes sont centrées
          const inRow = Math.min(COLS, items.length - row * COLS);
          const rowW = inRow * FRAME_SIZE + (inRow - 1) * GAP_X;

          const x = -rowW / 2 + FRAME_SIZE / 2 + col * (FRAME_SIZE + GAP_X);
          const y = gridTop - FRAME_SIZE / 2 - row * (FRAME_SIZE + GAP_Y);

          return (
            <group key={item.name} position={[x, y, 0]}>
              <SkillFrame
                name={item.name}
                icon={item.icon}
                colors={item.colors}
                textColor={item.textColor}
                size={FRAME_SIZE}
              />
            </group>
          );
        })}
      </group>
    </group>
  );
}
