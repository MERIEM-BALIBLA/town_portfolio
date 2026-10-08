import { Component, Suspense, useMemo } from "react";
import * as THREE from "three";
import { Text, useTexture } from "@react-three/drei";
import avatar from "../../assets/image/me.jpg"; // depuis components/about/

const ICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";
const TECHS = [
  ["Java", "java/java-original.svg"],
  ["Spring", "spring/spring-original.svg"],
  ["PHP", "php/php-original.svg"],
  ["Laravel", "laravel/laravel-original.svg"],
  [".NET", "dot-net/dot-net-original.svg"],
  ["Node.js", "nodejs/nodejs-original.svg"],
  ["Angular", "angular/angular-original.svg"],
  ["React", "react/react-original.svg"],
  ["Flutter", "flutter/flutter-original.svg"],
  ["TypeScript", "typescript/typescript-original.svg"],
  ["JavaScript", "javascript/javascript-original.svg"],
  ["HTML5", "html5/html5-original.svg"],
  ["CSS3", "css3/css3-original.svg"],
  ["jQuery", "jquery/jquery-original.svg"],
];

const SKILLS = [
  { icon: "palette", title: "Design", sub: "UI/UX · Maquettes · Prototypage" },
  { icon: "code", title: "Frontend", sub: "React · Angular · Tailwind · Vite" },
  { icon: "server", title: "Backend", sub: "Java · Spring Boot · .NET · APIs" },
];

const LILAC = "#c4a1ff";
const BORDER = "#a78bfa";
const FILL = "#2a1558";

/* Le design est dessiné en "pixels" (1000 de large, origine en haut à gauche,
   y vers le bas). Le groupe principal convertit ça en unités de la scène. */
const DESIGN_W = 1000;
const DESIGN_H = 488;

/* ---------- Sécurité: si un logo ne charge pas, on n'affiche rien (pas de crash) ---------- */
class Safe extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {}
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/* ---------- Carte arrondie avec bordure lumineuse ---------- */
function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/* x, y = coin haut-gauche. Les enfants sont placés en coordonnées locales
   (0,0 = coin haut-gauche de la carte, y vers le bas => position={[lx, -ly, 0]}) */
function Card({ x, y, w, h, r = 18, border = 2, children }) {
  const [outer, inner] = useMemo(
    () => [
      new THREE.ShapeGeometry(roundedRectShape(w, h, r), 12),
      new THREE.ShapeGeometry(
        roundedRectShape(
          w - border * 2,
          h - border * 2,
          Math.max(r - border, 1),
        ),
        12,
      ),
    ],
    [w, h, r, border],
  );
  return (
    <group position={[x + w / 2, -(y + h / 2), 0]}>
      <mesh geometry={outer}>
        <meshBasicMaterial color={BORDER} toneMapped={false} />
      </mesh>
      <mesh geometry={inner} position={[0, 0, 0.5]}>
        <meshBasicMaterial color={FILL} toneMapped={false} />
      </mesh>
      <group position={[-w / 2, h / 2, 1]}>{children}</group>
    </group>
  );
}

/* ---------- Photo ronde (cadrage "cover", un peu vers le haut) ---------- */
function Avatar({ url, x, y, r, focus = [0.5, 0.5] }) {
  const tex = useTexture(url);
  const [fx, fy] = focus; // point de la photo gardé au centre: 0 = gauche/haut, 1 = droite/bas
  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    const a = tex.image.width / tex.image.height;
    tex.repeat.set(1, 1);
    tex.offset.set(0, 0);
    if (a > 1) {
      // photo en paysage: on coupe les côtés
      tex.repeat.set(1 / a, 1);
      tex.offset.set((1 - 1 / a) * fx, 0);
    } else if (a < 1) {
      // photo en portrait: on coupe le haut / le bas
      tex.repeat.set(1, a);
      tex.offset.set(0, (1 - a) * (1 - fy));
    }
    tex.needsUpdate = true;
  }, [tex, fx, fy]);

  return (
    <group position={[x, -y, 0]}>
      <mesh>
        <circleGeometry args={[r + 4, 64]} />
        <meshBasicMaterial color={BORDER} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.5]}>
        <circleGeometry args={[r, 64]} />
        <meshBasicMaterial map={tex} color="#dddddd" toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------- Icônes des cartes de compétences (dessinées en géométrie) ---------- */
