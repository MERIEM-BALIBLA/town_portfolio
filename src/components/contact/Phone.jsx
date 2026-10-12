import { useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  ContactShadows,
  Environment,
  OrbitControls,
  RoundedBox,
  Text,
} from "@react-three/drei";

// npm install three @react-three/fiber @react-three/drei

const BODY = "#e7e3da";
const KEY = "#f8f6f1";
const DARK = "#262628";
const ACCENT = "#b8453a";

const TOP = 0.35; // hauteur du dessus du corps

function Body() {
  return (
    <group>
      <RoundedBox args={[3.6, 0.7, 4.4]} radius={0.22} smoothness={5}>
        <meshStandardMaterial color={BODY} roughness={0.45} />
      </RoundedBox>
      {/* Socle sombre */}
      <RoundedBox
        args={[3.66, 0.14, 4.46]}
        radius={0.12}
        smoothness={4}
        position={[0, -0.3, 0]}
      >
        <meshStandardMaterial color={DARK} roughness={0.6} />
      </RoundedBox>
    </group>
  );
}

const LABELS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

function Keypad({ position = [0.55, TOP, -0.8] }) {
  return (
    <group position={position}>
      {LABELS.map((label, i) => {
        const x = ((i % 3) - 1) * 0.5;
        const z = Math.floor(i / 3) * 0.55;
        return (
          <group key={label} position={[x, 0, z]}>
            <RoundedBox
              args={[0.38, 0.1, 0.34]}
              radius={0.04}
              smoothness={3}
              position={[0, 0.05, 0]}
            >
              <meshStandardMaterial color={KEY} roughness={0.35} />
            </RoundedBox>
            <Text
              position={[0, 0.103, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.17}
              color={DARK}
              anchorX="center"
              anchorY="middle"
            >
              {label}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

function Screen() {
  return (
    <group position={[0.7, TOP, -1.6]}>
      <RoundedBox
        args={[1.5, 0.04, 0.62]}
        radius={0.02}
        smoothness={3}
        position={[0, 0.02, 0]}
      >
        <meshStandardMaterial color="#1b2530" roughness={0.1} metalness={0.4} />
      </RoundedBox>
      <Text
        position={[0, 0.045, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.26}
        color="#8fd0c4"
        anchorX="center"
        anchorY="middle"
      >
        09:41
      </Text>
      {/* Deux petits boutons */}
      {[-0.15, 0.15].map((z) => (
        <mesh key={z} position={[1.05, 0.02, z]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 24]} />
          <meshStandardMaterial color={ACCENT} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function Handset({ position = [-1.15, TOP, 0] }) {
  const mat = <meshStandardMaterial color={BODY} roughness={0.35} />;
  return (
    <group position={position}>
      {/* Poignée */}
      <RoundedBox
        args={[0.5, 0.3, 2.2]}
        radius={0.12}
        smoothness={4}
        position={[0, 0.15, 0]}
      >
        {mat}
      </RoundedBox>
      {/* Écouteur (arrière) et micro (avant) */}
      {[-1.5, 1.5].map((z) => (
        <RoundedBox
          key={z}
          args={[0.85, 0.44, 0.95]}
          radius={0.16}
          smoothness={4}
          position={[0, 0.22, z]}
        >
          {mat}
        </RoundedBox>
      ))}
      {/* Grilles */}
      {[-1.5, 1.5].map((z) => (
        <mesh key={z} position={[0, 0.445, z]}>
          <cylinderGeometry args={[0.22, 0.22, 0.01, 32]} />
          <meshStandardMaterial color={DARK} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Cord({ turns = 30, radius = 0.07 }) {
  const geometry = useMemo(() => {
    const path = new THREE.CatmullRomCurve3(
      [
        [-1.15, 0.5, 1.95],
        [-1.2, 0.45, 2.6],
        [-2.0, 0.25, 2.9],
        [-2.6, 0.2, 2.3],
        [-2.2, 0.2, 1.5],
        [-1.8, 0.2, 1.2],
      ].map((p) => new THREE.Vector3(...p)),
    );

    const steps = turns * 14;
    const frames = path.computeFrenetFrames(steps, false);
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const a = t * turns * Math.PI * 2;
      pts.push(
        path
          .getPoint(t)
          .addScaledVector(frames.normals[i], Math.cos(a) * radius)
          .addScaledVector(frames.binormals[i], Math.sin(a) * radius),
      );
    }
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(pts),
      steps * 2,
      0.016,
      8,
      false,
    );
  }, [turns, radius]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={DARK} roughness={0.5} />
    </mesh>
  );
}

export function Phone(props) {
  return (
    <group {...props}>
      <Body />
      <Screen />
      <Keypad />
      <Handset />
      <Cord />
    </group>
  );
}
