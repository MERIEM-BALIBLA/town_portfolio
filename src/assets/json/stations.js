const maisons = { name: "Maisons", description: "Le quartier résidentiel." };
const marche = { name: "Marché", description: "Le centre commercial." };
const ferme = { name: "Ferme", description: "Les champs et la grange." };
const mairie = { name: "Mairie", description: "Le centre administratif." };
const parc = { name: "Parc", description: "Le parc et les arbres." };
const port = { name: "Port", description: "Le port du village." };

// Sur la route horizontale (z = 0), une station par colonne de sections
export const stations = [
  {
    id: 1,
    title: "Station ouest",
    position: [-28, 0.05, 0],
    north: maisons,
    south: mairie,
  },
  {
    id: 2,
    title: "Station centre",
    position: [0, 0.05, 0],
    north: marche,
    south: parc,
  },
  {
    id: 3,
    title: "Station est",
    position: [28, 0.05, 0],
    north: ferme,
    south: port,
  },
];
