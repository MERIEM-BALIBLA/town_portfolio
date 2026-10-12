const profile = {
  name: "About Me",
  description: "Discover my background and my journey as a developer.",
};

const skills = {
  name: "Skills",
  description: "Explore my technical skills, tools, and technologies.",
};

const contact = {
  name: "Contact",
  description: "Let's connect and discuss.",
};

const experience = {
  name: "Experience",
  description: "Explore my professional journey and work experience.",
};

const education = {
  name: "Education",
  description: "Discover my academic background and technical training.",
};

const project = {
  name: "Projects",
  description: "Explore some of my projects.",
};

// Along the horizontal road (z = 0), one station per section column
export const stations = [
  {
    id: 1,
    title: "West Station",
    position: [-28, 0.05, 0],
    north: profile,
    south: experience,
  },
  {
    id: 2,
    title: "Central Station",
    position: [0, 0.05, 0],
    north: contact,
    south: education,
  },
  {
    id: 3,
    title: "East Station",
    position: [28, 0.05, 0],
    north: skills,
    south: project,
  },
];
