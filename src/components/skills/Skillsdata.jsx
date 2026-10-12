/* ------------------------------------------------------------------ */
/*  Compétences essentielles, groupées par catégorie                   */
/*                                                                     */
/*  wall: "back"  -> mur du fond, `at` = position X du centre du groupe */
/*  wall: "right" -> mur de droite, `at` = position Z du centre         */
/*                                                                     */
/*  Chaque compétence :                                                */
/*   - name    : texte affiché au-dessus du cadre                      */
/*   - icon    : objet ICONS.xxx = { hex, path }                       */
/*   - colors  (optionnel) : dégradé de fond [haut-gauche, bas-droite] */
/*   - textColor (optionnel) : couleur du tracé SVG                    */
/* ------------------------------------------------------------------ */
import { ICONS } from "./Skillicons";

export const SKILL_GROUPS = [
  /* --------------------------- BASE DE DONNÉES -------------------- */
  {
    title: "DATA BASE",
    wall: "right",
    at: -10,
    items: [
      {
        name: "PostgreSQL",
        icon: ICONS.postgresql,
        colors: ["#2b5278", "#4f8cc1"],
      },
      { name: "MySQL", icon: ICONS.mysql },
      { name: "Liquibase", icon: ICONS.liquibase },
    ],
    plateColor: "#a3f1e0",
  },

  /* ------------------- OUTILS DE GESTION & CONCEPTION ------------- */
  {
    title: "MANAGEMENT AND DESIGN TOOLS",
    wall: "back",
    at: -4,
    items: [
      { name: "Jira", icon: ICONS.jira },
      { name: "Trello", icon: ICONS.trello },
      { name: "Git/GitHub", icon: ICONS.github },
      { name: "UML", icon: ICONS.uml },
      { name: "Figma", icon: ICONS.figma },
    ],
    plateColor: "#e890c0",
  },

  /* ------------------------- DEVOPS & QUALITÉ --------------------- */
  {
    title: "DEVOPS & QUALITY",
    wall: "back",
    at: 4, // <- ajuste selon la place disponible sur le mur de droite
    items: [
      { name: "Docker", icon: ICONS.docker },
      { name: "SonarQube", icon: ICONS.sonarqubeserver },
    ],
    plateColor: "#b1e2a1",
  },

  /* ------------------------------ BACK-END ------------------------ */
  {
    title: "BACK-END",
    wall: "right",
    at: 10,
    items: [
      { name: "Java", icon: ICONS.java },
      { name: ".NET", icon: ICONS.dotnet },
      { name: "Spring", icon: ICONS.spring },
      { name: "Spring Boot", icon: ICONS.springboot },
      { name: "PHP", icon: ICONS.php },
      { name: "Laravel", icon: ICONS.laravel },
      { name: "RestAPI", icon: ICONS.openapiinitiative }, // icône OpenAPI en attendant une dédiée
      { name: "JUnit", icon: ICONS.junit5 },
      { name: "Keycloak", icon: ICONS.keycloak },
    ],
    plateColor: "#841aab",
  },

  /* ------------------------------ FRONT-END ----------------------- */
  {
    title: "FRONT-END",
    wall: "right",
    at: 0,
    items: [
      { name: "Angular", icon: ICONS.angular },
      {
        name: "React",
        icon: ICONS.react,
        colors: ["#1b1f27", "#2d3748"],
        textColor: "#61dafb",
      },
      { name: "JavaScript", icon: ICONS.javascript },
      { name: "Flutter", icon: ICONS.flutter },
      { name: "HTML5", icon: ICONS.html5 },
      { name: "CSS3", icon: ICONS.css },
      { name: "JQuery", icon: ICONS.jquery },
      { name: "Tailwindcss", icon: ICONS.tailwindcss },
    ],
    plateColor: "#ea9091e6",
  },
];
