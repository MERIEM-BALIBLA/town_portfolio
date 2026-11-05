import { useSyncExternalStore } from "react";
import { stations } from "../assets/json/stations";

// Ordre du menu (et des raccourcis 1 à 6).
// station = id dans stations.js, side = côté de la route où se trouve la section.
const ORDER = [
  { id: "about", station: 1, side: "north" },
  { id: "experience", station: 1, side: "south" },
  { id: "education", station: 2, side: "south" },
  { id: "skills", station: 3, side: "north" },
  { id: "projects", station: 3, side: "south" },
  { id: "contact", station: 2, side: "north" },
];

export const SECTIONS = ORDER.map((s) => {
  const st = stations.find((x) => x.id === s.station);
  return {
    ...s,
    label: st[s.side].name,
    description: st[s.side].description,
    x: st.position[0],
    dir: s.side === "north" ? -1 : 1, // nord = -z, sud = +z
  };
});

export const getSection = (id) => SECTIONS.find((s) => s.id === id);

/* ------------------------------------------------------------------ */
/*  Petit store partagé entre le HUD (React DOM) et la scène 3D       */
/* ------------------------------------------------------------------ */
// current : section dans laquelle on se trouve (vue "face à la section")
// target  : section vers laquelle le joueur se déplace
// menu    : id de la station dont le menu clavier est ouvert
let state = { current: null, target: null, menu: null };
const listeners = new Set();

export function setNav(patch) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

// Commandes lues par Player.jsx à chaque image (pas besoin de re-render)
export const commands = { goTo: null, exit: false };

export const nav = {
  get: () => state,
  subscribe: (l) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function navigate(id) {
  if (!getSection(id)) return;
  commands.goTo = id;
  setNav({ target: id, menu: null });
}

export function exitSection() {
  commands.exit = true;
  setNav({ menu: null });
}

export const openMenu = (stationId) => setNav({ menu: stationId });
export const closeMenu = () => setNav({ menu: null });

export function useNav() {
  return useSyncExternalStore(nav.subscribe, nav.get);
}