function SkillIcon({ type, font }) {
  const mat = <meshBasicMaterial color={LILAC} toneMapped={false} />;
  const dark = <meshBasicMaterial color={FILL} toneMapped={false} />;
  if (type === "palette") {
    return (
      <group>
        <mesh>
          <circleGeometry args={[17, 32]} />
          {mat}
        </mesh>
        {[
          [-7, 6],
          [1, 9],
          [9, 3],
          [-9, -3],
        ].map(([dx, dy], i) => (
          <mesh key={i} position={[dx, dy, 0.3]}>
            <circleGeometry args={[2.6, 16]} />
            {dark}
          </mesh>
        ))}
        <mesh position={[5, -9, 0.3]}>
          <circleGeometry args={[4.5, 16]} />
          {dark}
        </mesh>
      </group>
    );
  }
  if (type === "code") {
    return (
      <Text
        fontSize={30}
        color={LILAC}
        anchorX="center"
        anchorY="middle"
        font={font}
      >
        {"</>"}
      </Text>
    );
  }
  return (
    <group>
      {[12, 0, -12].map((dy, i) => (
        <group key={i} position={[0, dy, 0]}>
          <mesh>
            <planeGeometry args={[34, 9]} />
            {mat}
          </mesh>
          <mesh position={[10, 0, 0.3]}>
            <circleGeometry args={[1.6, 12]} />
            {dark}
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- Texte du code coloré (colorRanges de troika) ---------- */
const KW = 0xc084fc;
const STR = 0x86efac;
const TXT = 0xe9e0ff;
const CODE_LINES = [
  [
    ["const", KW],
    [" dev = {", TXT],
  ],
  [
    ["  idea: ", TXT],
    ["'design'", STR],
    [",", TXT],
  ],
  [
    ["  build: ", TXT],
    ["'code'", STR],
    [",", TXT],
  ],
  [
    ["  deploy: ", TXT],
    ["'impact'", STR],
  ],
  [["}", TXT]],
];
const CODE = (() => {
  let text = "";
  const ranges = {};
  CODE_LINES.forEach((line, i) => {
    line.forEach(([t, c]) => {
      ranges[text.length] = c;
      text += t;
    });
    if (i < CODE_LINES.length - 1) text += "\n";
  });
  return { text, ranges };
})();

/* =====================================================================
   ProfilePanel (three.js + drei, aucun HTML)
   position / rotation : placement sur le mur
   width               : largeur dans la scène (la hauteur suit)
   scale               : multiplicateur supplémentaire (1 par défaut)
   font                : (optionnel) chemin d'une police .woff/.ttf
   ===================================================================== */
export default function ProfilePanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 7.6,
  scale = 1,
  font,
  avatarUrl = avatar,
  avatarFocus = [0.5, 0.5], // [horizontal, vertical] du point à centrer dans le cercle
  name = "Meriem Balibla",
  role = "Ingénieure développeuse spécialisée dans le développement Web et Mobile.",
  bio = "Bonjour, je suis Meriem, développeuse Full-Stack avec une formation en ingénierie mécatronique, passionnée par la création d'applications web et mobiles modernes en utilisant des technologies comme Java et Angular.",
  showCode = true,
}) {
  const logoSize = 58;
  const logoGap = 10;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group scale={width / DESIGN_W}>
        <group position={[-DESIGN_W / 2, DESIGN_H / 2, 0]}>
          {/* ---------- Carte profil ---------- */}
          <Card x={0} y={0} w={showCode ? 730 : 1000} h={270} r={24}>
            {avatarUrl && (
              <Suspense fallback={null}>
                <Avatar
                  url={avatarUrl}
                  x={100}
                  y={135}
                  r={72}
                  focus={avatarFocus}
                />
              </Suspense>
            )}

            <Text
              position={[200, -52, 0]}
              fontSize={40}
              color="#ffffff"
              outlineWidth={0.6}
              outlineColor="#ffffff"
              anchorX="left"
              anchorY="middle"
              font={font}
            >
              {name}
            </Text>

            <Text
              position={[200, -80, 0]}
              fontSize={17}
              color="#b99cff"
              maxWidth={505}
              lineHeight={1.25}
              anchorX="left"
              anchorY="top"
              font={font}
            >
              {role}
            </Text>

            <mesh position={[260, -140, 0]}>
              <planeGeometry args={[120, 3]} />
              <meshBasicMaterial color={BORDER} toneMapped={false} />
            </mesh>

            <Text
              position={[200, -156, 0]}
              fontSize={13.5}
              color="#e3d6ff"
              maxWidth={505}
              lineHeight={1.45}
              anchorX="left"
              anchorY="top"
              font={font}
            >
              {bio}
            </Text>
          </Card>

          {/* ---------- Fenêtre de code ---------- */}
          {showCode && (
            <Card x={750} y={0} w={250} h={180} r={18}>
              {[0xff5f57, 0xfebc2e, 0x28c840].map((c, i) => (
                <mesh key={i} position={[22 + i * 18, -22, 0]}>
                  <circleGeometry args={[5.5, 20]} />
                  <meshBasicMaterial color={c} toneMapped={false} />
                </mesh>
              ))}
              <Text
                position={[20, -48, 0]}
                fontSize={14}
                lineHeight={1.55}
                color={TXT}
                colorRanges={CODE.ranges}
                anchorX="left"
                anchorY="top"
                font={font}
              >
                {CODE.text}
              </Text>
            </Card>
          )}

          {/* ---------- 3 cartes de compétences ---------- */}
          {SKILLS.map((s, i) => (
            <Card key={s.title} x={i * 340} y={290} w={320} h={120} r={20}>
              <group position={[160, -34, 0]}>
                <SkillIcon type={s.icon} font={font} />
              </group>
              <Text
                position={[160, -70, 0]}
                fontSize={22}
                color="#ffffff"
                outlineWidth={0.4}
                outlineColor="#ffffff"
                anchorX="center"
                anchorY="middle"
                font={font}
              >
                {s.title}
              </Text>
              <Text
                position={[160, -96, 0]}
                fontSize={11.5}
                color="#cdb9ff"
                maxWidth={290}
                textAlign="center"
                anchorX="center"
                anchorY="middle"
                font={font}
              >
                {s.sub}
              </Text>
            </Card>
          ))}
        </group>
      </group>
    </group>
  );
}
